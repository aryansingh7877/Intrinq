"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  FileCheck,
  Cpu,
  Repeat,
  Sparkles,
  ArrowRight,
  Activity,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).ScrollTrigger = ScrollTrigger;
}

interface ProcessStage {
  id: string;
  stepNumber: string;
  title: string;
  body: string;
  tag: string;
  subTag: string;
  icon: React.ComponentType<{ className?: string }>;
  position: "below" | "above"; // alternating vertical position relative to trajectory curve
}

const STAGES: ProcessStage[] = [
  {
    id: "discovery",
    stepNumber: "01",
    title: "Discovery",
    body: "We listen. Understand the business, the people, and the numbers behind them.",
    tag: "ORIENTATION & AUDIT",
    subTag: "GROUND REALITY",
    icon: Compass,
    position: "below",
  },
  {
    id: "proposal",
    stepNumber: "02",
    title: "Proposal",
    body: "A clear scope of advice tailored to where you are and where you want to be.",
    tag: "STRATEGIC ARCHITECTURE",
    subTag: "BESPOKE SCOPE",
    icon: FileCheck,
    position: "above",
  },
  {
    id: "onboarding",
    stepNumber: "03",
    title: "Onboarding",
    body: "Systems, data, and rhythms set up with care so the machine runs quietly.",
    tag: "SYSTEM INTEGRATION",
    subTag: "QUIET EFFICIENCY",
    icon: Cpu,
    position: "below",
  },
  {
    id: "monthly-advisory",
    stepNumber: "04",
    title: "Monthly Advisory",
    body: "Reports, reviews, and decisions — a steady cadence of clarity.",
    tag: "CADENCE OF CLARITY",
    subTag: "DISCIPLINED REVIEW",
    icon: Repeat,
    position: "above",
  },
  {
    id: "long-term-partnership",
    stepNumber: "05",
    title: "Long-Term Partnership",
    body: "We grow with you. The advice compounds, and so does the trust.",
    tag: "COMPOUNDING TRUST",
    subTag: "ENDURING HORIZON",
    icon: Sparkles,
    position: "below",
  },
];

