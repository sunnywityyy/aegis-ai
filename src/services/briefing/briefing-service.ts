import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/services/firebase/firebase"
import { recommendationsService } from "@/services/firestore/recommendations"
import { VolunteerDocument, MatchDocument } from "@/types/firestore"
import { RecommendationItem } from "@/types/analysis"

export interface MissionBriefResult {
  success: boolean
  reason?: string
  volunteer?: VolunteerDocument
  match?: MatchDocument
  recommendations?: RecommendationItem[]
  latencyMs?: number
  aiModel?: string
}

/**
 * Briefing Service Orchestrator.
 * Handles database operations (Volunteers & Matches queries), calls the local AI route handler,
 * logs request latency parameters, and records recommendations to Firestore.
 */
export const briefingService = {
  async getMissionBrief(volunteerEmail: string): Promise<MissionBriefResult | null> {
    try {
      // 1. Fetch Volunteer Profile by Email
      const volunteersCol = collection(db, "volunteers")
      const volunteerQuery = query(volunteersCol, where("email", "==", volunteerEmail))
      const volunteerSnap = await getDocs(volunteerQuery)
      
      if (volunteerSnap.empty) {
        return {
          success: false,
          reason: `No volunteer profile matches the active email account: "${volunteerEmail}".`,
        }
      }

      const volunteerDoc = volunteerSnap.docs[0]
      const volunteer = { id: volunteerDoc.id, ...volunteerDoc.data() } as VolunteerDocument

      // 2. Fetch Today's Active Match Operations
      const matchesCol = collection(db, "matches")
      const matchesSnap = await getDocs(matchesCol)
      
      if (matchesSnap.empty) {
        return {
          success: false,
          reason: "No active tournament matches are currently scheduled in the operations database.",
        }
      }

      const matchDoc = matchesSnap.docs[0]
      const match = { id: matchDoc.id, ...matchDoc.data() } as MatchDocument

      // 3. Consolidate Raw Stadium Data Telemetry parameters
      // (Using standard live parameters to simulate real-time operations)
      const rawPayload = {
        volunteerProfile: {
          name: volunteer.name,
          zone: volunteer.zone,
          shift: volunteer.shift,
          status: volunteer.status,
        },
        matchContext: {
          competition: match.competition,
          match: match.match,
          venue: match.venue,
          kickoff: match.kickoff,
          attendance: match.attendance,
          volunteerZone: match.volunteerZone,
          role: match.role,
        },
        crowdDensity: 0.78, // occupancy metrics
        weather: {
          condition: "Rain expected",
          precipitationChance: 65,
          minutesToPrecipitation: 15,
        },
        transportStatus: {
          metroDelayMinutes: 8,
          metroStatusLabel: "Transit grid congestion near parking area P3",
          busShuttleActive: true,
        },
        accessibilityAlerts: [
          "Elevator offline at Section 110",
        ],
        medicalReadiness: {
          personnelCount: 14,
          stationStatus: "available" as const,
        },
        previousRecommendations: [],
      }

      // 4. Invoke the AI Analyze Endpoint & Measure Latency
      const startTime = Date.now()
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rawPayload),
      })
      const latency = Date.now() - startTime

      if (!response.ok) {
        throw new Error(`Analyze API route returned status code: ${response.status}`)
      }

      const data = await response.json()
      if (!data.success || !data.recommendations) {
        throw new Error(data.error || "Failed to retrieve recommendations from Decision Engine.")
      }

      const recommendations = data.recommendations as RecommendationItem[]
      const modelIdentifier = "Groq Llama-3.1-8b-instant"

      // 5. Caching Recommendations array to Firestore
      for (const rec of recommendations) {
        await recommendationsService.create({
          volunteerId: volunteer.id || "unknown",
          matchId: match.id || "unknown",
          aiModel: modelIdentifier,
          latency: latency,
          confidence: rec.confidence,
          action: rec.action,
          reason: rec.reason,
          expectedImpact: rec.expectedImpact,
          priority: rec.priority,
        })
      }

      return {
        success: true,
        volunteer,
        match,
        recommendations,
        latencyMs: latency,
        aiModel: modelIdentifier,
      }

    } catch (error: any) {
      console.error("BriefingService error during getMissionBrief:", error)
      throw error
    }
  }
}
export default briefingService
