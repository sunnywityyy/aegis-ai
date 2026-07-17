import { NextResponse } from "next/server"
import { DecisionEngine } from "@/ai/decision-engine"
import { GroqProvider } from "@/ai/providers/groq-provider"
import { RawStadiumData } from "@/types/ai-engine"

/**
 * Next.js POST API Route Handler for stadium cognitive operations analysis.
 * Processes raw operational telemetry, queries LLMs via the DecisionEngine,
 * and returns structured recommendations securely without exposing keys to clients.
 */
export async function POST(request: Request) {
  try {
    // 1. Verify and parse JSON request body
    let rawData: RawStadiumData
    try {
      rawData = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid request payload. Must provide a valid JSON body." 
        },
        { status: 400 }
      )
    }

    // 2. Perform initial request shape validation
    if (!rawData || typeof rawData !== "object") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Request body cannot be empty and must represent a valid operational telemetry payload." 
        },
        { status: 400 }
      )
    }

    // 3. Initialize the Decision Engine with the abstract Groq provider
    const provider = new GroqProvider()
    const engine = new DecisionEngine(provider)

    // 4. Evaluate telemetry and fetch AI recommendations
    const result = await engine.processOperationalData(rawData)

    // 5. Return parsed recommendations and classification outcomes
    return NextResponse.json({
      success: true,
      recommendation: result.providerOutput[0] || null, // Direct singular recommendation format compatibility
      recommendations: result.providerOutput, // Complete recommendation listing
      classifications: result.classifications,
    })

  } catch (error: any) {
    console.error("Critical error in /api/analyze route handler:", error)
    
    // Return standard error payload
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || "An unexpected error occurred during stadium cognitive analysis." 
      },
      { status: 500 }
    )
  }
}
