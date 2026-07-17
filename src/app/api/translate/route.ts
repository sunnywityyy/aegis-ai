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
    console.log(`[translate] GROQ key loaded: ${apiKey.substring(0, 8)}${'*'.repeat(Math.max(0, apiKey.length - 8))}`)

    let payload: { text: string; targetLanguage: string }
    try {
      payload = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request parameters." },
        { status: 400 }
      )
    }

    const { text, targetLanguage } = payload
    if (!text || !targetLanguage) {
      return NextResponse.json(
        { success: false, error: "Text and targetLanguage are required parameters." },
        { status: 400 }
      )
    }

    const groq = new Groq({ apiKey })

    // Prompt instructions for pure text translation
    const LANG_NAMES_MAP: Record<string, string> = {
      en: "English", es: "Spanish", hi: "Hindi", fr: "French",
      pt: "Portuguese", ar: "Arabic", de: "German", ja: "Japanese",
      ko: "Korean", it: "Italian", zh: "Chinese", ru: "Russian",
    }
    const targetLangName = LANG_NAMES_MAP[targetLanguage] || targetLanguage
    const systemPrompt = `You are a professional language translator for the FIFA World Cup 2026 volunteer system.
Your task is to translate the user text into ${targetLangName} (ISO code: ${targetLanguage}).
Follow these rules:
1. Output ONLY the translated text. Do NOT wrap in quotes, do NOT add comments, do NOT add notes, and do NOT explain.
2. Keep proper nouns (stadium names, gate labels, section numbers) in their original form.
3. Use natural, everyday speech appropriate for a stadium environment.
4. If the input is already in ${targetLangName}, return it unchanged.`

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system" as const, content: systemPrompt },
        { role: "user" as const, content: text },
      ],
      temperature: 0.1,
    })

    const translatedText = response.choices?.[0]?.message?.content?.trim() || text

    return NextResponse.json({
      success: true,
      translatedText,
    })

  } catch (error: any) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Translation failed." },
      { status: 500 }
    )
  }
}
