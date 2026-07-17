import { collection, query, where, getDocs, doc, getDoc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/services/firebase/firebase"
import { BaseFirestoreService } from "@/services/firestore/base-service"
import { IncidentLogDocument, IncidentResolutionDocument, VolunteerDocument, MatchDocument } from "@/types/firestore"

// Extend BaseFirestoreService for the two incident collections
export class IncidentLogsService extends BaseFirestoreService<IncidentLogDocument> {
  constructor() {
    super("incident_logs")
  }
}
export const incidentLogsService = new IncidentLogsService()

export class IncidentResolutionsService extends BaseFirestoreService<IncidentResolutionDocument> {
  constructor() {
    super("incident_resolutions")
  }
}
export const incidentResolutionsService = new IncidentResolutionsService()

/**
 * AI Incident Copilot Service.
 * Manages incident logging pipeline triggers, calls the dedicated /api/copilot endpoint,
 * and handles resolving incidents with custom resolution records.
 */
export const copilotService = {
  /**
   * Evaluates reported raw incidents, calls Groq AI copilot route,
   * and saves the log in the 'incident_logs' collection.
   */
  async processIncident(
    incidentText: string, 
    volunteerEmail: string,
    location?: string,
    category?: string
  ): Promise<{
    success: boolean
    incidentLogId?: string
    log?: IncidentLogDocument
    error?: string
  }> {
    try {
      // 1. Fetch Volunteer Profile
      const volunteersCol = collection(db, "volunteers")
      const volunteerQuery = query(volunteersCol, where("email", "==", volunteerEmail))
      const volunteerSnap = await getDocs(volunteerQuery)
      if (volunteerSnap.empty) {
        return { success: false, error: `No volunteer profile found for: "${volunteerEmail}".` }
      }
      const volunteerDoc = volunteerSnap.docs[0]
      const volunteer = { id: volunteerDoc.id, ...volunteerDoc.data() } as VolunteerDocument

      // 2. Fetch Match Details
      const matchesCol = collection(db, "matches")
      const matchesSnap = await getDocs(matchesCol)
      if (matchesSnap.empty) {
        return { success: false, error: "No active tournament matches scheduled." }
      }
      const matchDoc = matchesSnap.docs[0]
      const match = { id: matchDoc.id, ...matchDoc.data() } as MatchDocument

      // 3. Query the AI Incident Copilot Route & Measure Latency
      const startTime = Date.now()
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          incidentText,
          volunteerName: volunteer.name,
          volunteerZone: location || volunteer.zone || "East Entrance",
          pairing: match.match,
          venue: match.venue,
        }),
      })
      const latency = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`Copilot API route returned status code: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !data.response) {
        throw new Error(data.error || "Failed to retrieve incident operational actions.")
      }

      const copilotResponse = data.response

      // 4. Save to Firestore incident_logs
      const logData: Omit<IncidentLogDocument, "id" | "createdAt" | "updatedAt"> = {
        volunteerId: volunteer.id || "unknown",
        matchId: match.id || "unknown",
        incident: incidentText,
        response: copilotResponse,
        status: "open",
        latency: latency,
      }

      const incidentLogId = await incidentLogsService.create(logData)

      // Save to 'incidents' collection using Firestore auto-generated ID
      try {
        const incidentsCol = collection(db, "incidents")
        await addDoc(incidentsCol, {
          title: copilotResponse.incidentType || category || "General Incident",
          description: incidentText,
          location: location || volunteer.zone || "East Entrance",
          severity: copilotResponse.severity === "critical" ? "critical" : copilotResponse.severity === "high" ? "warning" : "info",
          status: "open",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      } catch (incErr) {
        console.error("Failed to save to incidents collection:", incErr)
      }

      // Save to 'recommendations' collection using Firestore auto-generated ID
      try {
        const recommendationsCol = collection(db, "recommendations")
        for (const action of copilotResponse.immediateActions) {
          await addDoc(recommendationsCol, {
            volunteerId: volunteer.id || "unknown",
            matchId: match.id || "unknown",
            action: action,
            reason: copilotResponse.summary,
            priority: copilotResponse.severity,
            confidence: copilotResponse.confidence,
            expectedImpact: copilotResponse.riskAssessment,
            aiModel: "Groq Llama-3.1-8b-instant",
            latency: latency,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          })
        }
      } catch (recErr) {
        console.error("Failed to save to recommendations collection:", recErr)
      }

      return {
        success: true,
        incidentLogId,
        log: { id: incidentLogId, ...logData } as IncidentLogDocument,
      }

    } catch (error: any) {
      console.error("CopilotService error inside processIncident:", error)
      throw error
    }
  },

  /**
   * Resolves an open incident:
   * - Sets status to 'resolved' on the log document.
   * - Records an audit document inside 'incident_resolutions' containing calculated resolutionTime.
   */
  async resolveIncident(incidentLogId: string, volunteerId: string): Promise<string> {
    try {
      // 1. Retrieve the incident log doc to compute duration
      const docRef = doc(db, "incident_logs", incidentLogId)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        if (incidentLogId === "inc-1" || incidentLogId.startsWith("demo-")) {
          return "mock-resolution-id"
        }
        throw new Error(`Incident log document with ID "${incidentLogId}" does not exist.`)
      }

      const log = docSnap.data() as IncidentLogDocument

      // Compute elapsed resolution time in seconds
      let resolutionTime = 300 // default fallback 5 mins
      if (log.createdAt) {
        const createdMs = log.createdAt.toDate ? log.createdAt.toDate().getTime() : Date.now() - 300000
        resolutionTime = Math.max(Math.round((Date.now() - createdMs) / 1000), 1)
      }

      // 2. Update log status in incident_logs
      await updateDoc(docRef, {
        status: "resolved",
        updatedAt: serverTimestamp(),
      })

      // 3. Create incident_resolutions record
      const resolutionId = await incidentResolutionsService.create({
        incidentId: incidentLogId,
        resolvedAt: serverTimestamp(),
        resolutionTime,
        resolvedBy: volunteerId,
        effectivenessScore: 100, // perfect default score
      })

      return resolutionId

    } catch (error: any) {
      console.error("CopilotService error inside resolveIncident:", error)
      throw error
    }
  }
}
export default copilotService
