import { NormalizedContext } from "@/types/ai-engine"

interface PromptBundle {
  systemPrompt: string
  userPrompt: string
}

/**
 * Builds structured prompts for the AI Provider.
 * Enforces strict JSON schemas and high-level reasoning instructions
 * while explicitly preventing any Chain-of-Thought / hidden steps in outputs.
 */
export function buildPrompt(context: NormalizedContext): PromptBundle {
  
  // 1. SYSTEM PROMPT: Establishes role, operations criteria, and schema constraints
  const systemPrompt = `You are Aegis AI, the senior stadium operations copilot for the FIFA World Cup 2026.
Your primary responsibility is to analyze real-time stadium telemetry and formulate highly actionable volunteer recommendations.

OUTPUT REQUIREMENTS:
- You MUST respond with a single, valid JSON object matching the JSON schema below.
- Do NOT include any markdown block formatting (e.g. do not wrap in \`\`\`json).
- Do NOT output any preamble, postamble, or Chain-of-Thought logs.
- Expose only the final resolved recommendations.

REQUIRED JSON SCHEMA:
{
  "recommendations": [
    {
      "id": "string (unique identifier, e.g., 'ai-rec-01')",
      "action": "string (clear, concise volunteer action, e.g., 'Deploy one volunteer to Gate C.')",
      "reason": "string (short operational reason, e.g., 'Metro arrival expected in 6 minutes.')",
      "expectedImpact": "string (quantitative projection of outcome, e.g., 'Reduce waiting time by 17%.')",
      "confidence": number (integer between 50 and 100 representing certainty, e.g., 94),
      "priority": "string (must be one of: 'critical', 'high', 'optimal')"
    }
  ]
}`

  // 2. OPERATIONAL CONTEXT: Formatted dynamic telemetry parameters
  const operationalContext = `[CURRENT OPERATIONAL TELEMETRY]
Timestamp: ${context.timestamp}
Match context: ${context.match.pairing} at ${context.match.stadium} (${context.match.competition})
Estimated Attendance: ${context.match.estimatedAttendance}
Volunteer: ${context.volunteer.name} (Role: ${context.volunteer.role}, Station: ${context.volunteer.zone})

Stadium Telemetry:
- Crowd Occupancy: ${context.telemetry.crowdOccupancyDensity}
- Weather: ${context.telemetry.weatherForecast}
- Transit: Metro status is ${context.telemetry.metroStatus} (Delay: ${context.telemetry.metroDelaySeconds} seconds), Shuttle buses are ${context.telemetry.shuttleStatus}
- Accessibility alerts: ${context.telemetry.activeAccessibilityReports.length > 0 ? context.telemetry.activeAccessibilityReports.join("; ") : "None reported"}
- First Aid / Medical readiness: ${context.telemetry.firstAidStationStatus}

History logs:
- Previously generated recommendations: ${context.history.recommendationCount}
- Historical actions logged: ${context.history.lastActionsTaken.length > 0 ? context.history.lastActionsTaken.join("; ") : "None"}`

  // 3. REASONING INSTRUCTIONS: Guidelines on what logic to perform without CoT exposition
  const reasoningInstructions = `[REASONING INSTRUCTIONS]
1. Cross-reference the crowd density warnings and transport delays against the volunteer's assigned station.
2. Select target gates that are experiencing surges or risk alerts and formulate volunteer dispatch plans.
3. Keep the explanations in the 'reason' property brief, focused, and data-backed.
4. Do NOT output your thinking, scratchpads, or intermediate logs. Only return the requested JSON.`

  // Combine user payload
  const userPrompt = `${operationalContext}

${reasoningInstructions}`

  return {
    systemPrompt,
    userPrompt,
  }
}
