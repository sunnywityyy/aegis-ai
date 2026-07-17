"use client"

import React, { useState, useEffect, useRef } from "react"
import { useAuth } from "@/features/auth/auth-provider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { copilotService, incidentLogsService } from "@/services/copilot/copilot-service"
import { volunteersService } from "@/services/firestore/volunteers"
import { IncidentInput } from "@/components/copilot/incident-input"
import { IncidentResponse } from "@/components/copilot/incident-response"
import { ActionTimeline } from "@/components/copilot/action-timeline"
import { IncidentLogDocument, VolunteerDocument } from "@/types/firestore"
import { IncidentPriorityQueue, QueuedIncident } from "@/services/copilot/priority-queue"
import { CardGlass } from "@/components/ui/card-glass"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertTriangle, ShieldCheck, RefreshCw, BellRing, Clock, Cpu, Shield } from "lucide-react"
import { motion } from "framer-motion"

export default function CopilotPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [prefillLocation, setPrefillLocation] = useState("")
  const [prefillCategory, setPrefillCategory] = useState("")

  const workspaceRef = useRef<HTMLDivElement>(null)
  const assessmentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const loc = params.get("location")
      const cat = params.get("category")
      if (loc) setPrefillLocation(loc)
      if (cat) setPrefillCategory(cat)
    }
  }, [])

  // User Profile
  const [volunteer, setVolunteer] = useState<VolunteerDocument | null>(null)
  
  // Registry Logs
  const [logs, setLogs] = useState<IncidentLogDocument[]>([])
  const [activeLog, setActiveLog] = useState<IncidentLogDocument | null>(null)

  // Status flags
  const [pageStatus, setPageStatus] = useState<"idle" | "loading" | "success" | "error" | "empty">("idle")
  const [processing, setProcessing] = useState(false)
  const [resolving, setResolving] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState("")

  // Priority Queue Manager
  const queueRef = useRef<IncidentPriorityQueue>(new IncidentPriorityQueue())
  const [pendingCount, setPendingCount] = useState(0)

  const sortLogs = (list: IncidentLogDocument[]) =>
    [...list].sort((a, b) => {
      const tA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
      const tB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
      return tB - tA
    })

  const fetchOperationsData = async (email: string) => {
    setPageStatus("loading")
    setErrorMsg(null)
    try {
      const response = await volunteersService.getAll()
      const currentVolunteer = response.find((v) => v.email === email)
      
      if (!currentVolunteer) {
        setErrorMsg(`Volunteer profile not found in Firestore for: "${email}".`)
        setPageStatus("empty")
        return
      }

      setVolunteer(currentVolunteer)

      const logsList = sortLogs(await incidentLogsService.getAll())
      setLogs(logsList)
      if (logsList.length > 0) setActiveLog(logsList[0])
      setPageStatus("success")
    } catch (err: any) {
      console.error("Operations fetch error:", err)
      setErrorMsg(err.message || "Failed to establish secure logs telemetry sync.")
      setPageStatus("error")
    }
  }

  useEffect(() => {
    if (user?.email) fetchOperationsData(user.email)
  }, [user])

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleTimeString("en-US", { hour12: false }))
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleRetry = () => {
    if (user?.email) fetchOperationsData(user.email)
  }

  const handleIncidentSubmit = async (
    text: string,
    priority: "critical" | "high" | "medium" | "low",
    location: string,
    category: string
  ) => {
    if (!user?.email || !volunteer) return

    // Smooth scroll to the assessment area
    setTimeout(() => {
      assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    const newQueued: QueuedIncident = {
      id: Math.random().toString(36).slice(2, 9),
      text, priority, timestamp: new Date(), location, category,
    }

    queueRef.current.enqueue(newQueued)
    setPendingCount(queueRef.current.getQueue().length)

    if (!processing) await processNextIncident()
  }

  const processNextIncident = async () => {
    if (queueRef.current.isEmpty() || !user?.email) {
      setProcessing(false)
      return
    }

    setProcessing(true)
    const targetIncident = queueRef.current.dequeue()
    setPendingCount(queueRef.current.getQueue().length)
    if (!targetIncident) return

    try {
      const result = await copilotService.processIncident(
        targetIncident.text,
        user.email,
        targetIncident.location,
        targetIncident.category
      )
      
      if (result.success && result.log) {
        const updatedLogs = sortLogs(await incidentLogsService.getAll())
        setLogs(updatedLogs)
        setActiveLog(result.log)
      }
    } catch (err) {
      console.error("Error processing incident:", err)
    } finally {
      await processNextIncident()
    }
  }

  const handleResolveIncident = async () => {
    if (!activeLog || !activeLog.id || !volunteer) return
    setResolving(true)
    try {
      await copilotService.resolveIncident(activeLog.id, volunteer.id || "unknown")
      const updatedLogs = sortLogs(await incidentLogsService.getAll())
      setLogs(updatedLogs)
      const resolvedDoc = updatedLogs.find((l) => l.id === activeLog.id)
      if (resolvedDoc) setActiveLog(resolvedDoc)
    } catch (err) {
      console.error("Resolution failure:", err)
    } finally {
      setResolving(false)
    }
  }

  // ── LOADING STATE ──
  if (pageStatus === "loading" || pageStatus === "idle") {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] text-slate-100 flex items-center justify-center font-mono text-xs">
          <div className="flex flex-col items-center gap-4">
            <Cpu className="size-8 animate-spin text-cyan-400" />
            <span className="text-slate-400 uppercase tracking-widest">Connecting to Command Operations...</span>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  // ── ERROR STATE ──
  if (pageStatus === "error") {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6">
          <CardGlass className="w-full max-w-[440px] border border-rose-500/20 bg-slate-950/40 p-8 text-center space-y-6" hoverEffect={false}>
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <AlertTriangle className="size-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">Command Core Offline</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">{errorMsg || "Unable to establish connection."}</p>
            </div>
            <Button onClick={handleRetry} className="w-full py-5 text-xs font-bold font-mono tracking-widest uppercase rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 transition-all gap-2 flex items-center justify-center cursor-pointer">
              <RefreshCw className="size-4" />
              <span>Retry Connection</span>
            </Button>
          </CardGlass>
        </div>
      </ProtectedRoute>
    )
  }

  // ── EMPTY STATE ──
  if (pageStatus === "empty" || !volunteer) {
    return (
      <ProtectedRoute>
        <div className="h-screen w-screen bg-[#020617] flex items-center justify-center p-6">
          <CardGlass className="w-full max-w-[440px] border border-white/[0.04] bg-slate-950/40 p-8 text-center space-y-6" hoverEffect={false}>
            <div className="inline-flex items-center justify-center p-3 rounded-xl bg-slate-900 border border-white/[0.08] text-slate-400">
              <Shield className="size-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">Volunteer Profile Missing</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-mono">{errorMsg || "Could not locate your active volunteer profile in Firestore."}</p>
            </div>
            <Button onClick={handleRetry} className="w-full py-5 text-xs font-bold font-mono tracking-widest uppercase rounded-xl border border-white/[0.08] bg-slate-900 text-slate-300 hover:bg-slate-800 transition-all gap-2 flex items-center justify-center cursor-pointer">
              <RefreshCw className="size-4" />
              <span>Retry</span>
            </Button>
          </CardGlass>
        </div>
      </ProtectedRoute>
    )
  }

  // ── MAIN WORKSPACE ──
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col font-sans select-none relative">
        {/* Ambient lighting */}
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-900/8 blur-[130px] pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-blue-900/8 blur-[130px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.015),transparent_70%)] pointer-events-none z-0" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        {/* ── HEADER ── */}
        <header className="h-12 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.06] bg-slate-950/60 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center p-1.5 rounded bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
              <Shield className="size-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">AEGIS COMMAND</span>
                {pendingCount > 0 && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />}
              </div>
              <h1 className="text-[13px] font-black tracking-tight text-white uppercase leading-none">
                🚨 AI Incident Commander
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-xs font-mono">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/[0.08] text-slate-300 font-mono text-[9px] font-bold uppercase rounded-lg cursor-pointer transition-colors"
            >
              ← Dashboard
            </button>

            {pendingCount > 0 && (
              <div className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg text-rose-400 font-mono text-[9px] animate-pulse">
                <BellRing className="size-3" />
                <span>{pendingCount} QUEUED</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-cyan-500/10">
              <Clock className="size-3" />
              <span>{currentTime}</span>
            </div>
          </div>
        </header>

        {/* ── MAIN WORKSPACE ── */}
        <main className="flex-1 px-4 pt-4 pb-6 z-10 space-y-4 max-w-5xl mx-auto w-full">
          
          {/* SECTION 2: Operator Workspace */}
          <div ref={workspaceRef} className="w-full">
            <IncidentInput
              onSubmit={handleIncidentSubmit}
              loading={processing}
              prefillLocation={prefillLocation}
              prefillCategory={prefillCategory}
            />
          </div>

          {/* SECTION 3: AI Incident Assessment */}
          <div ref={assessmentRef} className="w-full">
            <IncidentResponse
              response={activeLog ? activeLog.response : null}
              loading={processing && !activeLog}
              onResolve={handleResolveIncident}
              resolving={resolving}
              incidentStatus={activeLog?.status}
            />
          </div>

          {/* SECTION 4: Incident Timeline */}
          <div className="w-full">
            <ActionTimeline
              logs={logs}
              onSelect={(selectedLog) => {
                setActiveLog(selectedLog)
                setTimeout(() => {
                  assessmentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                }, 100)
              }}
              activeLogId={activeLog?.id}
            />
          </div>
        </main>

        {/* ── TICKER FOOTER ── */}
        <footer className="h-7 shrink-0 bg-slate-950/80 border-t border-white/[0.06] flex items-center overflow-hidden z-10 relative">
          <div className="absolute left-0 px-2.5 py-1 bg-rose-600 text-slate-950 font-mono text-[8px] font-extrabold tracking-wider uppercase z-20 shadow-md">
            INC CMD
          </div>
          <div className="flex-1 w-full overflow-hidden relative pl-20">
            <motion.div
              animate={{ x: ["5%", "-95%"] }}
              transition={{ ease: "linear", duration: 40, repeat: Infinity }}
              className="inline-block whitespace-nowrap text-[9px] font-mono tracking-widest text-cyan-400 font-bold"
            >
              INCIDENT COMMANDER ACTIVE   •   LOGGED: {logs.length} REPORTS   •   QUEUE: {pendingCount} PENDING   •   GROQ AI ENGINE: CONNECTED   •   FIREBASE: ONLINE
            </motion.div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
