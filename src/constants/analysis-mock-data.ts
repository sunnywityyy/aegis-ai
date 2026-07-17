/**
 * Raw Mock Payloads simulating database fields from Gemini/Firebase schemas.
 * Keys use non-camelCase names (e.g. tournament_name, expected_attendance) 
 * to validate translation via src/lib/mappers/analysis-mapper.ts.
 */

export const rawMatchContext = {
  tournament_name: "FIFA World Cup 2026",
  home_team: "Argentina",
  away_team: "Brazil",
  stadium_name: "MetLife Stadium",
  start_time: "19:30",
  expected_attendance: "82,400",
  duty_station: "East Entrance",
  duty_role: "Guest Assistance Volunteer",
}

export const rawVolunteerProfile = {
  display_name: "Sunil Kumar",
  assigned_zone: "East Entrance",
  shift_hours: "18:00–22:00",
  duty_status: "Ready",
}

export const rawTimelineEvents = [
  { event_id: "ev-1", description: "Crowd sensor cluster synchronized" },
  { event_id: "ev-2", description: "Metro arrival prediction model updated" },
  { event_id: "ev-3", description: "Historical match-day patterns compared" },
  { event_id: "ev-4", description: "Gate 6 risk score recalculated" },
  { event_id: "ev-5", description: "Accessibility routes verified" },
  { event_id: "ev-6", description: "Weather impact model completed" },
]

export const rawRecommendations = [
  {
    recommendation_id: "rec-1",
    action_plan: "Scan queue velocity at Gate C lanes.",
    trigger_reason: "Crowd density anomalies emerging near East sectors.",
    projected_impact: "Prevent bottleneck queues at ingress lanes.",
    inference_confidence: 89,
    urgency_level: "High",
  },
  {
    recommendation_id: "rec-2",
    action_plan: "Deploy one volunteer to Gate C.",
    trigger_reason: "Metro arrivals expected in 6 minutes.",
    projected_impact: "Reduce waiting time by 17%.",
    inference_confidence: 94,
    urgency_level: "Critical",
  },
  {
    recommendation_id: "rec-3",
    action_plan: "Stagger shuttle departures from East transit ring.",
    trigger_reason: "Metro delays overlapping with peak passenger boardings.",
    projected_impact: "Equalize terminal load factor, maintain 95% service SLA.",
    inference_confidence: 92,
    urgency_level: "Optimal",
  },
]
export const rawInitialStadiumZones = [
  { zone_id: "z-1", zone_name: "Gate A", current_status: "Normal", risk_level: "success", zone_icon: "gate" },
  { zone_id: "z-2", zone_name: "Gate C", current_status: "Normal", risk_level: "success", zone_icon: "gate" },
  { zone_id: "z-3", zone_name: "Metro Entrance", current_status: "Available", risk_level: "success", zone_icon: "train" },
  { zone_id: "z-4", zone_name: "Medical Centre", current_status: "Available", risk_level: "success", zone_icon: "medical" },
]
