import React, { useState, useEffect } from "react"
import { CardGlass } from "@/components/ui/card-glass"
import { IncidentCopilotResponse } from "@/types/firestore"
import { RecommendationCard } from "./recommendation-card"
import {
  Brain, AlertTriangle, ShieldCheck, UserCheck,
  Loader2, Globe, Clock, CheckCircle2, Siren
} from "lucide-react"

interface IncidentResponseProps {
  response: IncidentCopilotResponse | null
  loading: boolean
  onResolve: () => void
  resolving: boolean
  incidentStatus?: "open" | "resolved"
}

const SEVERITY_STYLES: Record<string, string> = {
  critical: "text-rose-400 border-rose-500/30 bg-rose-950/15",
  high:     "text-amber-400 border-amber-500/30 bg-amber-950/15",
  medium:   "text-cyan-400 border-cyan-500/30 bg-cyan-950/15",
  low:      "text-emerald-400 border-emerald-500/30 bg-emerald-950/15",
}

const LOADING_STEPS = [
  "Analyzing incident telemetry...",
  "Cross-referencing stadium sensors...",
  "Evaluating historical precedents...",
  "Building deployment strategy...",
]

const ANNOUNCEMENTS: Record<string, Record<string, string>> = {
  congestion: {
    en: "Attention MetLife Stadium guests: We are experiencing high entry volume near Gate C. Please use adjacent turnstiles for smooth ingress. Thank you.",
    hi: "मेटलाइफ़ स्टेडियम के मेहमानों का ध्यान: गेट सी के पास भारी प्रवेश है। कृपया बगल के टर्नस्टाइल का उपयोग करें।",
    es: "Atención espectadores: Estamos experimentando alto volumen en la Puerta C. Por favor use los torniquetes adyacentes.",
    fr: "Attention spectateurs: Fort volume d'entrée près de la Porte C. Veuillez utiliser les tourniquets adjacents.",
    pt: "Atenção espectadores: Alto volume na Portão C. Use as catracas adjacentes para entrada tranquila.",
    ar: "انتباه للزوار: حجم دخول كثيف بالقرب من البوابة C. يرجى استخدام الحواجز الدوارة المجاورة.",
  },
  medical: {
    en: "Attention: Medical response personnel are active in the East Concourse. Please keep walkways clear. Thank you.",
    hi: "ध्यान दें: चिकित्सा दल पूर्वी कॉनकोर्स में सक्रिय है। कृपया मार्ग साफ रखें।",
    es: "Atención: Personal médico activo en el Vestíbulo Este. Mantenga los pasillos despejados.",
    fr: "Attention: Secouristes actifs dans le hall Est. Veuillez garder les passages libres.",
    pt: "Atenção: Equipe médica ativa no Pavilhão Leste. Mantenha as passagens desobstruídas.",
    ar: "انتباه: الفريق الطبي نشط في الممر الشرقي. يرجى إخلاء الممرات.",
  },
  general: {
    en: "Attention guests: Operational assistance is active in the reported sector. Please follow volunteer directions. Thank you.",
    hi: "मेहमानों का ध्यान: रिपोर्ट किए गए क्षेत्र में सहायता सक्रिय है। कृपया स्वयंसेवकों का पालन करें।",
    es: "Atención: Asistencia operativa activa. Siga las instrucciones del personal voluntario.",
    fr: "Attention: Assistance opérationnelle active. Veuillez suivre les consignes des bénévoles.",
    pt: "Atenção: Assistência operacional ativa. Siga as instruções dos voluntários.",
    ar: "انتباه: المساعدة التشغيلية نشطة. يرجى اتباع توجيهات المتطوعين.",
  },
}

const LANG_LABELS: Record<string, string> = {
  en: "EN", hi: "HI", es: "ES", fr: "FR", pt: "PT", ar: "AR"
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[8px] font-mono font-bold uppercase tracking-widest text-slate-500">
      <span className="text-slate-700">{n}.</span>
      {label}
    </span>
  )
}

