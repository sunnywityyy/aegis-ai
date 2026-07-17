import { 
  MatchContextData, 
  VolunteerProfileData, 
  RecommendationItem, 
  StadiumZoneStatus, 
  TimelineEvent 
} from "@/types/analysis"

/**
 * Mapper functions to translate raw payloads (from Gemini, Firebase, or external API schemas)
 * into Aegis AI frontend-ready TypeScript interfaces.
 */

export function mapMatchContext(raw: any): MatchContextData {
  if (!raw) return {
    competition: "",
    match: "",
    venue: "",
    kickoff: "",
    attendance: "",
    volunteerZone: "",
    role: "",
  }

  return {
    competition: raw.competition || raw.tournament_name || "",
    match: raw.match || (raw.home_team && raw.away_team ? `${raw.home_team} vs ${raw.away_team}` : ""),
    venue: raw.venue || raw.stadium_name || "",
    kickoff: raw.kickoff || raw.start_time || "",
    attendance: raw.attendance || (raw.expected_attendance ? String(raw.expected_attendance) : ""),
    volunteerZone: raw.volunteerZone || raw.duty_station || "",
    role: raw.role || raw.duty_role || "",
  }
}

export function mapVolunteerProfile(raw: any): VolunteerProfileData {
  if (!raw) return { name: "", zone: "", shift: "", status: "" }

  return {
    name: raw.name || raw.display_name || "",
    zone: raw.zone || raw.assigned_zone || "",
    shift: raw.shift || raw.shift_hours || "",
    status: raw.status || raw.duty_status || "",
  }
}

export function mapRecommendation(raw: any): RecommendationItem {
  if (!raw) return {
    id: "",
    action: "",
    reason: "",
    expectedImpact: "",
    confidence: 0,
    priority: "optimal",
  }

  // Normalize priorities
  let priorityVal: "critical" | "high" | "optimal" = "optimal"
  const rawPriority = String(raw.priority || raw.urgency_level || "").toLowerCase()
  if (rawPriority === "critical" || rawPriority === "high") {
    priorityVal = rawPriority
  }

  return {
    id: raw.id || raw.recommendation_id || "",
    action: raw.action || raw.action_plan || "",
    reason: raw.reason || raw.trigger_reason || "",
    expectedImpact: raw.expectedImpact || raw.projected_impact || "",
    confidence: Number(raw.confidence || raw.inference_confidence || 0),
    priority: priorityVal,
  }
}

export function mapStadiumZone(raw: any): StadiumZoneStatus {
  if (!raw) return {
    id: "",
    name: "",
    status: "",
    risk: "info",
    icon: "security",
  }

  // Normalize icon types
  let iconVal: "gate" | "train" | "medical" | "security" = "security"
  const rawIcon = String(raw.icon || raw.zone_icon || "").toLowerCase()
  if (["gate", "train", "medical", "security"].includes(rawIcon)) {
    iconVal = rawIcon as any
  }

  return {
    id: raw.id || raw.zone_id || "",
    name: raw.name || raw.zone_name || "",
    status: raw.status || raw.current_status || "",
    risk: raw.risk || raw.risk_level || "info",
    icon: iconVal,
  }
}

export function mapTimelineEvent(raw: any): TimelineEvent {
  if (!raw) return { id: "", label: "" }

  return {
    id: raw.id || raw.event_id || "",
    label: raw.label || raw.description || "",
  }
}
export function mapTimelineEventsList(raw: any[]): TimelineEvent[] {
  if (!Array.isArray(raw)) return []
  return raw.map(mapTimelineEvent)
}

export function mapRecommendationsList(raw: any[]): RecommendationItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map(mapRecommendation)
}

export function mapStadiumZonesList(raw: any[]): StadiumZoneStatus[] {
  if (!Array.isArray(raw)) return []
  return raw.map(mapStadiumZone)
}
