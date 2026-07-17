import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import { db } from "@/services/firebase/firebase"
import { VolunteerDocument, MatchDocument, RecommendationDocument, IncidentLogDocument } from "@/types/firestore"

/**
 * Operations Center Dashboard Service.
 * Exposes core Firestore queries to fetch active match schedules, volunteer details,
 * recent AI recommendations, and active (unresolved) incident logs.
 */
export const dashboardService = {
  /**
   * Retrieves today's active match scheduled in the database.
   */
  async getActiveMatch(): Promise<MatchDocument | null> {
    try {
      const matchesCol = collection(db, "matches")
      const matchSnap = await getDocs(matchesCol)
      if (!matchSnap.empty) {
        return { id: matchSnap.docs[0].id, ...matchSnap.docs[0].data() } as MatchDocument
      }
      return null
    } catch (error) {
      console.error("DashboardService error (getActiveMatch):", error)
      throw error
    }
  },

  /**
   * Retrieves a volunteer's profile metadata by their email address.
   */
  async getVolunteerProfile(email: string): Promise<VolunteerDocument | null> {
    try {
      const volunteersCol = collection(db, "volunteers")
      const q = query(volunteersCol, where("email", "==", email))
      const snap = await getDocs(q)
      if (!snap.empty) {
        return { id: snap.docs[0].id, ...snap.docs[0].data() } as VolunteerDocument
      }
      return null
    } catch (error) {
      console.error("DashboardService error (getVolunteerProfile):", error)
      throw error
    }
  },

  /**
   * Retrieves active incident logs (where status is still open).
   */
  async getUnresolvedIncidents(): Promise<IncidentLogDocument[]> {
    try {
      const incidentsCol = collection(db, "incident_logs")
      const q = query(incidentsCol, where("status", "==", "open"))
      const snap = await getDocs(q)
      const logs: IncidentLogDocument[] = []
      snap.forEach((docSnap) => {
        logs.push({ id: docSnap.id, ...docSnap.data() } as IncidentLogDocument)
      })
      return logs
    } catch (error) {
      console.error("DashboardService error (getUnresolvedIncidents):", error)
      throw error
    }
  },

  /**
   * Retrieves recent AI Recommendations logs.
   */
  async getRecentRecommendations(): Promise<RecommendationDocument[]> {
    try {
      const recommendationsCol = collection(db, "recommendations")
      const q = query(recommendationsCol, orderBy("createdAt", "desc"))
      const snap = await getDocs(q)
      const recs: RecommendationDocument[] = []
      snap.forEach((docSnap) => {
        recs.push({ id: docSnap.id, ...docSnap.data() } as RecommendationDocument)
      })
      return recs
    } catch (error) {
      console.error("DashboardService error (getRecentRecommendations):", error)
      throw error
    }
  }
}
export default dashboardService
