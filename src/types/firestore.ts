import { FieldValue } from "firebase/firestore"

export interface BaseDocument {
  id?: string
  createdAt?: FieldValue | any
  updatedAt?: FieldValue | any
}

export interface VolunteerDocument extends BaseDocument {
  name: string
  email: string
  role: string
  zone: string
  shift: string
  language: string
  status: string
}

export interface MatchDocument extends BaseDocument {
  competition: string
  match: string
  venue: string
  kickoff: string
  attendance: string
  volunteerZone: string
  role: string
}

export interface RecommendationDocument extends BaseDocument {
  matchId: string
  volunteerId: string
  action: string
  reason: string
  expectedImpact: string
  confidence: number
  priority: "critical" | "high" | "optimal"
  aiModel: string
  latency: number
}

export interface IncidentDocument extends BaseDocument {
  title: string
  description: string
  location: string
  severity: "info" | "warning" | "alert" | "critical"
  status: "open" | "investigating" | "resolved"
}

export interface IncidentCopilotResponse {
  incidentType: string
  severity: "critical" | "high" | "medium" | "low"
  summary: string
  rootCause: string
  immediateActions: string[]
  volunteerDeploymentPlan: string
  publicAnnouncements: {
    en: string
    hi: string
    es: string
    fr: string
    pt: string
    ar: string
  }
  riskAssessment: string
  estimatedResolutionTime: string
  confidence: number
  escalationRequired?: boolean
  suggestedResources?: string[]
}

export interface IncidentLogDocument extends BaseDocument {
  volunteerId: string
  matchId: string
  incident: string
  response: IncidentCopilotResponse
  status: "open" | "resolved"
  latency: number
}

export interface IncidentResolutionDocument extends BaseDocument {
  incidentId: string
  resolvedAt: FieldValue | any
  resolutionTime: number // difference in seconds from log creation to resolution
  resolvedBy: string // volunteer ID
  effectivenessScore?: number
}
