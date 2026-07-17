"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mic, MicOff, Volume2, Globe, Send, X, RefreshCw,
  AlertCircle, Sparkles, Loader2, User, ShieldCheck, ArrowDown
} from "lucide-react"

interface AIAssistantPanelProps {
  onClose: () => void
}

// Language locale map for speech recognition & synthesis
const LOCALE_MAP: Record<string, string> = {
  en: "en-US", es: "es-ES", hi: "hi-IN", fr: "fr-FR",
  pt: "pt-PT", ar: "ar-SA", de: "de-DE", ja: "ja-JP",
  ko: "ko-KR", it: "it-IT", zh: "zh-CN", ru: "ru-RU",
}

const LANG_FLAGS: Record<string, string> = {
  en: "🇬🇧", es: "🇪🇸", hi: "🇮🇳", fr: "🇫🇷",
  pt: "🇧🇷", ar: "🇸🇦", de: "🇩🇪", ja: "🇯🇵",
  ko: "🇰🇷", it: "🇮🇹", zh: "🇨🇳", ru: "🇷🇺",
  unknown: "🌐",
}

const LANG_NAMES: Record<string, string> = {
  en: "English", es: "Spanish", hi: "Hindi", fr: "French",
  pt: "Portuguese", ar: "Arabic", de: "German", ja: "Japanese",
  ko: "Korean", it: "Italian", zh: "Chinese", ru: "Russian",
}

// Manual override languages when confidence is low
const MANUAL_LANGUAGES = [
  { code: "es", label: "Spanish" }, { code: "hi", label: "Hindi" },
  { code: "fr", label: "French" }, { code: "pt", label: "Portuguese" },
  { code: "ar", label: "Arabic" }, { code: "de", label: "German" },
  { code: "ja", label: "Japanese" }, { code: "ko", label: "Korean" },
  { code: "it", label: "Italian" }, { code: "en", label: "English" },
]

interface ConversationMessage {
  id: string
  role: "fan" | "translation" | "volunteer" | "reply"
  text: string
  langCode?: string
  langName?: string
}

type Phase = "idle" | "listening" | "detecting" | "awaiting-reply" | "translating" | "done"

