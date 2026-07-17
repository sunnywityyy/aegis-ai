import { NextResponse } from "next/server"
import Groq from "groq-sdk"

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GROQ_API_KEY is not defined." },
        { status: 500 }
      )
    }

    let payload: { text: string }
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request parameters." },
        { status: 400 }
      )
    }

    const { text } = payload
    if (!text?.trim()) {
      return NextResponse.json(
        { success: false, error: "Text is required." },
        { status: 400 }
      )
    }

    const groq = new Groq({ apiKey })

    const systemPrompt = `You are a language detection and translation engine.
Given the input text, you MUST:
1. Detect the language of the input.
2. Translate the input to English.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "detectedLanguage": "name of the detected language in English, e.g. Spanish, Hindi, Japanese",
  "detectedCode": "ISO 639-1 code, e.g. es, hi, ja, fr, pt, ar, de, ko, it, en",
  "confidence": 0.0 to 1.0 float representing detection confidence,
  "englishTranslation": "the text translated into English"
}

If the input is already in English:
- Set detectedLanguage to "English"
- Set detectedCode to "en"
- Set englishTranslation to the original text`

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: text },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" as const },
    })

    const content = response.choices?.[0]?.message?.content?.trim()
    if (!content) {
      throw new Error("Empty response from language detection model.")
    }

    const parsed = JSON.parse(content)

    return NextResponse.json({
      success: true,
      detectedLanguage: String(parsed.detectedLanguage || "Unknown"),
      detectedCode: String(parsed.detectedCode || "en"),
      confidence: Number(parsed.confidence ?? 0.9),
      englishTranslation: String(parsed.englishTranslation || text),
    })

  } catch (error: any) {
    console.error("Language detection API error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Language detection failed." },
      { status: 500 }
    )
  }
}
