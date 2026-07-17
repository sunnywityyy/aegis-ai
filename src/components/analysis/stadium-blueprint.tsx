import React from "react"

export function StadiumBlueprint() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
      <svg 
        className="w-full max-w-[1200px] aspect-[16/10] text-slate-500/10 opacity-[0.25]" 
        viewBox="0 0 1000 600" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Technical Coordinate Grid */}
        <g stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3">
          <line x1="100" y1="0" x2="100" y2="600" />
          <line x1="200" y1="0" x2="200" y2="600" />
          <line x1="300" y1="0" x2="300" y2="600" />
          <line x1="400" y1="0" x2="400" y2="600" />
          <line x1="500" y1="0" x2="500" y2="600" />
          <line x1="600" y1="0" x2="600" y2="600" />
          <line x1="700" y1="0" x2="700" y2="600" />
          <line x1="800" y1="0" x2="800" y2="600" />
          <line x1="900" y1="0" x2="900" y2="600" />

          <line x1="0" y1="100" x2="1000" y2="100" />
          <line x1="0" y1="200" x2="1000" y2="200" />
          <line x1="0" y1="300" x2="1000" y2="300" />
          <line x1="0" y1="400" x2="1000" y2="400" />
          <line x1="0" y1="500" x2="1000" y2="500" />
        </g>

        {/* Outer Stadium Ellipse Boundaries */}
        <ellipse cx="500" cy="300" rx="380" ry="220" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" />
        <ellipse cx="500" cy="300" rx="360" ry="200" stroke="currentColor" strokeWidth="0.75" />
        <ellipse cx="500" cy="300" rx="320" ry="170" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="500" cy="300" rx="270" ry="130" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Center Pitch */}
        <rect x="380" y="220" width="240" height="160" stroke="currentColor" strokeWidth="1" />
        <circle cx="500" cy="300" r="40" stroke="currentColor" strokeWidth="0.75" />
        <line x1="500" y1="220" x2="500" y2="380" stroke="currentColor" strokeWidth="0.75" />

        {/* Sector Lines & Anchors */}
        <line x1="500" y1="300" x2="120" y2="300" stroke="currentColor" strokeWidth="0.5" />
        <line x1="500" y1="300" x2="880" y2="300" stroke="currentColor" strokeWidth="0.5" />
        <line x1="500" y1="300" x2="500" y2="80" stroke="currentColor" strokeWidth="0.5" />
        <line x1="500" y1="300" x2="500" y2="520" stroke="currentColor" strokeWidth="0.5" />

        <line x1="500" y1="300" x2="230" y2="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="500" y1="300" x2="770" y2="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="500" y1="300" x2="230" y2="460" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
        <line x1="500" y1="300" x2="770" y2="460" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Corner Grid Crosshairs */}
        <g stroke="currentColor" strokeWidth="1">
          {/* Top-Left */}
          <line x1="20" y1="20" x2="40" y2="20" />
          <line x1="20" y1="20" x2="20" y2="40" />
          {/* Top-Right */}
          <line x1="980" y1="20" x2="960" y2="20" />
          <line x1="980" y1="20" x2="980" y2="40" />
          {/* Bottom-Left */}
          <line x1="20" y1="580" x2="40" y2="580" />
          <line x1="20" y1="580" x2="20" y2="560" />
          {/* Bottom-Right */}
          <line x1="980" y1="580" x2="960" y2="580" />
          <line x1="980" y1="580" x2="980" y2="560" />
        </g>

        {/* Technical Text Tags */}
        <g fill="currentColor" className="font-mono text-[9px] select-none opacity-80">
          <text x="500" y="60" textAnchor="middle">SEC-N // MAIN GATE A // NORTH TIER</text>
          <text x="500" y="550" textAnchor="middle">SEC-S // EMERGENCY EXIT E-2 // SOUTH TIER</text>
          <text x="80" y="305">SEC-W // VIP ENTRANCE</text>
          <text x="790" y="305">SEC-E // EAST GATE C (G-6)</text>
          
          <text x="245" y="130">COORD_NW-90 // METRO ACCESS</text>
          <text x="715" y="130">COORD_NE-45 // PARKING AREA P3</text>
          <text x="245" y="480">COORD_SW-180 // MEDICAL CENTRE</text>
          <text x="715" y="480">COORD_SE-225 // DEPLOY_ZONE_EAST</text>
          
          <text x="508" y="295" className="font-sans text-[7px] font-semibold text-slate-500/30">METLIFE_PITCH_CTR</text>
          
          <text x="30" y="55">AEGIS CONTROL UNIT 01 // METLIFE STAD</text>
          <text x="30" y="70">SYS_INFERENCE: NOMINAL</text>
          <text x="30" y="85">LATENCY: 0.12ms</text>
          
          <text x="810" y="55" textAnchor="start">LOC: 40.8135° N, 74.0744° W</text>
          <text x="810" y="70" textAnchor="start">ALTITUDE: 7.0m</text>
          <text x="810" y="85" textAnchor="start">TELESCOPE ID: METLIFE-STAD-26</text>
        </g>
      </svg>
    </div>
  )
}