export function AIAssistantPanel({ onClose }: AIAssistantPanelProps) {
  // Core state
  const [phase, setPhase] = useState<Phase>("idle")
  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [error, setError] = useState<string | null>(null)

  // Detected language (persisted for whole conversation)
  const [detectedLangCode, setDetectedLangCode] = useState<string | null>(null)
  const [detectedLangName, setDetectedLangName] = useState<string | null>(null)
  const [lowConfidence, setLowConfidence] = useState(false)
  const [manualLangCode, setManualLangCode] = useState("es")

  // Volunteer reply
  const [volunteerText, setVolunteerText] = useState("")
  const [isReplyListening, setIsReplyListening] = useState(false)

  // Refs
  const recognitionRef = useRef<any>(null)
  const replyRecognitionRef = useRef<any>(null)
  const convoBottomRef = useRef<HTMLDivElement>(null)
  const volunteerInputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    convoBottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [conversation])

  // Build speech recognition instance
  const buildRecognition = useCallback((locale: string, onResult: (text: string) => void, onEnd: () => void) => {
    if (typeof window === "undefined") return null
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return null
    const rec = new SR()
    rec.continuous = false
    rec.interimResults = false
    rec.lang = locale
    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript?.trim()
      if (text) onResult(text)
    }
    rec.onerror = (e: any) => {
      setError(`Voice error: ${e.error === "no-speech" ? "No speech detected. Please try again." : e.error}`)
      onEnd()
    }
    rec.onend = onEnd
    return rec
  }, [])

  // ─── STEP 1: Fan taps Mic ────────────────────────────────────────────────
  const startFanListening = () => {
    if (typeof window === "undefined") return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      setError("Speech recognition is not supported. Please use Chrome or Edge.")
      return
    }
    setError(null)

    // Use detected lang locale if known, otherwise listen broadly
    const locale = detectedLangCode ? (LOCALE_MAP[detectedLangCode] || "en-US") : "en-US"

    const rec = buildRecognition(locale, handleFanSpeech, () => {
      setPhase(p => p === "listening" ? "idle" : p)
    })
    if (!rec) return
    recognitionRef.current = rec

    try {
      rec.start()
      setPhase("listening")
    } catch (e) {
      setError("Could not start microphone. Ensure mic permissions are granted.")
    }
  }

  const stopFanListening = () => {
    recognitionRef.current?.stop()
    setPhase("idle")
  }

  // ─── STEP 2: Detect language + translate to English ───────────────────────
  const handleFanSpeech = async (spokenText: string) => {
    setPhase("detecting")

    // Add raw fan speech immediately
    const fanMsgId = `fan-${Date.now()}`
    addMessage({ id: fanMsgId, role: "fan", text: spokenText })

    try {
      const res = await fetch("/api/detect-language", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: spokenText }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const { detectedCode, detectedLanguage, confidence, englishTranslation } = data

      // Store detected language for this conversation
      const effectiveLangCode = confidence < 0.6 ? manualLangCode : detectedCode
      const effectiveLangName = confidence < 0.6 ? (LANG_NAMES[manualLangCode] || manualLangCode) : detectedLanguage

      setDetectedLangCode(effectiveLangCode)
      setDetectedLangName(effectiveLangName)
      setLowConfidence(confidence < 0.6)

      // Update fan message with lang info
      updateMessage(fanMsgId, { langCode: effectiveLangCode, langName: effectiveLangName })

      // Add English translation message
      if (effectiveLangCode !== "en") {
        addMessage({
          id: `trans-${Date.now()}`,
          role: "translation",
          text: englishTranslation,
          langCode: "en",
          langName: "English",
        })
      }

      setPhase("awaiting-reply")
      setTimeout(() => volunteerInputRef.current?.focus(), 100)
    } catch (err: any) {
      setError(err.message || "Language detection failed.")
      setPhase("idle")
    }
  }

  // ─── STEP 3: Volunteer speaks English reply via mic ───────────────────────
  const startReplyListening = () => {
    const rec = buildRecognition("en-US", (text) => {
      setVolunteerText(text)
      setIsReplyListening(false)
    }, () => setIsReplyListening(false))
    if (!rec) return
    replyRecognitionRef.current = rec
    try {
      rec.start()
      setIsReplyListening(true)
    } catch (e) {
      setError("Could not start microphone for reply.")
    }
  }

  // ─── STEP 4: Translate volunteer reply → detected language ────────────────
  const sendVolunteerReply = async () => {
    if (!volunteerText.trim() || !detectedLangCode) return
    const replyText = volunteerText.trim()
    setVolunteerText("")
    setPhase("translating")

    // Add volunteer message immediately
    addMessage({
      id: `vol-${Date.now()}`,
      role: "volunteer",
      text: replyText,
    })

    try {
      // If fan spoke English, no translation needed
      if (detectedLangCode === "en") {
        addMessage({
          id: `reply-${Date.now()}`,
          role: "reply",
          text: replyText,
          langCode: "en",
          langName: "English",
        })
        speakText(replyText, "en")
        setPhase("awaiting-reply")
        return
      }

      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: replyText, targetLanguage: detectedLangCode }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error)

      const translated = data.translatedText

      // Add translated reply
      addMessage({
        id: `reply-${Date.now()}`,
        role: "reply",
        text: translated,
        langCode: detectedLangCode,
        langName: detectedLangName || detectedLangCode,
      })

      // ─── STEP 5: Play audio in fan's language ───────────────────────────
      speakText(translated, detectedLangCode)
      setPhase("awaiting-reply")
    } catch (err: any) {
      setError(err.message || "Translation failed.")
      setPhase("awaiting-reply")
    }
  }

  // ─── Text to Speech ───────────────────────────────────────────────────────
  const speakText = (text: string, langCode: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    utt.lang = LOCALE_MAP[langCode] || "en-US"
    const voices = window.speechSynthesis.getVoices()
    const match = voices.find(v => v.lang.startsWith(langCode))
    if (match) utt.voice = match
    utt.rate = 0.95
    window.speechSynthesis.speak(utt)
  }

  // ─── Conversation helpers ─────────────────────────────────────────────────
  const addMessage = (msg: ConversationMessage) => {
    setConversation(prev => [...prev, msg])
  }
  const updateMessage = (id: string, updates: Partial<ConversationMessage>) => {
    setConversation(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m))
  }

  const resetConversation = () => {
    recognitionRef.current?.stop()
    replyRecognitionRef.current?.stop()
    window.speechSynthesis?.cancel()
    setConversation([])
    setPhase("idle")
    setDetectedLangCode(null)
    setDetectedLangName(null)
    setLowConfidence(false)
    setVolunteerText("")
    setIsReplyListening(false)
    setError(null)
  }

  const isLoading = phase === "detecting" || phase === "translating"
  const fanFlag = LANG_FLAGS[detectedLangCode || "unknown"] || "🌐"

  return (
    <div className="w-full h-full flex flex-col border border-cyan-500/15 bg-slate-950/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl">
      
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Globe className="size-4 text-cyan-400" />
            {detectedLangCode && (
              <span className="absolute -top-1 -right-1 text-[8px]">{fanFlag}</span>
            )}
          </div>
          <span className="text-[11px] font-mono font-black uppercase tracking-widest text-slate-200">
            AI Volunteer Interpreter
          </span>
          {detectedLangCode && (
            <span className="text-[8px] font-mono text-cyan-400 border border-cyan-500/20 bg-cyan-950/20 px-1.5 py-0.5 rounded uppercase">
              {fanFlag} {detectedLangName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetConversation}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
            title="New Conversation"
          >
            <RefreshCw className="size-3.5" />
          </button>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/5"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ── Listening / Idle Zone ── */}
      <div className="shrink-0 border-b border-white/[0.04] px-4 py-3">
        
        {/* Status info */}
        {error && (
          <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/15 text-rose-400 flex items-center gap-1.5 text-[10px] font-mono">
            <AlertCircle className="size-3 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Low confidence lang selector */}
        {lowConfidence && phase === "awaiting-reply" && (
          <div className="mb-2 px-2.5 py-2 rounded-lg bg-amber-500/10 border border-amber-500/15 flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono text-amber-400 uppercase">Low confidence. Confirm language:</span>
            <select
              value={manualLangCode}
              onChange={(e) => {
                setManualLangCode(e.target.value)
                setDetectedLangCode(e.target.value)
                setDetectedLangName(LANG_NAMES[e.target.value] || e.target.value)
                setLowConfidence(false)
              }}
              className="bg-slate-900 text-[10px] text-slate-200 font-mono border border-white/10 rounded px-2 py-0.5 focus:outline-none cursor-pointer"
            >
              {MANUAL_LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Listening / Tap Mic button */}
        <div className="flex items-center gap-3">
          <button
            onClick={phase === "listening" ? stopFanListening : startFanListening}
            disabled={isLoading || phase === "awaiting-reply"}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              phase === "listening"
                ? "bg-rose-600 hover:bg-rose-500 text-white border border-rose-400/20"
                : "bg-cyan-600 hover:bg-cyan-500 text-slate-950 border border-cyan-400/20"
            }`}
          >
            {phase === "listening" ? (
              <><MicOff className="size-3.5" />Stop</>
            ) : isLoading ? (
              <><Loader2 className="size-3.5 animate-spin" />{phase === "detecting" ? "Detecting..." : "Translating..."}</>
            ) : (
              <><Mic className="size-3.5" />{detectedLangCode ? "Speak Again" : "Fan Tap Mic"}</>
            )}
          </button>

          {/* Status badge */}
          <div className="flex flex-col gap-0.5">
            {phase === "listening" && (
              <div className="flex items-center gap-0.5 h-5">
                {[0.3, 0.6, 1.0, 0.7, 0.4, 0.8, 0.5].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 bg-cyan-400 rounded-full"
                    animate={{ scaleY: [h, 1.0, h] }}
                    transition={{ duration: 0.5 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                    style={{ height: 18, originY: "center" }}
                  />
                ))}
              </div>
            )}
            <span className={`text-[8px] font-mono uppercase font-bold ${
              phase === "listening" ? "text-cyan-400" :
              phase === "detecting" ? "text-amber-400" :
              phase === "translating" ? "text-purple-400" :
              phase === "awaiting-reply" ? "text-emerald-400" :
              "text-slate-500"
            }`}>
              {phase === "listening" ? "● Listening..." :
               phase === "detecting" ? "◈ Detecting Language..." :
               phase === "translating" ? "◈ Translating..." :
               phase === "awaiting-reply" ? "◉ Ready — Awaiting Reply" :
               detectedLangCode ? `${fanFlag} ${detectedLangName} ↔ 🇬🇧 EN` :
               "Auto-detect · 10+ Languages"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Conversation Timeline ── */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 min-h-0">
        {conversation.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-6">
            <div className="text-3xl">🌍</div>
            <p className="text-[10px] font-mono text-slate-500 leading-relaxed max-w-[200px]">
              Tap the mic and let the fan speak in any language. The system will auto-detect and translate.
            </p>
          </div>
        )}

        <AnimatePresence>
          {conversation.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {msg.role === "fan" && (
                <div className="flex gap-2 items-start">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px]">
                    {LANG_FLAGS[msg.langCode || "unknown"] || "👤"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Fan</span>
                      {msg.langName && (
                        <span className="text-[8px] font-mono text-slate-600">({msg.langName})</span>
                      )}
                    </div>
                    <div className="bg-slate-900 border border-white/[0.05] rounded-xl rounded-tl-sm px-3 py-2 text-[11px] text-slate-200 font-sans italic">
                      "{msg.text}"
                    </div>
                  </div>
                </div>
              )}

              {msg.role === "translation" && (
                <div className="flex gap-2 items-start pl-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <ArrowDown className="size-2.5 text-cyan-500" />
                      <span className="text-[8px] font-mono font-bold text-cyan-400 uppercase">English</span>
                    </div>
                    <div className="bg-cyan-950/15 border border-cyan-500/10 rounded-xl rounded-tl-sm px-3 py-2 text-[11px] text-cyan-200 font-sans">
                      {msg.text}
                    </div>
                  </div>
                </div>
              )}

              {msg.role === "volunteer" && (
                <div className="flex gap-2 items-start justify-end">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[8px] font-mono font-bold text-slate-400 uppercase">Volunteer</span>
                      <span className="text-[8px]">👮</span>
                    </div>
                    <div className="bg-slate-800 border border-white/[0.06] rounded-xl rounded-tr-sm px-3 py-2 text-[11px] text-slate-100 font-sans max-w-[85%]">
                      {msg.text}
                    </div>
                  </div>
                  <div className="shrink-0 w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-[10px]">
                    👮
                  </div>
                </div>
              )}

              {msg.role === "reply" && (
                <div className="flex gap-2 items-start justify-end pr-8">
                  <div className="flex-1 flex flex-col items-end">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <ArrowDown className="size-2.5 text-emerald-500" />
                      <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase">
                        {LANG_FLAGS[msg.langCode || "en"]} {msg.langName}
                      </span>
                    </div>
                    <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-xl rounded-tr-sm px-3 py-2 text-[11px] text-emerald-200 font-sans italic max-w-[90%] flex items-start gap-2">
                      <span className="flex-1">"{msg.text}"</span>
                      <button
                        onClick={() => speakText(msg.text, msg.langCode || "en")}
                        className="shrink-0 text-emerald-400 hover:text-emerald-300 cursor-pointer"
                        title="Play audio"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={convoBottomRef} />
      </div>

      {/* ── Volunteer Reply Box ── */}
      {(phase === "awaiting-reply" || phase === "translating") && (
        <div className="shrink-0 px-3 pb-3 pt-2 border-t border-white/[0.05] bg-slate-950/40">
          <div className="text-[8px] font-mono text-slate-500 uppercase mb-1.5 flex items-center gap-1">
            <ShieldCheck className="size-2.5" />
            Volunteer Reply (English)
          </div>
          <div className="flex gap-2">
            {/* Speak reply mic */}
            <button
              onClick={isReplyListening ? () => { replyRecognitionRef.current?.stop(); setIsReplyListening(false) } : startReplyListening}
              disabled={phase === "translating"}
              className={`shrink-0 p-2.5 rounded-xl border text-xs transition-all cursor-pointer disabled:opacity-40 ${
                isReplyListening
                  ? "bg-rose-600 border-rose-400/20 text-white"
                  : "bg-slate-900 border-white/[0.06] text-slate-400 hover:text-white"
              }`}
              title={isReplyListening ? "Stop speaking" : "Speak reply"}
            >
              {isReplyListening ? <MicOff className="size-3.5" /> : <Mic className="size-3.5" />}
            </button>

            {/* Text input */}
            <input
              ref={volunteerInputRef}
              type="text"
              value={volunteerText}
              onChange={(e) => setVolunteerText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendVolunteerReply()}
              placeholder="Type English reply or tap mic to speak..."
              disabled={phase === "translating"}
              className="flex-1 bg-slate-900 border border-white/[0.06] rounded-xl px-3 py-2.5 text-[11px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/20 transition-all disabled:opacity-50 font-sans"
            />

            {/* Send */}
            <button
              onClick={sendVolunteerReply}
              disabled={!volunteerText.trim() || phase === "translating"}
              className="shrink-0 px-3.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {phase === "translating"
                ? <Loader2 className="size-3.5 animate-spin text-slate-600" />
                : <Send className="size-3.5" />
              }
            </button>
          </div>

          {isReplyListening && (
            <div className="mt-1.5 flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[0.5, 0.9, 0.6, 1.0, 0.7].map((h, i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 bg-rose-400 rounded-full"
                    animate={{ scaleY: [h, 1.0, h] }}
                    transition={{ duration: 0.4 + i * 0.07, repeat: Infinity }}
                    style={{ height: 12, originY: "center" }}
                  />
                ))}
              </div>
              <span className="text-[8px] font-mono text-rose-400 uppercase">Recording English reply...</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
