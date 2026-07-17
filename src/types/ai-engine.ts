import { MatchContextData, VolunteerProfileData, RecommendationItem } from "./analysis"

export interface RawStadiumData {
  volunteerProfile: VolunteerProfileData
  matchContext: MatchContextData
  crowdDensity: number // Value between 0.0 and 1.0 representing average stadium occupancy density
  weather: {
    condition: string
    precipitationChance: number // Percentage chance of rain/snow
    minutesToPrecipitation: number // Elapsed minutes before precipitation expected
  }
  transportStatus: {
    metroDelayMinutes: number
    metroStatusLabel: string
    busShuttleActive: boolean
  }
  accessibilityAlerts: string[]
  medicalReadiness: {
    personnelCount: number
    stationStatus: "available" | "busy" | "critical"
  }
  previousRecommendations: RecommendationItem[]
}

export interface NormalizedContext {
  timestamp: string
  volunteer: {
    name: string
    zone: string
    role: string
    shift: string
  }
  match: {
    competition: string
    pairing: string
    stadium: string
    kickoff: string
    estimatedAttendance: string
  }
  telemetry: {
    crowdOccupancyDensity: string
    weatherForecast: string
    metroDelaySeconds: number
    metroStatus: string
    shuttleStatus: string
    activeAccessibilityReports: string[]
    firstAidStationStatus: string
  }
  history: {
    recommendationCount: number
    lastActionsTaken: string[]
  }
}

export interface EngineClassifications {
  operationalPriority: "optimal" | "high" | "critical"
  incidentSeverity: "info" | "warning" | "alert" | "critical"
  selectedStrategy: "ingress-flow" | "transit-staggering" | "weather-response" | "standard-patrol"
}

export interface DecisionEngineResult {
  classifications: EngineClassifications
  rawPrompt: string
  providerOutput: RecommendationItem[]
}
