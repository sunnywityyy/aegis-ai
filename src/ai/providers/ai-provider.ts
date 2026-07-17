import { RecommendationItem } from "@/types/analysis"

export interface AIProvider {
  /**
   * The name identifier of the LLM provider (e.g., "Groq", "Gemini").
   */
  readonly name: string

  /**
   * Sends structured prompt guidelines to the underlying LLM provider
   * and returns a parsed list of recommendations.
   *
   * @param systemPrompt Instructions specifying system roles, rules, and JSON schemas.
   * @param userPrompt The consolidated operational context details.
   */
  generateRecommendations(systemPrompt: string, userPrompt: string): Promise<RecommendationItem[]>
}