export default function OurProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const desktopViewportRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const ghostPathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const stageCardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Mobile elements
  const mobileSectionRef = useRef<HTMLDivElement>(null);
  const mobileActivePathRef = useRef<SVGPathElement>(null);

  // Active stage tracking for HUD
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      // -------------------------------------------------------------
      // 1. REDUCED MOTION FALLBACK
      // -------------------------------------------------------------
      if (prefersReducedMotion) {
        setActiveStageIndex(0);
        setProgressPercent(100);
        if (activePathRef.current) {
          gsap.set(activePathRef.current, { strokeDashoffset: 0 });
        }
        return;
      }

      // -------------------------------------------------------------
      // 2. DESKTOP PINNED HORIZONTAL ADVISORY JOURNEY (>= 1024px)
      // -------------------------------------------------------------
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const track = horizontalTrackRef.current;
        const viewport = desktopViewportRef.current;
        const activePath = activePathRef.current;
        const marker = markerRef.current;
        const card5 = stageCardsRef.current[4];

        if (!track || !viewport || !activePath) return;

        const pathLength = activePath.getTotalLength();
        gsap.set(activePath, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
        });

        // Compute horizontal travel distance so Stage 5 lands perfectly centered in the viewport
        const getScrollDistance = () => {
          if (card5) {
            const card5Center = card5.offsetLeft + card5.offsetWidth / 2;
            const viewportCenter = window.innerWidth / 2;
            return Math.max(0, card5Center - viewportCenter);
          }
          return track.scrollWidth - window.innerWidth;
        };

        // Master Pinned Timeline
        // Outer section owns the scroll space (140vh scroll interaction)
        // Pinned visual releases cleanly at Stage 05 without dead space
        const masterTl = gsap.timeline({
          scrollTrigger: {
            id: "our-process-pin",
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: desktopViewportRef.current,
            pinSpacing: false,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              setProgressPercent(Math.round(p * 100));

              // Active Stage Mapping (5 stages across 0..1 progress)
              let stageIdx = 0;
              if (p < 0.20) stageIdx = 0;
              else if (p < 0.42) stageIdx = 1;
              else if (p < 0.65) stageIdx = 2;
              else if (p < 0.86) stageIdx = 3;
              else stageIdx = 4; // Stage 5 stays active and centered

              setActiveStageIndex(stageIdx);

              // Update Path Stroke: reaches Stage 5 at 100% and halts
              const currentOffset = pathLength * (1 - p);
              gsap.set(activePath, { strokeDashoffset: currentOffset });

              // Move Traveling Gold Reticle Marker along SVG Bezier Path up to Stage 5
              if (marker && pathLength > 0) {
                const distanceAlongPath = Math.min(
                  pathLength * p,
                  pathLength - 0.1
                );
                const pt = activePath.getPointAtLength(distanceAlongPath);
                gsap.set(marker, {
                  x: pt.x,
                  y: pt.y,
                  transformOrigin: "center center",
                });
              }
            },
          },
        });

        // Horizontal Track Pan — stops exactly when Stage 5 is centered
        masterTl.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
        });
      });

      // -------------------------------------------------------------
      // -------------------------------------------------------------
      // 3. MOBILE VERTICAL ADVISORY JOURNEY (< 1024px)
      // -------------------------------------------------------------
      mm.add("(max-width: 1023px)", () => {
        // Clean mobile stage card reveals with basic smooth animation
        const cards = mobileSectionRef.current?.querySelectorAll(".mobile-stage-card");
        cards?.forEach((c) => {
          gsap.fromTo(
            c,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: c,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      });
    }, sectionRef);

    // Ensure all DOM pin-spacers across the page are accurately sorted and refreshed
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Quick jump click handler for HUD stage indicators
  const handleStageJump = (index: number) => {
    if (!sectionRef.current) return;
    const isDesktop = window.innerWidth >= 1024;
    if (isDesktop) {
      const sectionTop = sectionRef.current.offsetTop;
      const totalPinScroll = window.innerHeight * 1.4;
      const targetScroll = sectionTop + (index / 4) * totalPinScroll;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    } else {
      const mobileCards = mobileSectionRef.current?.querySelectorAll(".mobile-stage-card");
      if (mobileCards && mobileCards[index]) {
        mobileCards[index].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="our-process"
      aria-label="Our Process: A Cinematic Advisory Journey"
      className="process-section relative z-20 w-full bg-[#F5F1E8] text-[#071A33] transition-colors duration-700 select-none lg:h-[240vh]"
    >
      {/* Background Architectural Luxury Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#071A33 1px, transparent 1px), linear-gradient(90deg, #071A33 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient Warm Golden Sfumato Glow */}
      <div
        className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none opacity-30 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(200, 154, 61, 0.18) 0%, transparent 70%)",
        }}
      />

      {/* ============================================================ */}
      {/* DESKTOP EXPERIENCE (1024px and up): PINNED HORIZONTAL TRACK  */}
      {/* ============================================================ */}
      <div
        ref={desktopViewportRef}
        className="process-pin hidden lg:flex flex-col justify-between h-screen w-full relative z-10 px-8 sm:px-12 md:px-16 pt-24 sm:pt-28 pb-8"
      >
        {/* ---------------- TOP ARCHITECTURAL HEADER BAR -------------- */}
        <div className="w-full flex items-end justify-between border-b border-[#071A33]/[0.08] pb-4 shrink-0">
          {/* Left: Eyebrow + Section Headline */}
          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="h-[1.5px] w-8 bg-[#C89A3D] rounded-full inline-block shadow-[0_0_6px_rgba(200,154,61,0.5)]" />
              <span className="font-mono text-xs tracking-[0.28em] uppercase font-semibold text-[#8F6B2C]">
                OUR PROCESS
              </span>
            </div>
            <h2 className="font-serif text-2xl xl:text-3xl font-normal text-[#071A33] tracking-tight">
              A continuous trajectory of{" "}
              <span className="italic font-serif text-[#C89A3D]">clarity.</span>
            </h2>
          </div>

          {/* Right: Stage Sequence & Progress Telemetry */}
          <div className="flex items-center space-x-6">
            {/* Quick-Jump Stage Pills */}
            <div className="flex items-center space-x-1.5 bg-[#EAE3D4]/80 backdrop-blur-sm border border-[#071A33]/[0.08] p-1 rounded-full shadow-sm">
              {STAGES.map((s, idx) => {
                const isActive = idx === activeStageIndex;
                const isPast = idx < activeStageIndex;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStageJump(idx)}
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                      isActive
                        ? "bg-[#071A33] text-[#F4EFE5] font-medium shadow-sm"
                        : isPast
                        ? "text-[#071A33]/70 hover:text-[#071A33]"
                        : "text-[#071A33]/40 hover:text-[#071A33]"
                    }`}
                    aria-label={`Jump to stage ${s.stepNumber} ${s.title}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-[#C89A3D]"
                          : isPast
                          ? "bg-[#071A33]/50"
                          : "bg-[#071A33]/25"
                      }`}
                    />
                    <span>{s.stepNumber}</span>
                    <span
                      className={`text-[10px] hidden xl:inline uppercase tracking-wider ${
                        isActive ? "text-[#C89A3D]" : "opacity-70"
                      }`}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Trajectory Telemetry */}
            <div className="flex items-center space-x-3 font-mono text-xs">
              <div className="flex items-center space-x-2 text-[#071A33]/70">
                <Activity className="w-3.5 h-3.5 text-[#C89A3D] animate-pulse" />
                <span className="font-semibold text-[#071A33] tabular-nums">
                  {progressPercent}%
                </span>
              </div>
              <div className="h-4 w-[1px] bg-[#071A33]/15" />
              <div className="text-[11px] tracking-widest uppercase font-semibold text-[#8F6B2C]">
                STAGE {STAGES[activeStageIndex].stepNumber} OF 05
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- MIDDLE HORIZONTAL CANVAS & SVG PATH ---------------- */}
        <div className="relative w-full flex-1 flex items-center overflow-hidden my-2">
          {/* Panoramic Track */}
          <div
            ref={horizontalTrackRef}
            className="relative flex items-center h-full min-w-max pr-[6vw] pl-[6vw]"
          >
            {/* CONTINUOUS CUSTOM BEZIER UNDULATING SVG TRAJECTORY PATH */}
            {/*
                Waypoints at stage nodes:
                Stage 01 (below): node at (450, 180). Card sits BELOW at y=230..530.
                Stage 02 (above): node at (1300, 420). Card sits ABOVE at y=50..350.
                Stage 03 (below): node at (2150, 180). Card sits BELOW at y=230..530.
                Stage 04 (above): node at (3000, 420). Card sits ABOVE at y=50..350.
                Stage 05 (below): node at (3850, 200). Card sits BELOW at y=240..530.
                HALTS EXACTLY AT STAGE 05 (no extra void or empty drift past 5).
            */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0"
              viewBox="0 0 4300 600"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id="goldTrajectoryGlow"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8F6B2C" stopOpacity="0.5" />
                  <stop offset="35%" stopColor="#C89A3D" stopOpacity="1" />
                  <stop offset="75%" stopColor="#E2BD68" stopOpacity="1" />
                  <stop offset="100%" stopColor="#F5F1E8" stopOpacity="0.9" />
                </linearGradient>

                <filter
                  id="markerGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* 1. Muted Background Ghost Path (Waiting trajectory) */}
              <path
                ref={ghostPathRef}
                d="M 50 180 C 250 180, 280 180, 450 180 C 875 180, 875 420, 1300 420 C 1725 420, 1725 180, 2150 180 C 2575 180, 2575 420, 3000 420 C 3425 420, 3425 200, 3850 200"
                stroke="#071A33"
                strokeOpacity="0.1"
                strokeWidth="2.5"
                strokeDasharray="6 8"
                fill="none"
              />

              {/* 2. Active Champagne Gold Trajectory Path (Drawn by ScrollTrigger) */}
              <path
                ref={activePathRef}
                d="M 50 180 C 250 180, 280 180, 450 180 C 875 180, 875 420, 1300 420 C 1725 420, 1725 180, 2150 180 C 2575 180, 2575 420, 3000 420 C 3425 420, 3425 200, 3850 200"
                stroke="url(#goldTrajectoryGlow)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                filter="drop-shadow(0 2px 10px rgba(200, 154, 61, 0.5))"
              />

              {/* 3. Traveling Champagne Gold Reticle / Compass Marker */}
              <g ref={markerRef} className="pointer-events-none" transform="translate(50, 180)">
                {/* Outer pulsing radar ring */}
                <circle
                  r="20"
                  fill="none"
                  stroke="#C89A3D"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  className="animate-ping"
                  style={{ transformOrigin: "center", animationDuration: "2.4s" }}
                />
                {/* Middle Reticle Circle */}
                <circle
                  r="12"
                  fill="#071A33"
                  stroke="#C89A3D"
                  strokeWidth="2"
                  filter="url(#markerGlow)"
                />
                {/* Center Core Dot */}
                <circle r="4.5" fill="#F4EFE5" />
                {/* Crosshair ticks */}
                <line x1="-16" y1="0" x2="-8" y2="0" stroke="#C89A3D" strokeWidth="1.2" />
                <line x1="8" y1="0" x2="16" y2="0" stroke="#C89A3D" strokeWidth="1.2" />
                <line x1="0" y1="-16" x2="0" y2="-8" stroke="#C89A3D" strokeWidth="1.2" />
                <line x1="0" y1="8" x2="0" y2="16" stroke="#C89A3D" strokeWidth="1.2" />
              </g>

              {/* Waypoint Calibration Nodes & Vertical Architectural Datum Ticks */}
              {[
                { x: 450, y: 180, tickY2: 230, label: "01" },
                { x: 1300, y: 420, tickY2: 370, label: "02" },
                { x: 2150, y: 180, tickY2: 230, label: "03" },
                { x: 3000, y: 420, tickY2: 370, label: "04" },
                { x: 3850, y: 200, tickY2: 240, label: "05" },
              ].map((wp, i) => {
                const isPassed = i <= activeStageIndex;
                return (
                  <g key={wp.label} className="transition-all duration-500">
                    {/* Vertical connecting datum line from path to card */}
                    <line
                      x1={wp.x}
                      y1={wp.y}
                      x2={wp.x}
                      y2={wp.tickY2}
                      stroke={isPassed ? "#C89A3D" : "#071A33"}
                      strokeOpacity={isPassed ? "0.6" : "0.15"}
                      strokeWidth="1.5"
                      strokeDasharray="2 3"
                    />
                    {/* Node circle */}
                    <circle
                      cx={wp.x}
                      cy={wp.y}
                      r={isPassed ? "7" : "5"}
                      fill={isPassed ? "#C89A3D" : "#E5DFD3"}
                      stroke="#071A33"
                      strokeWidth={isPassed ? "2.5" : "1.2"}
                    />
                  </g>
                );
              })}
            </svg>

            {/* 5 STAGES SPACED GENEROUSLY ALONG THE PANORAMA */}
            {STAGES.map((stage, idx) => {
              const isActive = idx === activeStageIndex;
              const isPast = idx < activeStageIndex;
              const Icon = stage.icon;

              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    stageCardsRef.current[idx] = el;
                  }}
                  className={`relative flex flex-col w-[64vw] max-w-[560px] mx-[5vw] transition-all duration-700 ease-out z-10 ${
                    stage.position === "below"
                      ? "mt-24 xl:mt-28" // Positioned comfortably below curve (y ~ 240..540)
                      : "mb-24 xl:mb-28" // Positioned comfortably above curve (y ~ 60..360)
                  } ${
                    isActive
                      ? "opacity-100 scale-100"
                      : isPast
                      ? "opacity-50 hover:opacity-85 scale-[0.98]"
                      : "opacity-30 scale-[0.96]"
                  }`}
                >
                  {/* Stage Internal Paper Architecture Frame */}
                  <div
                    className={`relative p-7 sm:p-9 xl:p-10 rounded-2xl transition-all duration-500 ${
                      isActive
                        ? "bg-[#FAF7F2] border-2 border-[#C89A3D]/50 shadow-[0_20px_50px_rgba(7,26,51,0.08)] ring-1 ring-[#C89A3D]/20"
                        : "bg-[#F3EFE7]/50 border border-[#071A33]/[0.08]"
                    }`}
                  >
                    {/* Top Architectural Metadata Row */}
                    <div className="flex items-center justify-between border-b border-[#071A33]/[0.08] pb-3 mb-6">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`p-1.5 rounded-md transition-colors duration-500 ${
                            isActive
                              ? "bg-[#071A33] text-[#C89A3D]"
                              : "bg-[#071A33]/5 text-[#071A33]/50"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-mono text-[11px] tracking-[0.22em] uppercase font-semibold text-[#8F6B2C]">
                          {stage.tag}
                        </span>
                      </div>

                      <div className="font-mono text-[10px] tracking-widest text-[#071A33]/50 uppercase">
                        {stage.stepNumber} / 05
                      </div>
                    </div>

                    {/* Massive Architectural Serif Stage Number & Micro-Moment Accent */}
                    <div className="flex items-baseline justify-between mb-3">
                      <span
                        className={`font-serif text-6xl sm:text-7xl xl:text-8xl font-light leading-none tracking-tighter transition-colors duration-500 ${
                          isActive
                            ? "text-[#071A33]"
                            : isPast
                            ? "text-[#071A33]/45"
                            : "text-[#071A33]/25"
                        }`}
                      >
                        {stage.stepNumber}
                      </span>

                      {/* STAGE-SPECIFIC MICRO-MOMENT VISUAL ACCENT */}
                      <div className="self-center">
                        {/* 01 Discovery: Focus Reticle Bracket Settle */}
                        {stage.id === "discovery" && (
                          <div
                            className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all duration-500 ${
                              isActive
                                ? "border-[#C89A3D] bg-[#C89A3D]/10 text-[#8F6B2C] shadow-sm"
                                : "border-[#071A33]/15 text-[#071A33]/40"
                            }`}
                          >
                            <span className="font-mono text-xs font-semibold">[ ⌖ ]</span>
                            <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
                              FOCAL AUDIT
                            </span>
                          </div>
                        )}

                        {/* 02 Proposal: Geometric Framing Datum Rule */}
                        {stage.id === "proposal" && (
                          <div
                            className={`flex items-center space-x-2 px-3 py-1 rounded border transition-all duration-500 ${
                              isActive
                                ? "border-[#C89A3D] bg-[#C89A3D]/10 text-[#8F6B2C] shadow-sm"
                                : "border-[#071A33]/15 text-[#071A33]/40"
                            }`}
                          >
                            <span className="w-2.5 h-[1.5px] bg-[#C89A3D]" />
                            <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
                              SPEC & SCOPE
                            </span>
                            <span className="w-2.5 h-[1.5px] bg-[#C89A3D]" />
                          </div>
                        )}

                        {/* 03 Onboarding: Precision System Alignment Triple Bars */}
                        {stage.id === "onboarding" && (
                          <div
                            className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all duration-500 ${
                              isActive
                                ? "border-[#C89A3D] bg-[#C89A3D]/10 text-[#8F6B2C] shadow-sm"
                                : "border-[#071A33]/15 text-[#071A33]/40"
                            }`}
                          >
                            <span className="font-mono text-xs tracking-tighter font-bold">| | |</span>
                            <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
                              ALIGNMENT
                            </span>
                          </div>
                        )}

                        {/* 04 Monthly Advisory: Waveform Rhythm Pulse */}
                        {stage.id === "monthly-advisory" && (
                          <div
                            className={`flex items-center space-x-1.5 px-3 py-1 rounded border transition-all duration-500 ${
                              isActive
                                ? "border-[#C89A3D] bg-[#C89A3D]/10 text-[#8F6B2C] shadow-sm"
                                : "border-[#071A33]/15 text-[#071A33]/40"
                            }`}
                          >
                            <span className="font-mono text-xs text-[#C89A3D] animate-pulse font-bold">
                              ∿ ∿
                            </span>
                            <span className="font-mono text-[10px] tracking-wider uppercase font-medium">
                              CADENCE
                            </span>
                          </div>
                        )}

                        {/* 05 Long-Term Partnership: Ascending Horizon Compounding Emblem */}
                        {stage.id === "long-term-partnership" && (
                          <div
                            className={`flex items-center space-x-2 px-3.5 py-1 rounded border transition-all duration-500 ${
                              isActive
                                ? "border-[#C89A3D] bg-[#C89A3D] text-[#F4EFE5] shadow-[0_0_15px_rgba(200,154,61,0.4)]"
                                : "border-[#071A33]/15 text-[#071A33]/40"
                            }`}
                          >
                            <span className="font-mono text-xs font-bold">↗ ∞</span>
                            <span className="font-mono text-[10px] tracking-widest uppercase font-semibold">
                              COMPOUNDING
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Title */}
                    <h3
                      className={`font-serif text-3xl sm:text-4xl xl:text-[2.6rem] font-normal tracking-tight mb-3 transition-colors duration-500 ${
                        isActive ? "text-[#071A33]" : "text-[#071A33]/80"
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {/* Stage Body Copy (EXACT COPY UNCHANGED) */}
                    <p className="font-sans text-base xl:text-lg text-[#071A33]/85 font-light leading-relaxed mb-6">
                      {stage.body}
                    </p>

                    {/* Bottom Micro Stage Tag */}
                    <div className="pt-3.5 border-t border-[#071A33]/[0.08] flex items-center justify-between text-[#071A33]/60 font-mono text-[10px] tracking-wider">
                      <span className="uppercase text-[#8F6B2C] font-medium">{stage.subTag}</span>
                      <span className="flex items-center space-x-1 font-semibold text-[#8F6B2C]">
                        <span>STAGE {stage.stepNumber}</span>
                        <ArrowRight className="w-3 h-3 text-[#C89A3D]" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- BOTTOM PROGRESS FLOW ---------------- */}
        <div className="w-full flex items-center justify-end border-t border-[#071A33]/[0.08] pt-3 shrink-0 text-xs font-mono text-[#071A33]/70">
          <div className="flex items-center space-x-2.5 text-[11px] tracking-wider">
            <span>DISCOVERY</span>
            <span className="text-[#C89A3D]">→</span>
            <span>PROPOSAL</span>
            <span className="text-[#C89A3D]">→</span>
            <span>ONBOARDING</span>
            <span className="text-[#C89A3D]">→</span>
            <span>ADVISORY</span>
            <span className="text-[#C89A3D]">→</span>
            <span className="font-bold text-[#071A33]">PARTNERSHIP</span>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE EXPERIENCE (< 1024px): EDITORIAL VERTICAL JOURNEY     */}
      {/* ============================================================ */}
      <div
        ref={mobileSectionRef}
        className="block lg:hidden w-full relative z-10 px-6 sm:px-10 pt-28 sm:pt-32 pb-20 sm:pb-24"
      >
        {/* Section Header */}
        <div className="max-w-xl mb-12 sm:mb-14">
          <div className="flex items-center space-x-3 mb-3">
            <span className="h-[1.5px] w-8 bg-[#C89A3D] rounded-full inline-block" />
            <span className="font-mono text-xs tracking-[0.28em] uppercase font-semibold text-[#8F6B2C]">
              OUR PROCESS
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal leading-tight tracking-tight text-[#071A33] mb-3">
            A continuous trajectory of{" "}
            <span className="italic text-[#C89A3D]">clarity.</span>
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#071A33]/80 font-light leading-relaxed">
            Every partnership follows a rigorous, compounding sequence from
            first diagnosis to long-term trust.
          </p>
        </div>

        {/* Vertical Journey: Clean Mobile & Tablet Process Sequence */}
        <div className="w-full flex flex-col space-y-6 sm:space-y-8">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <div
                key={`mob-${stage.id}`}
                className="mobile-stage-card relative bg-[#FAF7F2] border border-[#071A33]/[0.1] border-l-4 border-l-[#C89A3D] p-6 sm:p-7 rounded-2xl shadow-[0_6px_20px_rgba(7,26,51,0.04)]"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-[#071A33]/[0.08] pb-3 mb-3.5">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-[#C89A3D]" />
                    <span className="font-mono text-[10px] tracking-widest uppercase font-semibold text-[#8F6B2C]">
                      {stage.tag}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#071A33]/50">
                    {stage.stepNumber} / 05
                  </span>
                </div>

                {/* Architectural Number & Title */}
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="font-serif text-4xl sm:text-5xl font-light text-[#071A33]">
                    {stage.stepNumber}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#071A33]">
                    {stage.title}
                  </h3>
                </div>

                {/* Exact Body Copy */}
                <p className="font-sans text-sm sm:text-base text-[#071A33]/85 font-light leading-relaxed mb-4">
                  {stage.body}
                </p>

                {/* Micro Accent Tag */}
                <div className="pt-3 border-t border-[#071A33]/[0.07] flex items-center justify-between font-mono text-[10px] text-[#071A33]/60 tracking-wider">
                  <span>{stage.subTag}</span>
                  <span className="text-[#8F6B2C] font-semibold">STAGE {stage.stepNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
