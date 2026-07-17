import { NextResponse } from "next/server"
import Groq from "groq-sdk"
import { IncidentCopilotResponse } from "@/types/firestore"

/**
 * Next.js POST API Route Handler for AI Incident Copilot analysis.
 * Receives the incident description and contextual telemetry, queries Groq Llama3,
 * and returns structured immediate actions and resource dispatches.
 */
export async function POST(request: Request) {
  try {
    // 1. Verify credentials
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY is not defined on the server host." },
        { status: 500 }
      )
    }
    console.log(`[copilot] GROQ key loaded: ${apiKey.substring(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 8))}`)

    // 2. Parse JSON body payload
    let payload: {
      incidentText: string
      volunteerName: string
      volunteerZone: string
      matchPairing: string
      venue: string
    }

    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request parameters." },
        { status: 400 }
      )
    }

    const { incidentText, volunteerName, volunteerZone, venue } = payload
    if (!incidentText) {
      return NextResponse.json(
        { success: false, error: "Incident text report description is required." },
        { status: 400 }
      )
    }

    // 3. Setup prompt instructions
    const systemPrompt = `You are the Aegis AI Incident Copilot, a senior incident response assistant for FIFA World Cup 2026.
Your role is to analyze raw volunteer incident reports at stadium sectors and output structured, immediate response directives.

OUTPUT INSTRUCTIONS:
- You MUST respond with a single, valid JSON object matching the JSON schema below.
- Do NOT wrap the JSON in markdown formatting (no \`\`\`json block code).
- Do NOT output any reasoning, chain of thought steps, preamble, or notes.
- Respond ONLY with the JSON object.

REQUIRED JSON SCHEMA:
{
  "incidentType": "string (brief type classification, e.g. 'Ingress Surge', 'Medical Distress', 'Lost Child')",
  "severity": "string (must be one of: 'critical', 'high', 'medium', 'low')",
  "summary": "string (concise summary description of the reported issue)",
  "rootCause": "string (concise Root Cause Analysis explanation)",
  "immediateActions": ["string (at least 3 brief, actionable volunteer dispatch steps)"],
  "volunteerDeploymentPlan": "string (detailed volunteer deployment coordination strategy)",
  "publicAnnouncements": {
    "en": "string (stadium announcement script in English)",
    "hi": "string (stadium announcement script in Hindi)",
    "es": "string (stadium announcement script in Spanish)",
    "fr": "string (stadium announcement script in French)",
    "pt": "string (stadium announcement script in Portuguese)",
    "ar": "string (stadium announcement script in Arabic)"
  },
  "riskAssessment": "string (operational risk levels and cascade failure assessments)",
  "estimatedResolutionTime": "string (estimated resolution duration, e.g. '15-20 minutes')",
  "confidence": number (integer between 50 and 100 representing confidence certitude)
}`

    const userPrompt = `[STADIUM CONTEXT]
Venue: ${venue || "MetLife Stadium"}
Reporting Volunteer: ${volunteerName || "Sunil Kumar"} (Stationed at: ${volunteerZone || "East Entrance"})

[INCIDENT REPORT TEXT]
"${incidentText}"`

    const groq = new Groq({ apiKey })

    // 4. Query Groq Chat Completions
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: userPrompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" as const },
    })

    const content = response.choices?.[0]?.message?.content
    if (!content) {
      throw new Error("Groq API returned an empty message content payload.")
    }

    // 5. Parse LLM response safely
    const parsedData = JSON.parse(content) as IncidentCopilotResponse

    // Validate properties
    const copilotResponse: IncidentCopilotResponse = {
      incidentType: String(parsedData.incidentType || "General Incident"),
      severity: (["critical", "high", "medium", "low"].includes(String(parsedData.severity).toLowerCase())
        ? String(parsedData.severity).toLowerCase()
        : "medium") as any,
      summary: String(parsedData.summary || "Incident reported near stadium sectors."),
      rootCause: String(parsedData.rootCause || "Unknown system load anomaly."),
      immediateActions: Array.isArray(parsedData.immediateActions) 
        ? parsedData.immediateActions.map(String) 
        : ["Report status to local sector lead.", "Monitor queue velocity changes."],
      volunteerDeploymentPlan: String(parsedData.volunteerDeploymentPlan || "Deploy 2 Local Assistance Volunteers"),
      publicAnnouncements: {
        en: String(parsedData.publicAnnouncements?.en || "Attention guests: Operations teams are managing a local event. Please follow volunteer instructions."),
        hi: String(parsedData.publicAnnouncements?.hi || "मेहमानों का ध्यान दें: संचालन टीमें स्थानीय घटना का प्रबंधन कर रही हैं। कृपया स्वयंसेवकों के निर्देशों का पालन करें।"),
        es: String(parsedData.publicAnnouncements?.es || "Atención espectadores: Los equipos de operaciones están gestionando un evento local. Siga las instrucciones del personal voluntario."),
        fr: String(parsedData.publicAnnouncements?.fr || "Attention spectateurs: Les équipes opérationnelles gèrent un événement local. Veuillez suivre les instructions des bénévoles."),
        pt: String(parsedData.publicAnnouncements?.pt || "Atenção espectadores: As equipes de operações estão gerenciando um evento local. Siga as instruções dos voluntários."),
        ar: String(parsedData.publicAnnouncements?.ar || "انتباه للزوار: تدير فرق العمليات حدثا محليا. يرجى اتباع توجيهات المتطوعين.")
      },
      riskAssessment: String(parsedData.riskAssessment || "Low risk. Localized incident event."),
      estimatedResolutionTime: String(parsedData.estimatedResolutionTime || "10-15 minutes"),
      confidence: Number(parsedData.confidence || 85),
      escalationRequired: Boolean(parsedData.escalationRequired),
      suggestedResources: Array.isArray(parsedData.suggestedResources)
        ? parsedData.suggestedResources.map(String)
        : [],
    }

    return NextResponse.json({
      success: true,
      response: copilotResponse,
    })

  } catch (error: any) {
    console.error("Critical error in /api/copilot route handler:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Incident evaluation failed." },
      { status: 500 }
    )
  }
}
