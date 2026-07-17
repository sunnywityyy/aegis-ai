import { AIProvider } from "./providers/ai-provider"
import { buildNormalizedContext } from "./context-builder"
import { buildPrompt } from "./prompt-builder"
import { 
  RawStadiumData, 
  DecisionEngineResult, 
  EngineClassifications 
} from "@/types/ai-engine"

export class DecisionEngine {
  private provider: AIProvider

  constructor(provider: AIProvider) {
    this.provider = provider
  }

  /**
   * Evaluates raw telemetry feeds, calculates operational classifications,
   * compiles prompts, and queries the abstract AI Provider for action recommendations.
   *
   * @param rawData The raw stadium operations context payload.
   */
  async processOperationalData(rawData: RawStadiumData): Promise<DecisionEngineResult> {
    // 1. Data Validation
    this.validateRawData(rawData)

    // 2. Classifications Extraction
    const classifications = this.classifyOperationalMetrics(rawData)

    // 3. Normalize Context & Compile Prompt
    const normalizedContext = buildNormalizedContext(rawData)
    const promptBundle = buildPrompt(normalizedContext)

    // 4. Request recommendations via the Provider abstraction
    const providerOutput = await this.provider.generateRecommendations(
      promptBundle.systemPrompt,
      promptBundle.userPrompt
    )

    return {
      classifications,
      rawPrompt: `${promptBundle.systemPrompt}\n\n${promptBundle.userPrompt}`,
      providerOutput,
    }
  }

  /**
   * Helper to perform runtime schema validations.
   */
  private validateRawData(data: RawStadiumData): void {
    if (!data) {
      throw new Error("Telemetry payload cannot be null or undefined.")
    }
    if (!data.volunteerProfile || !data.volunteerProfile.name) {
      throw new Error("Volunteer profile name is required for operations auditing.")
    }
    if (!data.matchContext || !data.matchContext.match) {
      throw new Error("Match details are required to construct stadium context.")
    }
    if (data.crowdDensity < 0.0 || data.crowdDensity > 1.0) {
      throw new Error("Crowd density metric must reside in range [0.0, 1.0].")
    }
  }

  /**
   * Classifies inputs to choose operational priority, severity, and strategy rules.
   */
  private classifyOperationalMetrics(data: RawStadiumData): EngineClassifications {
    // Calculate Priority
    let operationalPriority: EngineClassifications["operationalPriority"] = "optimal"
    if (data.crowdDensity > 0.85 || data.transportStatus.metroDelayMinutes > 10) {
      operationalPriority = "critical"
    } else if (data.crowdDensity > 0.65 || data.weather.precipitationChance > 55) {
      operationalPriority = "high"
    }

    // Calculate Severity
    let incidentSeverity: EngineClassifications["incidentSeverity"] = "info"
    if (data.medicalReadiness.stationStatus === "critical" || data.accessibilityAlerts.length > 3) {
      incidentSeverity = "critical"
    } else if (data.transportStatus.metroDelayMinutes > 5) {
      incidentSeverity = "alert"
    } else if (data.weather.precipitationChance > 30) {
      incidentSeverity = "warning"
    }

    // Elect Reasoning Strategy
    let selectedStrategy: EngineClassifications["selectedStrategy"] = "standard-patrol"
    if (data.weather.precipitationChance > 40) {
      selectedStrategy = "weather-response"
    } else if (data.transportStatus.metroDelayMinutes > 3) {
      selectedStrategy = "transit-staggering"
    } else if (data.crowdDensity > 0.70) {
      selectedStrategy = "ingress-flow"
    }

    return {
      operationalPriority,
      incidentSeverity,
      selectedStrategy,
    }
  }
}