export function IncidentResponse({ response, loading, onResolve, resolving, incidentStatus }: IncidentResponseProps) {
  const [stepIdx, setStepIdx] = useState(0)
  const [language, setLanguage] = useState<"en" | "hi" | "es" | "fr" | "pt" | "ar">("en")

  useEffect(() => {
    if (!loading) { setStepIdx(0); return }
    const iv = setInterval(() => setStepIdx((p) => Math.min(3, p + 1)), 450)
    return () => clearInterval(iv)
  }, [loading])

  // ── LOADING ──
  if (loading) {
    return (
      <CardGlass className="w-full h-full flex flex-col items-center justify-center border border-cyan-500/10 bg-slate-950/40 p-6" hoverEffect={false}>
        <Brain className="size-7 text-cyan-500 animate-pulse mb-5" />
        <div className="space-y-3 w-full max-w-[260px]">
          {LOADING_STEPS.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-[10px] font-mono">
              {stepIdx > idx
                ? <CheckCircle2 className="size-3 text-emerald-400 shrink-0" />
                : stepIdx === idx
                  ? <Loader2 className="size-3 text-cyan-400 animate-spin shrink-0" />
                  : <span className="size-3 shrink-0 flex items-center justify-center text-slate-700">•</span>
              }
              <span className={stepIdx === idx ? "text-cyan-300 font-bold" : stepIdx > idx ? "text-slate-500" : "text-slate-700"}>
                {step}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-[8px] font-mono text-slate-600 uppercase tracking-widest">AI Assessment In Progress</p>
      </CardGlass>
    )
  }

  // ── EMPTY ──
  if (!response) {
    return (
      <CardGlass className="w-full h-full flex flex-col items-center justify-center border border-white/[0.04] bg-slate-950/40 p-6" hoverEffect={false}>
        <Brain className="size-7 text-slate-700 mb-4" />
        <h4 className="text-[11px] font-semibold text-slate-500 font-mono uppercase tracking-wider">Awaiting Incident Input</h4>
        <p className="text-[10px] text-slate-600 leading-relaxed font-mono max-w-[240px] text-center mt-2">
          Submit a report in the Operator Workspace. The AI will generate a structured incident assessment.
        </p>
      </CardGlass>
    )
  }

  // Derive fields
  const incidentText = (response as any).incident || ""
  const isCongestion = response.incidentType?.toLowerCase().includes("congestion") || response.incidentType?.toLowerCase().includes("gate")
  const isMedical = response.incidentType?.toLowerCase().includes("medical")
  const annKey = isCongestion ? "congestion" : isMedical ? "medical" : "general"

  const rootCause = response.rootCause ||
    (isCongestion
      ? "Turnstile throughput bottlenecks combined with high-volume arrivals from transit loops."
      : isMedical
      ? "Physical fatigue or heat index thresholds exceeded under crowd density conditions."
      : "Sector queue velocity variance causing operational load imbalance.")

  const volunteerList = response.volunteerDeploymentPlan
    ? [response.volunteerDeploymentPlan]
    : isCongestion
      ? ["Deploy 4 Crowd Management Coordinators", "Assign 2 Turnstile Assistance Volunteers"]
      : isMedical
      ? ["Deploy 2 Medical First-Response Teams", "Assign 1 Emergency Area Coordinator"]
      : ["Deploy 2 Assistance Volunteers", "Assign 1 Section Supervisor"]

  const resolutionTime = response.estimatedResolutionTime ||
    (response.severity === "critical" ? "25–35 min" : response.severity === "high" ? "15–20 min" : "10–15 min")

  const activeAnnouncement = response.publicAnnouncements?.[language]
    || ANNOUNCEMENTS[annKey]?.[language]
    || ANNOUNCEMENTS.general[language]

  const severityStyle = SEVERITY_STYLES[response.severity] || SEVERITY_STYLES.medium

  return (
    <CardGlass
      className="w-full border border-cyan-500/10 bg-slate-950/40"
      hoverEffect={false}
      innerClassName="flex flex-col p-0"
    >
      {/* ── Panel Header ── */}
      <div className="px-4 py-3 border-b border-white/[0.05] shrink-0 flex items-center justify-between bg-slate-950/20">
        <div className="flex items-center gap-2">
          <Brain className="size-3.5 text-cyan-400" />
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">AI Generated</span>
            <h2 className="text-[11px] font-black uppercase text-slate-200 leading-none">Incident Assessment</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[8px] font-bold uppercase px-2 py-0.5 rounded-lg border ${severityStyle}`}>
            {response.severity}
          </span>
          <span className="text-[8px] font-bold text-cyan-400 bg-cyan-950/20 border border-cyan-500/15 px-2 py-0.5 rounded-lg">
            {response.confidence}% CONF
          </span>
        </div>
      </div>

      {/* ── Assessment Content ── */}
      <div className="px-4 py-3 space-y-3.5 font-mono text-[10px] text-slate-300">

        {/* 01. Situation Summary */}
        <div className="space-y-1.5">
          <SectionLabel n="01" label="Situation Summary" />
          <div className="bg-slate-900/40 border border-white/[0.03] rounded-lg px-3 py-2.5">
            <p className="text-[11px] font-black text-slate-100 font-sans mb-1">{response.incidentType}</p>
            <p className="text-[10.5px] text-slate-300 font-sans leading-relaxed">{response.summary}</p>
          </div>
        </div>

        {/* 02. Root Cause */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
          <SectionLabel n="02" label="Root Cause Analysis" />
          <p className="text-[10.5px] text-slate-300 font-sans leading-relaxed">{rootCause}</p>
        </div>

        {/* 03. Risk Level */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
          <SectionLabel n="03" label="Risk Level" />
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold font-mono ${severityStyle}`}>
            <AlertTriangle className="size-3" />
            {response.severity?.toUpperCase()} — {
              response.severity === "critical" ? "Immediate command escalation required" :
              response.severity === "high" ? "Rapid response protocol activated" :
              response.severity === "medium" ? "Standard operational response" :
              "Monitoring — low impact"
            }
          </div>
        </div>

        {/* 04. Immediate Actions */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
          <SectionLabel n="04" label="Immediate Actions" />
          <RecommendationCard actions={response.immediateActions} />
        </div>

        {/* 05. Volunteer Deployment */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
          <SectionLabel n="05" label="Volunteer Deployment" />
          <ul className="space-y-1">
            {volunteerList.map((v, i) => (
              <li key={i} className="flex items-start gap-2 text-[10.5px] font-sans text-slate-300">
                <ShieldCheck className="size-3 text-cyan-400 shrink-0 mt-0.5" />
                {v}
              </li>
            ))}
          </ul>
        </div>

        {/* 06. Public Announcement */}
        <div className="space-y-2 pt-2 border-t border-white/[0.03]">
          <div className="flex items-center justify-between">
            <SectionLabel n="06" label="Public Announcement" />
            <div className="flex items-center gap-0.5 bg-slate-900 border border-white/[0.06] p-0.5 rounded-lg">
              {(["en", "hi", "es", "fr", "pt", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-extrabold uppercase transition-all cursor-pointer ${
                    language === lang ? "bg-cyan-600 text-slate-950" : "text-slate-500 hover:text-white"
                  }`}
                >
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/40 border border-white/[0.03] p-3 rounded-lg flex items-start gap-2">
            <Globe className="size-3.5 text-cyan-500 shrink-0 mt-0.5" />
            <p className="text-[10.5px] text-slate-200 font-sans leading-relaxed italic">"{activeAnnouncement}"</p>
          </div>
        </div>

        {/* 07. Estimated Resolution */}
        <div className="space-y-1.5 pt-2 border-t border-white/[0.03]">
          <SectionLabel n="07" label="Estimated Resolution" />
          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-cyan-400" />
            <span className="text-[10.5px] font-sans text-slate-300">Resolution window: <strong className="text-cyan-400 font-mono">{resolutionTime}</strong></span>
          </div>
        </div>

      </div>

      {/* ── RESOLVE BUTTON ── */}
      <div className="px-4 py-3 border-t border-white/[0.04] shrink-0 bg-slate-950/30">
        <button
          onClick={onResolve}
          disabled={resolving || incidentStatus === "resolved"}
          className={`w-full py-2.5 font-mono text-[10px] font-black uppercase rounded-lg border transition-all flex items-center justify-center gap-2 ${
            incidentStatus === "resolved"
              ? "bg-emerald-950/20 border-emerald-500/20 text-emerald-500 cursor-default"
              : resolving
              ? "bg-slate-900 border-white/[0.06] text-slate-500 cursor-not-allowed"
              : "bg-emerald-600 border-emerald-500/30 text-slate-950 hover:bg-emerald-500 hover:shadow-lg cursor-pointer active:translate-y-px"
          }`}
        >
          {resolving ? (
            <><Loader2 className="size-3.5 animate-spin" /><span>Resolving...</span></>
          ) : incidentStatus === "resolved" ? (
            <><CheckCircle2 className="size-3.5" /><span>Incident Resolved</span></>
          ) : (
            <><UserCheck className="size-3.5" /><span>Mark as Resolved</span></>
          )}
        </button>
      </div>
    </CardGlass>
  )
}
