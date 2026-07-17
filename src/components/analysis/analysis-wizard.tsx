"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OperationsTimeline } from "./operations-timeline"
import { MatchContext } from "./match-context"
import { VolunteerProfile } from "./volunteer-profile"
import { StadiumStatus } from "./stadium-status"
import { AIRecommendation } from "./ai-recommendation"
import { TelemetryPanel } from "./telemetry-panel"
import { Button } from "@/components/ui/button"
import { 
  Compass, 
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  AlertTriangle
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { 
  mapMatchContext, 
  mapVolunteerProfile, 
  mapRecommendationsList, 
  mapStadiumZonesList, 
  mapTimelineEventsList 
} from "@/lib/mappers/analysis-mapper"
import { 
  rawMatchContext, 
  rawVolunteerProfile, 
  rawInitialStadiumZones, 
  rawTimelineEvents 
} from "@/constants/analysis-mock-data"
import { 
  MatchContextData, 
  VolunteerProfileData, 
  RecommendationItem, 
  StadiumZoneStatus, 
  TimelineEvent 
} from "@/types/analysis"

// Convert mock data via mapper layer
const matchContext = mapMatchContext(rawMatchContext)
const volunteerProfile = mapVolunteerProfile(rawVolunteerProfile)
const timelineEvents = mapTimelineEventsList(rawTimelineEvents)

export function AnalysisWizard() {
  const router = useRouter()
  
  // Telemetry Timestamps
  const [mounted, setMounted] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [estimatedCompletion, setEstimatedCompletion] = useState<Date | null>(null)
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [completedTimestamps, setCompletedTimestamps] = useState<string[]>(["", "", "", "", "", ""])

  // Progress States
  const [activeStep, setActiveStep] = useState(0)
  const [progresses, setProgresses] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const [statuses, setStatuses] = useState<("queued" | "analyzing" | "completed")[]>([
    "analyzing",
    "queued",
    "queued",
    "queued",
    "queued",
    "queued",
  ])

  // API State Integration
  const [apiStatus, setApiStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [apiRecommendation, setApiRecommendation] = useState<RecommendationItem | null>(null)
  const [apiRecommendationsList, setApiRecommendationsList] = useState<RecommendationItem[]>([])
  const [apiError, setApiError] = useState<string | null>(null)

  // Initialize clock and timers on mount (client-only)
  useEffect(() => {
    setMounted(true)
    const now = new Date()
    setStartTime(now)
    setEstimatedCompletion(new Date(now.getTime() + 2300))
    setCurrentTime(now)
  }, [])

  // Clock dynamic tick
  useEffect(() => {
    if (apiStatus === "success" || !startTime) return
    const clock = setInterval(() => {
      setCurrentTime(new Date())
    }, 55)
    return () => clearInterval(clock)
  }, [apiStatus, startTime])

  // Formatting helper (Millisecond level)
  const formatTimeStr = (date: Date) => {
    const formatted = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    const ms = String(date.getMilliseconds()).padStart(3, "0").slice(0, 2)
    return `${formatted}.${ms}`
  }

  // API Call Handler
  const fetchAIRecommendations = async (payload: any) => {
    setApiStatus("loading")
    setApiError(null)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success && data.recommendation) {
        setApiRecommendation(data.recommendation)
        setApiRecommendationsList(data.recommendations || [data.recommendation])
        setApiStatus("success")
      } else {
        throw new Error(data.error || "Failed to compile recommendations from Groq.")
      }
    } catch (err: any) {
      console.error("API Analyze fetch error:", err)
      setApiStatus("error")
      setApiError(err.message || "Connection timed out.")
    }
  }

  // Animation timeline loop
  useEffect(() => {
    if (activeStep === 6 || !startTime) return

    const interval = setInterval(() => {
      setProgresses((prev) => {
        const next = [...prev]
        if (activeStep < 6) {
          next[activeStep] = Math.min(next[activeStep] + 12, 100)
          
          if (next[activeStep] === 100) {
            // Step complete timestamp logging
            const completeTime = new Date()
            setCompletedTimestamps((prevTimes) => {
              const updated = [...prevTimes]
              updated[activeStep] = formatTimeStr(completeTime)
              return updated
            })

            // Transition statuses
            setStatuses((prevStatuses) => {
              const updated = [...prevStatuses]
              updated[activeStep] = "completed"
              if (activeStep + 1 < 6) {
                updated[activeStep + 1] = "analyzing"
              }
              return updated
            })
            
            // Advance active index
            setActiveStep((prevStep) => prevStep + 1)
          }
        }
        return next
      })
    }, 40)

    return () => clearInterval(interval)
  }, [activeStep, startTime])

  // Monitor when timeline completes to launch initial API fetch
  useEffect(() => {
    if (activeStep === 6 && apiStatus === "idle") {
      if (startTime) {
        setCurrentTime(new Date(startTime.getTime() + 2300)) // Sync telemetry clock
      }
      triggerAnalysisFetch()
    }
  }, [activeStep, apiStatus, startTime])

  const triggerAnalysisFetch = () => {
    const rawPayload = {
      volunteerProfile,
      matchContext,
      crowdDensity: 0.76,
      weather: {
        condition: "Rain expected",
        precipitationChance: 65,
        minutesToPrecipitation: 20,
      },
      transportStatus: {
        metroDelayMinutes: 6,
        metroStatusLabel: "Delays reported near transit ring",
        busShuttleActive: true,
      },
      accessibilityAlerts: [
        "Elevator at Sector 110 offline",
      ],
      medicalReadiness: {
        personnelCount: 12,
        stationStatus: "available" as const,
      },
      previousRecommendations: [],
    }
    fetchAIRecommendations(rawPayload)
  }

  // Overall combined progress calculation
  const totalProgress = progresses.reduce((sum, val) => sum + val, 0)
  const overallProgress = Math.min(Math.round(totalProgress / 6), 100)

  // Combined complete state (checks complete and API returned successfully)
  const isComplete = activeStep === 6 && apiStatus === "success"

  // Resolve active recommendation dynamically based on step progress & API state
  const getActiveRecommendation = (): RecommendationItem | null => {
    if (activeStep < 6) {
      return null // Shows default "Compiling operational triggers..."
    }

    if (apiStatus === "loading") {
      return {
        id: "api-loading",
        action: "Querying Groq Decision Core...",
        reason: "Executing operational rules on normalized MetLife telemetry...",
        expectedImpact: "Computing volunteer deployment recommendation...",
        confidence: 50,
        priority: "optimal",
      }
    }

    if (apiStatus === "error") {
      return {
        id: "api-error",
        action: "Decision Engine Interface offline.",
        reason: apiError || "An unexpected error occurred during execution.",
        expectedImpact: "Tap 'Retry Telemetry Fetch' to retry API transaction.",
        confidence: 0,
        priority: "critical",
      }
    }

    return apiRecommendation
  }

  const activeRecommendation = getActiveRecommendation()

  // Resolve active stadium zone statuses dynamically
  const getStadiumZones = (): StadiumZoneStatus[] => {
    const zones = mapStadiumZonesList(rawInitialStadiumZones)

    // Gate C changes density when Crowd sensors check completes
    if (progresses[0] > 0) {
      zones[1].status = "Increasing density"
      zones[1].risk = "warning"
    }

    // Metro Entrance changes status when Metro prediction updates
    if (progresses[1] > 0) {
      zones[2].status = "High arrival prediction"
      zones[2].risk = "error"
    }

    return zones
  }

  const stadiumZones = getStadiumZones()

  const handleContinue = () => {
    if (isComplete) {
      router.push("/")
    }
  }

  const handleRetry = () => {
    triggerAnalysisFetch()
  }

  return (
    <div className="max-w-6xl w-full mx-auto px-4 py-3 relative z-10 h-[86vh] flex flex-col min-h-0 justify-between overflow-hidden">
      
      {/* Platform Title Bar */}
      <div className="flex flex-col gap-1 mb-3 shrink-0">
        <div className="flex items-center gap-2 select-none">
          <div className="inline-flex items-center justify-center p-1.5 rounded bg-slate-900 border border-white/[0.08] text-cyan-405">
            <Compass className="size-4 animate-spin-slow" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-semibold">FIFA STADIUM COGNITIVE OPERATIONS</span>
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight bg-gradient-to-b from-slate-100 to-slate-400 bg-clip-text text-transparent">
          Analyzing Today's Stadium Operations
        </h1>
        <p className="text-[11px] text-slate-450 max-w-xl">
          Our AI Copilot is evaluating live operational data to prepare today's mission briefing.
        </p>
      </div>

      {/* Main Grid: Left Context, Timeline, AI Rec - Right Profile, Status, Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0 overflow-hidden items-stretch">
        
        {/* Left Column (2-grid columns wide): Match Context, Timeline, AI Recommendation */}
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-y-auto pr-2 max-h-full">
          {/* Match Context Card */}
          <MatchContext context={matchContext} />

          {/* Operations Timeline */}
          <OperationsTimeline
            events={timelineEvents}
            activeStep={activeStep}
            timestamps={completedTimestamps}
            statuses={statuses}
          />
          
          {/* AI Recommendation Panel */}
          <AIRecommendation recommendation={activeRecommendation} />
        </div>

        {/* Right Column: Profile, Live Status, Telemetry & Actions */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-2 max-h-full">
          {/* Volunteer Profile */}
          <VolunteerProfile profile={volunteerProfile} />

          {/* Live Stadium Status */}
          <StadiumStatus zones={stadiumZones} />

          {/* Telemetry panel */}
          <TelemetryPanel
            overallProgress={overallProgress}
            isComplete={isComplete}
            startedTime={startTime}
            estimatedCompletion={estimatedCompletion}
            currentTime={currentTime}
            currentObjective={
              apiStatus === "loading" 
                ? "Processing model recommendations..." 
                : apiStatus === "error"
                ? "Error in analysis pipeline"
                : isComplete
                ? "Volunteer briefing generated"
                : "Preparing volunteer operational briefing"
            }
            operationalHealth={
              apiStatus === "error" 
                ? "OFFLINE" 
                : apiStatus === "loading"
                ? "ANALYZING..."
                : "NOMINAL (99.8%)"
            }
            confidence={activeRecommendation ? activeRecommendation.confidence : 90}
          />

          {/* Dynamic Success Brief & Primary Redirection Action */}
          <div className="space-y-3 mt-auto pt-2">
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 backdrop-blur-sm select-none"
                >
                  <div className="flex items-center gap-2.5 text-emerald-400 mb-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span className="text-xs font-bold">✓ Operational Brief Ready</span>
                  </div>

                  <div className="text-[10px] text-slate-400 space-y-1.5 border-t border-emerald-500/10 pt-2">
                    <span className="block font-mono text-[9px] text-slate-500 font-semibold mb-0.5">AI Generated Results</span>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-emerald-400" />
                        <span>{apiRecommendationsList.length} operational recommendations</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-amber-400" />
                        <span>2 predicted risks mitigated</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-cyan-405" />
                        <span>1 accessibility advisory</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {apiStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl border border-rose-500/15 bg-rose-500/5 backdrop-blur-sm select-none flex gap-2.5 text-[11px] text-slate-400"
                >
                  <AlertTriangle className="size-4 text-rose-450 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block text-rose-400 font-bold">Analysis Core Offline</span>
                    <p className="leading-relaxed">
                      We were unable to reach the AI Operations Decision Engine. Make sure the GROQ_API_KEY is configured correctly.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {apiStatus === "error" ? (
              <Button
                onClick={handleRetry}
                className="w-full py-4 text-xs font-bold rounded-xl border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 hover:shadow-lg hover:shadow-rose-950/25 active:translate-y-px transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer"
              >
                <RefreshCw className="size-3.5" />
                <span>Retry Telemetry Fetch</span>
              </Button>
            ) : (
              <Button
                onClick={handleContinue}
                disabled={!isComplete}
                className={`w-full py-4 text-xs font-bold rounded-xl border transition-all duration-300 gap-2 flex items-center justify-center cursor-pointer ${
                  isComplete
                    ? "bg-cyan-600 border-cyan-400/30 text-slate-950 hover:bg-cyan-500 hover:shadow-lg hover:shadow-cyan-950/20 active:translate-y-px"
                    : "bg-slate-900/40 border-white/[0.04] text-slate-600 cursor-not-allowed opacity-50"
                }`}
                aria-disabled={!isComplete}
              >
                {apiStatus === "loading" && <RefreshCw className="size-3.5 animate-spin mr-1 text-slate-500" />}
                <span>{apiStatus === "loading" ? "Compiling Brief..." : "Review Operational Brief"}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
