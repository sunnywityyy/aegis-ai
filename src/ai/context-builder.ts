import { RawStadiumData, NormalizedContext } from "@/types/ai-engine"

/**
 * Consolidates and normalizes raw, diverse stadium operational data metrics 
 * into a single unified context structure. This ensures the output payload 
 * has strict structures for prompt construction or database syncing.
 */
export function buildNormalizedContext(rawData: RawStadiumData): NormalizedContext {
  const currentTimestamp = new Date().toISOString()
  
  const formattedCrowd = `${Math.round(rawData.crowdDensity * 100)}%`
  
  const weatherStr = `${rawData.weather.condition} forecast. Precipitation probability: ${rawData.weather.precipitationChance}%. expected onset: T+${rawData.weather.minutesToPrecipitation} minutes.`
  
  const shuttleStr = rawData.transportStatus.busShuttleActive ? "ACTIVE" : "STANDBY"
  
  const firstAidStr = `Staff Count: ${rawData.medicalReadiness.personnelCount}. load factor: ${rawData.medicalReadiness.stationStatus.toUpperCase()}`

  return {
    timestamp: currentTimestamp,
    volunteer: {
      name: rawData.volunteerProfile.name,
      zone: rawData.volunteerProfile.zone,
      role: rawData.matchContext.role,
      shift: rawData.volunteerProfile.shift,
    },
    match: {
      competition: rawData.matchContext.competition,
      pairing: rawData.matchContext.match,
      stadium: rawData.matchContext.venue,
      kickoff: rawData.matchContext.kickoff,
      estimatedAttendance: rawData.matchContext.attendance,
    },
    telemetry: {
      crowdOccupancyDensity: formattedCrowd,
      weatherForecast: weatherStr,
      metroDelaySeconds: rawData.transportStatus.metroDelayMinutes * 60,
      metroStatus: rawData.transportStatus.metroStatusLabel,
      shuttleStatus: shuttleStr,
      activeAccessibilityReports: [...rawData.accessibilityAlerts],
      firstAidStationStatus: firstAidStr,
    },
    history: {
      recommendationCount: rawData.previousRecommendations.length,
      lastActionsTaken: rawData.previousRecommendations.map((rec) => rec.action),
    },
  }
}
