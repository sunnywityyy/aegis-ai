import { StatusType } from "@/components/ui/status-badge"

export interface MatchContextData {
  competition: string
  match: string
  venue: string
  kickoff: string
  attendance: string
  volunteerZone: string
  role: string
}

export interface VolunteerProfileData {
  name: string
  zone: string
  shift: string
  status: string
}

export interface RecommendationItem {
  id: string
  action: string
  reason: string
  expectedImpact: string
  confidence: number
  priority: "critical" | "high" | "optimal"
}

export interface StadiumZoneStatus {
  id: string
  name: string
  status: string
  risk: StatusType
  icon: "gate" | "train" | "medical" | "security"
}

export interface TimelineEvent {
  id: string
  label: string
}
