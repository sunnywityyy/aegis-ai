"use client"

import { useState, useEffect } from "react"
import { collection, query, where, onSnapshot, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/services/firebase/firebase"
import { useAuth } from "@/features/auth/auth-provider"
import { VolunteerDocument, MatchDocument, RecommendationDocument, IncidentLogDocument } from "@/types/firestore"
import { ensureDatabaseSeeded } from "@/services/firebase/seeder"

export function useDashboard() {
  const { user } = useAuth()
  const [volunteer, setVolunteer] = useState<VolunteerDocument | null>(null)
  const [match, setMatch] = useState<MatchDocument | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationDocument[]>([])
  const [incidents, setIncidents] = useState<IncidentLogDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [reRunning, setReRunning] = useState(false)

  useEffect(() => {
    if (!user?.email) {
      setLoading(false)
      return
    }

    ensureDatabaseSeeded()

    setLoading(true)
    setError(null)

    let unsubscribeVolunteer: () => void = () => {}
    let unsubscribeRecommendations: () => void = () => {}
    let unsubscribeIncidents: () => void = () => {}

    const mockMatch: MatchDocument = {
      id: "demo-match-1",
      competition: "FIFA World Cup 2026",
      match: "Argentina vs Brazil",
      venue: "MetLife Stadium",
      kickoff: "20:00",
      attendance: "82,500",
      volunteerZone: "East Entrance (Gate C)",
      role: "Guest Assistance Team"
    }

    const mockVolunteer: VolunteerDocument = {
      id: "demo-volunteer-1",
      name: "Alejandro",
      email: user.email || "volunteer@aegis.ai",
      zone: "East Entrance (Gate C)",
      shift: "18:00 - 22:00",
      status: "active",
      role: "Guest Assistance Team",
      language: "Spanish"
    }

    const mockRecommendations: RecommendationDocument[] = [
      {
        id: "rec-1",
        volunteerId: "demo-volunteer-1",
        matchId: "demo-match-1",
        action: "Deploy Spanish Priority Staff to Gate C",
        reason: "Bilingual assistance request spike detected via local mobile feedback loop.",
        priority: "high",
        confidence: 96,
        expectedImpact: "Ingress load reduced by 15%",
        aiModel: "Groq Llama-3.1-8b-instant",
        latency: 120
      },
      {
        id: "rec-2",
        volunteerId: "demo-volunteer-1",
        matchId: "demo-match-1",
        action: "Metro Transit Surge Warning",
        reason: "Next arrival cluster carries 1.2x expected load. Open extra line segments.",
        priority: "critical",
        confidence: 92,
        expectedImpact: "Queue congestion cleared in 6m",
        aiModel: "Groq Llama-3.1-8b-instant",
        latency: 120
      }
    ]

    const mockIncidents: IncidentLogDocument[] = [
      {
        id: "inc-1",
        volunteerId: "demo-volunteer-1",
        matchId: "demo-match-1",
        latency: 145,
        incident: "Gate C crowd build-up near turnstile 4",
        status: "open",
        response: {
          severity: "high",
          incidentType: "Crowd Surge",
          summary: "Significant crowd density build-up near southeast turnstiles.",
          rootCause: "Turnstile checkpoint throughput bottlenecks combined with high cluster arrivals.",
          immediateActions: ["Direct volunteers to guide overflow to Gate D paths."],
          volunteerDeploymentPlan: "Deploy 4 Crowd Management Coordinators, Assign 2 Turnstile Assistance Volunteers",
          publicAnnouncements: {
            en: "Attention MetLife Stadium guests near Gate C: We are experiencing heavy entry volume. Please use adjacent turnstiles to ensure smooth ingress. Thank you.",
            hi: "गेट सी के पास मेटलाइफ़ स्टेडियम के मेहमानों के लिए ध्यान दें: हम भारी प्रवेश मात्रा का अनुभव कर रहे हैं। सुचारू प्रवेश सुनिश्चित करने के लिए कृपया बगल के टर्नस्टाइल का उपयोग करें। धन्यवाद।",
            es: "Atención a los espectadores del MetLife Stadium cerca de la Puerta C: Estamos experimentando un alto volumen de entrada. Utilice los torniquetes adyacentes para un ingreso fluido. Gracias.",
            fr: "Attention aux spectateurs du MetLife Stadium près de la Porte C: Nous connaissons un fort volume d'entrées. Veuillez utiliser les tourniquets adjacents pour une entrée fluide. Merci.",
            pt: "Atenção aos espectadores do MetLife Stadium perto do Portão C: Estamos enfrentando um alto volume de entrada. Use as catracas adjacentes para garantir uma entrada tranquila. Obrigado.",
            ar: "انتباه لزوار ملعب ميتلايف بالقرب من البوابة C: نشهد حجم دخول كثيف. يرجى استخدام الحواجز الدوارة المجاورة لضمان دخول سلس. شكرا لكم."
          },
          riskAssessment: "HIGH RISK: Queue delays exceeding 12 minutes if unchecked. Turnstile lane backups likely.",
          estimatedResolutionTime: "15 - 20 mins",
          confidence: 94,
          escalationRequired: false,
          suggestedResources: ["2 Volunteer Personnel", "Megaphone Guidance"]
        }
      }
    ]

    // Safety timeout: if Firestore fails to return details within 1.0s, fall back to mock data
    const fallbackTimer = setTimeout(() => {
      setIsDemoMode(true)
      setMatch(mockMatch)
      setVolunteer(mockVolunteer)
      setRecommendations((prev) => prev.length > 0 ? prev : mockRecommendations)
      setIncidents((prev) => prev.length > 0 ? prev : mockIncidents)
      setLoading(false)
    }, 1000)

    const setupListeners = async () => {
      try {
        // 1. Fetch Today's Match Context (Single one-time lookup since match is static for shift)
        const matchesCol = collection(db, "matches")
        const matchSnap = await getDocs(matchesCol)
        if (!matchSnap.empty) {
          setMatch({ id: matchSnap.docs[0].id, ...matchSnap.docs[0].data() } as MatchDocument)
        } else {
          setMatch(mockMatch)
        }

        // 2. Real-Time Volunteer Listener
        const volunteersCol = collection(db, "volunteers")
        const volunteerQuery = query(volunteersCol, where("email", "==", user.email))
        unsubscribeVolunteer = onSnapshot(volunteerQuery, (snapshot) => {
          if (!snapshot.empty) {
            const vDoc = snapshot.docs[0]
            setVolunteer({ id: vDoc.id, ...vDoc.data() } as VolunteerDocument)
          } else {
            setVolunteer(mockVolunteer)
          }
        }, (err) => {
          console.error("Volunteer snapshot error:", err)
        })

        // 3. Real-Time Recommendations Listener (ordered by timestamp)
        const recommendationsCol = collection(db, "recommendations")
        const recQuery = query(recommendationsCol, orderBy("createdAt", "desc"))
        unsubscribeRecommendations = onSnapshot(recQuery, (snapshot) => {
          const recs: RecommendationDocument[] = []
          snapshot.forEach((docSnap) => {
            recs.push({ id: docSnap.id, ...docSnap.data() } as RecommendationDocument)
          })
          setRecommendations(recs.length > 0 ? recs : mockRecommendations)
        }, (err) => {
          console.error("Recommendations snapshot error:", err)
        })

        // 4. Real-Time Unresolved Incidents Listener (status == 'open')
        const incidentsCol = collection(db, "incident_logs")
        const incidentQuery = query(incidentsCol, where("status", "==", "open"))
        unsubscribeIncidents = onSnapshot(incidentQuery, (snapshot) => {
          const incs: IncidentLogDocument[] = []
          snapshot.forEach((docSnap) => {
            incs.push({ id: docSnap.id, ...docSnap.data() } as IncidentLogDocument)
          })
          
          // Client-side Priority Sorting (Critical > High > Medium > Low)
          const priorityWeights = { critical: 4, high: 3, medium: 2, low: 1 }
          incs.sort((a, b) => {
            const wA = priorityWeights[a.response.severity] || 0
            const wB = priorityWeights[b.response.severity] || 0
            return wB - wA
          })

          setIncidents(incs.length > 0 ? incs : mockIncidents)
          clearTimeout(fallbackTimer)
          setLoading(false)
        }, (err) => {
          console.error("Incidents snapshot error:", err)
          setIncidents(mockIncidents)
          clearTimeout(fallbackTimer)
          setLoading(false)
        })

      } catch (err: any) {
        console.error("Error establishing real-time operational streams:", err)
        // Graceful fallback instead of setting error
        setIsDemoMode(true)
        setMatch(mockMatch)
        setVolunteer(mockVolunteer)
        setRecommendations(mockRecommendations)
        setIncidents(mockIncidents)
        clearTimeout(fallbackTimer)
        setLoading(false)
      }
    }

    setupListeners()

    // Clean up listeners on unmount
    return () => {
      clearTimeout(fallbackTimer)
      unsubscribeVolunteer()
      unsubscribeRecommendations()
      unsubscribeIncidents()
    }
  }, [user])

  // Re-run AI Assessment triggers background /api/analyze execution
  const rerunAssessment = async () => {
    if (!volunteer || !match) return
    setReRunning(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
          crowdDensity: 0.78,
          weather: {
            condition: "Rain expected",
            precipitationChance: 65,
            minutesToPrecipitation: 15,
          },
          transportStatus: {
            metroDelayMinutes: 8,
            metroStatusLabel: "Transit grid congestion",
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
        }),
      })

      if (!response.ok) {
        throw new Error(`Analyze API route returned code: ${response.status}`)
      }

      // Add new recommendations to Firestore (handled in page/service, or directly write them here)
      const data = await response.json()
      if (data.success && Array.isArray(data.recommendations)) {
        // Dynamic save to DB (since we are subscribed to recommendations, the UI updates automatically!)
        const { recommendationsService } = await import("@/services/firestore/recommendations")
        for (const rec of data.recommendations) {
          await recommendationsService.create({
            volunteerId: volunteer.id || "unknown",
            matchId: match.id || "unknown",
            aiModel: "Groq Llama-3.1-8b-instant",
            latency: 120, // estimated
            confidence: rec.confidence,
            action: rec.action,
            reason: rec.reason,
            expectedImpact: rec.expectedImpact,
            priority: rec.priority,
          })
        }
      }
    } catch (err) {
      console.error("Re-running AI assessment failed:", err)
    } finally {
      setReRunning(false)
    }
  }

  const [resolvedDemoIds, setResolvedDemoIds] = useState<string[]>([])

  const resolveIncident = async (incidentId: string) => {
    if (!volunteer) return
    try {
      const { copilotService } = await import("@/services/copilot/copilot-service")
      await copilotService.resolveIncident(incidentId, volunteer.id || "unknown")
      if (incidentId === "inc-1" || incidentId.startsWith("demo-")) {
        setResolvedDemoIds((prev) => [...prev, incidentId])
      }
    } catch (err) {
      console.error("Failed to resolve incident in dashboard hook:", err)
    }
  }

  const visibleIncidents = incidents.filter((inc) => !resolvedDemoIds.includes(inc.id || ""))

  return {
    volunteer,
    match,
    recommendations,
    incidents: visibleIncidents,
    loading,
    error,
    reRunning,
    rerunAssessment,
    isDemoMode,
    resolveIncident,
  }
}
export default useDashboard
