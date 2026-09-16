"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PrincipleItem {
  id: string;
  step: string;
  tag: string;
  shortLabel: string;
  fullText: string;
  angle: number; // In degrees, clockwise from 12 o'clock (0° = 12 o'clock)
}

// 5 Equidistant Horological Principle Stations (0°, 72°, 144°, 216°, 288°)
const PRINCIPLES_DATA: PrincipleItem[] = [
  {
    id: "p1",
    step: "01",
    tag: "ETHOS I",
    shortLabel: "TRUTH",
    fullText: "Truth before comfort.",
    angle: 0,
  },
  {
    id: "p2",
    step: "02",
    tag: "ETHOS II",
    shortLabel: "CLARITY",
    fullText: "Clarity before complexity.",
    angle: 72,
  },
  {
    id: "p3",
    step: "03",
    tag: "ETHOS III",
    shortLabel: "JUDGMENT",
    fullText: "Judgment before automation.",
    angle: 144,
  },
  {
    id: "p4",
    step: "04",
    tag: "ETHOS IV",
    shortLabel: "DISCIPLINE",
    fullText: "Discipline before growth.",
    angle: 216,
  },
  {
    id: "p5",
    step: "05",
    tag: "ETHOS V",
    shortLabel: "COMPOUNDS",
    fullText: "Advice that compounds.",
    angle: 288,
  },
];

// 12 Roman Numerals for the Haute-Horlogerie Dial
const ROMAN_NUMERALS = [
  { label: "XII", deg: 0 },
  { label: "I", deg: 30 },
  { label: "II", deg: 60 },
  { label: "III", deg: 90 },
  { label: "IV", deg: 120 },
  { label: "V", deg: 150 },
  { label: "VI", deg: 180 },
  { label: "VII", deg: 210 },
  { label: "VIII", deg: 240 },
  { label: "IX", deg: 270 },
  { label: "X", deg: 300 },
  { label: "XI", deg: 330 },
];

export default function PrinciplesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const pinContainerRef = useRef<HTMLDivElement | null>(null);

  // Heading and intro refs
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Watch Face SVG refs
  const outerBezelRef = useRef<SVGCircleElement | null>(null);
  const secondaryBezelRef = useRef<SVGCircleElement | null>(null);
  const ticksGroupRef = useRef<SVGGElement | null>(null);
  const romanGroupRef = useRef<SVGGElement | null>(null);
  const innerRingsGroupRef = useRef<SVGGElement | null>(null);
  const rotatingInnerDialRef = useRef<SVGGElement | null>(null);
  const handGroupRef = useRef<SVGGElement | null>(null);
  const centerPinRef = useRef<SVGGElement | null>(null);
  const finalGoldBurstRef = useRef<SVGCircleElement | null>(null);

  // Complication text animation wrapper
  const complicationContentRef = useRef<HTMLDivElement | null>(null);

  // Active state
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const previousIndexRef = useRef<number>(0);

  // Generate 60 minute tick marks
  const minuteTicks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => {
      const deg = i * 6;
      const isCardinal = deg % 90 === 0;
      const isFive = deg % 30 === 0;
      const isQuarter = deg % 15 === 0;

      const rOuter = 362;
      const rInner = isCardinal ? 346 : isFive ? 350 : 355;
      const rad = ((deg - 90) * Math.PI) / 180;

      const x1 = 400 + rInner * Math.cos(rad);
      const y1 = 400 + rInner * Math.sin(rad);
      const x2 = 400 + rOuter * Math.cos(rad);
      const y2 = 400 + rOuter * Math.sin(rad);

      return {
        deg,
        x1,
        y1,
        x2,
        y2,
        isCardinal,
        isFive,
        isQuarter,
      };
    });
  }, []);

  // Quick jump by clicking a principle station
  const handleJumpToStation = (index: number) => {
    if (!sectionRef.current) return;
    const trigger = ScrollTrigger.getById("principles-horology-pin");
    if (trigger) {
      const targetProgress = index * 0.25;
      const scrollPos = trigger.start + targetProgress * (trigger.end - trigger.start);
      window.scrollTo({ top: scrollPos, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (!sectionRef.current || !pinContainerRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        setActiveIndex(0);
        if (handGroupRef.current) handGroupRef.current.setAttribute("transform", "rotate(0)");
        if (headingRef.current) gsap.set(headingRef.current, { clipPath: "inset(0 0% 0 0)" });
        return;
      }

      const mm = gsap.matchMedia();

      // ── DESKTOP ONLY: PINNED HAUTE HORLOGERIE MECHANICAL WATCH FACE (>= 1024px) ──
      mm.add("(min-width: 1024px)", () => {
        // 1. SECTION ENTRANCE ASSEMBLY ANIMATION
        const enterTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        // Heading unmasking
        enterTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          0
        );

        enterTl.fromTo(
          headingRef.current,
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 0.8, ease: "power3.out" },
          0.1
        );

        // Outer bezel draws clockwise
        if (outerBezelRef.current) {
          const circumference = 2 * Math.PI * 378;
          enterTl.fromTo(
            outerBezelRef.current,
            { strokeDasharray: circumference, strokeDashoffset: circumference },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.out" },
            0.2
          );
        }

        // Secondary bezel and inner rings fade
        if (secondaryBezelRef.current && innerRingsGroupRef.current) {
          enterTl.fromTo(
            [secondaryBezelRef.current, innerRingsGroupRef.current],
            { opacity: 0 },
            { opacity: 1, duration: 0.9, ease: "power2.out" },
            0.4
          );
        }

        // Minute ticks appear
        if (ticksGroupRef.current) {
          enterTl.fromTo(
            ticksGroupRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power1.out" },
            0.5
          );
        }

        // Roman numerals fade in softly
        if (romanGroupRef.current) {
          enterTl.fromTo(
            romanGroupRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.out" },
            0.6
          );
        }

        // Center pin appears
        if (centerPinRef.current) {
          enterTl.fromTo(
            centerPinRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "power2.out" },
            0.7
          );
        }

        // Watch hand smoothly fades into initial position at 0° (Principle 01)
        if (handGroupRef.current) {
          handGroupRef.current.setAttribute("transform", "rotate(0)");
          enterTl.fromTo(
            handGroupRef.current,
            { opacity: 0 },
            { opacity: 1, duration: 0.6, ease: "power2.out" },
            0.65
          );
        }

        // 2. PINNED MECHANICAL SCROLL CONTROLLER (180vh–200vh)
        // Hand rotates from 0° -> 288° precisely matching principles 01 -> 05
        let currentStationIdx = -1;
        ScrollTrigger.create({
          id: "principles-horology-pin",
          trigger: sectionRef.current,
          start: "top top",
          end: "+=190%",
          pin: pinContainerRef.current,
          pinSpacing: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const targetRotation = progress * 288;

            if (handGroupRef.current) {
              handGroupRef.current.setAttribute("transform", `rotate(${targetRotation})`);
              handGroupRef.current.style.opacity = "1";
            }

            if (rotatingInnerDialRef.current) {
              rotatingInnerDialRef.current.setAttribute(
                "transform",
                `rotate(${progress * 12})`
              );
            }

            if (finalGoldBurstRef.current) {
              if (progress >= 0.92) {
                const burstP = (progress - 0.92) / 0.08;
                finalGoldBurstRef.current.setAttribute("opacity", `${burstP * 0.7}`);
                finalGoldBurstRef.current.setAttribute("r", `${380 + burstP * 16}`);
              } else {
                finalGoldBurstRef.current.setAttribute("opacity", "0");
                finalGoldBurstRef.current.setAttribute("r", "380");
              }
            }

            let idx = 0;
            if (progress < 0.18) idx = 0;
            else if (progress < 0.38) idx = 1;
            else if (progress < 0.62) idx = 2;
            else if (progress < 0.85) idx = 3;
            else idx = 4;

            if (idx !== currentStationIdx) {
              currentStationIdx = idx;
              setActiveIndex(idx);
            }
          },
        });
      });

      // ── MOBILE & TABLET: SIMPLE CLEAN SCROLL REVEAL (< 1024px) ──────────
      mm.add("(max-width: 1023px)", () => {
        const mobileCards = sectionRef.current?.querySelectorAll(".mobile-principle-card");
        if (mobileCards && mobileCards.length > 0) {
          gsap.fromTo(
            mobileCards,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
              scrollTrigger: {
                trigger: sectionRef.current?.querySelector(".mobile-principles-container"),
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Directional complication transition when active index changes
  useEffect(() => {
    if (!complicationContentRef.current) return;
    const isForward = activeIndex >= previousIndexRef.current;
    previousIndexRef.current = activeIndex;

    const fromY = isForward ? 18 : -18;
    gsap.fromTo(
      complicationContentRef.current,
      { opacity: 0, y: fromY },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
  }, [activeIndex]);

  return (
    <section
      ref={sectionRef}
      id="principles"
      className="relative w-full bg-[#F5F1E8] text-[#071A33] overflow-hidden select-none scroll-mt-28"
      aria-label="The IntrinsQ Principles — Haute Horlogerie Interaction"
    >
      {/* ── Background: Subtle Technical Blueprint Paper Texture ──── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #071A33 1px, transparent 1px),
            linear-gradient(to bottom, #071A33 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* Faint radial construction arcs for watchmaker blueprint aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[980px] h-[980px] rounded-full border border-[#071A33]/[0.03] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1240px] h-[1240px] rounded-full border border-[#071A33]/[0.02] pointer-events-none" />

      {/* ── PINNED HOROLOGY STAGE (Desktop >= 1024px Viewport Experience) ────── */}
      <div
        ref={pinContainerRef}
        className="hidden lg:flex relative w-full h-screen flex-col justify-between items-center px-5 sm:px-10 lg:px-16 pt-24 sm:pt-28 lg:pt-16 pb-4 sm:pb-6 z-10"
      >
        {/* ── TOP HEADER BAR: Eyebrow + Heading + Quick Dial Waypoints */}
        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-end justify-between gap-3 sm:gap-4 border-b border-[#071A33]/[0.08] pb-3 sm:pb-4 shrink-0">
          {/* Left: Eyebrow & Serif Title */}
          <div>
            <div
              ref={eyebrowRef}
              className="flex items-center gap-2 font-mono text-[10.5px] sm:text-xs tracking-[0.28em] uppercase text-[#C89A3D] font-semibold mb-1"
            >
              <span className="w-3.5 sm:w-4 h-[1px] bg-[#C89A3D]" />
              <span>OUR SIGNATURE</span>
            </div>
            <h2
              ref={headingRef}
              className="font-serif text-2xl sm:text-4xl lg:text-5xl font-light text-[#071A33] tracking-tight leading-none"
            >
              The IntrinsQ Principles
            </h2>
          </div>

          {/* Right: Horological Dial Stations & Waypoints */}
          <div className="flex items-center gap-3 sm:gap-6 font-mono text-xs">
            {/* 5 Quick Jump Stations */}
            <div className="flex items-center space-x-1 bg-[#EAE3D4]/70 border border-[#071A33]/[0.08] p-1 rounded-full shadow-sm">
              {PRINCIPLES_DATA.map((p, idx) => {
                const isActive = idx === activeIndex;
                const isPast = idx < activeIndex;
                return (
                  <button
                    key={p.id}
                    onClick={() => handleJumpToStation(idx)}
                    className={`flex items-center space-x-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-mono transition-all duration-300 ${
                      isActive
                        ? "bg-[#071A33] text-[#F5F1E8] font-semibold shadow-sm"
                        : isPast
                        ? "text-[#071A33]/70 hover:text-[#071A33]"
                        : "text-[#071A33]/40 hover:text-[#071A33]"
                    }`}
                    aria-label={`Jump to principle ${p.step}: ${p.shortLabel}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${
                        isActive
                          ? "bg-[#C89A3D]"
                          : isPast
                          ? "bg-[#071A33]/40"
                          : "bg-[#071A33]/20"
                      }`}
                    />
                    <span>{p.step}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── CENTER HOROLOGICAL MASTERPIECE: THE WATCH FACE ──────── */}
        <div className="relative w-full flex-1 flex items-center justify-center my-auto overflow-visible">
          {/* Central Watch Face Container */}
          <div className="relative w-[310px] h-[310px] sm:w-[460px] sm:h-[460px] lg:w-[580px] lg:h-[580px] xl:w-[620px] xl:h-[620px] flex items-center justify-center select-none">
            {/* 1. MASTER WATCH SVG */}
            <svg
              viewBox="0 0 800 800"
              className="w-full h-full overflow-visible pointer-events-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Subtle gold shadow filter for mechanical depth */}
                <filter id="goldHandGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow
                    dx="0"
                    dy="2"
                    stdDeviation="3"
                    floodColor="#071A33"
                    floodOpacity="0.25"
                  />
                </filter>
              </defs>

              {/* ── LAYER 1: OUTER BEZEL (Double Ring + Fine Detailing) ── */}
              <circle
                ref={outerBezelRef}
                cx="400"
                cy="400"
                r="378"
                stroke="#C89A3D"
                strokeWidth="1.8"
              />
              <circle
                ref={secondaryBezelRef}
                cx="400"
                cy="400"
                r="368"
                stroke="#071A33"
                strokeWidth="0.8"
                strokeOpacity="0.18"
              />
              <circle
                cx="400"
                cy="400"
                r="362"
                stroke="#C89A3D"
                strokeWidth="0.6"
                strokeOpacity="0.35"
              />

              {/* 4 Cardinal Bezel Screws */}
              {[45, 135, 225, 315].map((deg) => {
                const rad = (deg * Math.PI) / 180;
                const sx = 400 + 373 * Math.cos(rad);
                const sy = 400 + 373 * Math.sin(rad);
                return (
                  <g key={`screw-${deg}`}>
                    <circle cx={sx} cy={sy} r="3" fill="#F5F1E8" stroke="#C89A3D" strokeWidth="0.8" />
                    <line
                      x1={sx - 1.8}
                      y1={sy - 1.8}
                      x2={sx + 1.8}
                      y2={sy + 1.8}
                      stroke="#071A33"
                      strokeWidth="0.6"
                    />
                  </g>
                );
              })}

              {/* ── LAYER 2: 60 MINUTE TICKS ───────────────────────── */}
              <g ref={ticksGroupRef}>
                {minuteTicks.map((t) => (
                  <line
                    key={`tick-${t.deg}`}
                    x1={t.x1}
                    y1={t.y1}
                    x2={t.x2}
                    y2={t.y2}
                    stroke={t.isCardinal ? "#C89A3D" : "#071A33"}
                    strokeWidth={t.isCardinal ? "1.8" : t.isFive ? "1.2" : "0.7"}
                    strokeOpacity={t.isCardinal ? "0.85" : t.isFive ? "0.4" : "0.15"}
                  />
                ))}
              </g>

              {/* ── LAYER 3: REFINED ROMAN NUMERALS (XII to XI) ─────── */}
              <g ref={romanGroupRef}>
                {ROMAN_NUMERALS.map((rn) => {
                  const rad = ((rn.deg - 90) * Math.PI) / 180;
                  const rx = 400 + 322 * Math.cos(rad);
                  const ry = 400 + 322 * Math.sin(rad);

                  return (
                    <text
                      key={rn.label}
                      x={rx}
                      y={ry}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-serif text-[18px] sm:text-[20px] font-normal tracking-wider fill-[#071A33] opacity-40 select-none"
                    >
                      {rn.label}
                    </text>
                  );
                })}
              </g>

              {/* ── LAYER 4: INNER CONCENTRIC RINGS & COMPLICATION ─── */}
              <g ref={innerRingsGroupRef}>
                {/* Secondary inner bezel */}
                <circle
                  cx="400"
                  cy="400"
                  r="285"
                  stroke="#C89A3D"
                  strokeWidth="0.8"
                  strokeOpacity="0.3"
                />
                <circle
                  cx="400"
                  cy="400"
                  r="278"
                  stroke="#071A33"
                  strokeWidth="0.6"
                  strokeOpacity="0.12"
                  strokeDasharray="4 6"
                />

                {/* Micro dial concentric track */}
                <circle
                  cx="400"
                  cy="400"
                  r="200"
                  stroke="#071A33"
                  strokeWidth="0.6"
                  strokeOpacity="0.08"
                />
              </g>

              {/* Rotating inner mechanical dial pattern */}
              <g transform="translate(400, 400)">
                <g ref={rotatingInnerDialRef}>
                  <circle
                    cx="0"
                    cy="0"
                    r="170"
                    stroke="#C89A3D"
                    strokeWidth="1.2"
                    strokeOpacity="0.45"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="164"
                    stroke="#071A33"
                    strokeWidth="0.6"
                    strokeOpacity="0.1"
                  />
                  {/* 12 Micro inner dial ticks */}
                  {Array.from({ length: 12 }, (_, i) => {
                    const rad = (i * 30 * Math.PI) / 180;
                    return (
                      <line
                        key={`idial-${i}`}
                        x1={158 * Math.cos(rad)}
                        y1={158 * Math.sin(rad)}
                        x2={164 * Math.cos(rad)}
                        y2={164 * Math.sin(rad)}
                        stroke="#C89A3D"
                        strokeWidth="0.9"
                        strokeOpacity="0.5"
                      />
                    );
                  })}
                </g>
              </g>

              {/* Final moment burst ring when reaching 05 */}
              <circle
                ref={finalGoldBurstRef}
                cx="400"
                cy="400"
                r="380"
                stroke="#C89A3D"
                strokeWidth="2.5"
                fill="none"
                opacity="0"
              />

              {/* ── LAYER 5: HAUTE-HORLOGERIE WATCH HAND / NEEDLE ───── */}
              {/* Wrapped in a translated group at (400, 400) for 100% mathematically exact rotation around origin (0, 0) */}
              <g transform="translate(400, 400)">
                <g ref={handGroupRef} filter="url(#goldHandGlow)">
                  {/* 1. Counterweight balance tail (extends downward 40px) */}
                  <path
                    d="M -2.5 0 L -3.5 40 C -3.5 46, 3.5 46, 3.5 40 L 2.5 0 Z"
                    fill="#071A33"
                  />
                  <circle cx="0" cy="36" r="3.5" fill="#F5F1E8" stroke="#C89A3D" strokeWidth="0.8" />

                  {/* 2. Main hand body (Navy spine tapering upward from 0 to -260) */}
                  <path
                    d="M -2 0 L -1.2 -260 L 1.2 -260 L 2 0 Z"
                    fill="#071A33"
                  />

                  {/* 3. Breguet Openwork Pierced Moon / Teardrop Motif (-260 to -292) */}
                  <path
                    d="M 0 -260 C -9 -266, -9 -286, 0 -292 C 9 -286, 9 -266, 0 -260 Z"
                    fill="#071A33"
                    stroke="#C89A3D"
                    strokeWidth="1.4"
                  />
                  {/* Inner cutout */}
                  <path
                    d="M 0 -266 C -5 -270, -5 -282, 0 -286 C 5 -282, 5 -270, 0 -266 Z"
                    fill="#F5F1E8"
                  />

                  {/* 4. Fine Champagne-Gold Pointer Needle (-292 to -332) */}
                  <path
                    d="M -0.8 -292 L 0 -332 L 0.8 -292 Z"
                    fill="#C89A3D"
                  />
                  {/* Micro gold tip highlight point */}
                  <circle cx="0" cy="-332" r="1.2" fill="#C89A3D" />
                </g>
              </g>

              {/* ── LAYER 6: MULTI-TIERED MECHANICAL CENTER PIN ─────── */}
              <g ref={centerPinRef} transform="translate(400, 400)">
                {/* Tier 1: Outer Gold Collar */}
                <circle cx="0" cy="0" r="12" fill="#F5F1E8" stroke="#C89A3D" strokeWidth="1.4" />
                {/* Tier 2: Navy Bezel Washer */}
                <circle cx="0" cy="0" r="7.5" fill="#071A33" />
                {/* Tier 3: Core Champagne-Gold Jewel Pin */}
                <circle cx="0" cy="0" r="3" fill="#C89A3D" />
              </g>
            </svg>

            {/* 2. CENTER COMPLICATION APERTURE: ACTIVE PRINCIPLE READOUT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              <div
                ref={complicationContentRef}
                className="w-[190px] sm:w-[240px] text-center flex flex-col items-center justify-center px-3 sm:px-4 relative z-20"
              >
                <div className="font-mono text-[9px] sm:text-[11px] tracking-[0.24em] uppercase text-[#8F6B2C] font-semibold mb-0.5 sm:mb-1">
                  PRINCIPLE {PRINCIPLES_DATA[activeIndex].step}
                </div>
                <div className="font-serif text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-[#071A33] leading-none mb-1 sm:mb-2">
                  {PRINCIPLES_DATA[activeIndex].shortLabel}
                </div>
                <p className="font-serif italic text-xs sm:text-sm lg:text-base text-[#C89A3D] font-normal leading-snug">
                  “{PRINCIPLES_DATA[activeIndex].fullText}”
                </p>
              </div>
            </div>

            {/* 3. PERIPHERAL PRINCIPLE NODES (Positioned at 0°, 72°, 144°, 216°, 288°) */}
            {PRINCIPLES_DATA.map((p, idx) => {
              const isActive = idx === activeIndex;

              // Station specific position, alignment, and origin
              let posClasses = "";
              let alignClasses = "";
              let originClass = "";

              if (p.angle === 0) {
                // Top center (12 o'clock)
                posClasses = "-top-8 sm:-top-10 left-1/2 -translate-x-1/2 -translate-y-full";
                alignClasses = "items-center text-center";
                originClass = "origin-center";
              } else if (p.angle === 72) {
                // Top right (~2:24)
                posClasses = "top-[18%] -right-8 sm:-right-12 translate-x-full -translate-y-1/2";
                alignClasses = "items-start text-left";
                originClass = "origin-left";
              } else if (p.angle === 144) {
                // Bottom right (~4:48)
                posClasses = "bottom-[16%] -right-6 sm:-right-10 translate-x-full translate-y-1/2";
                alignClasses = "items-start text-left";
                originClass = "origin-left";
              } else if (p.angle === 216) {
                // Bottom left (~7:12)
                posClasses = "bottom-[16%] -left-6 sm:-left-10 -translate-x-full translate-y-1/2";
                alignClasses = "items-end text-right";
                originClass = "origin-right";
              } else if (p.angle === 288) {
                // Top left (~9:36)
                posClasses = "top-[18%] -left-8 sm:-left-12 -translate-x-full -translate-y-1/2";
                alignClasses = "items-end text-right";
                originClass = "origin-right";
              }

              return (
                <div
                  key={`station-${p.id}`}
                  onClick={() => handleJumpToStation(idx)}
                  className={`hidden md:flex absolute flex-col max-w-[190px] lg:max-w-[220px] cursor-pointer transition-all duration-400 pointer-events-auto ${posClasses} ${alignClasses} ${
                    isActive
                      ? "opacity-100 scale-105 z-30"
                      : "opacity-35 hover:opacity-70 scale-95 z-10"
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        isActive
                          ? "bg-[#C89A3D] shadow-[0_0_8px_rgba(200,154,61,0.8)] scale-125"
                          : "bg-[#071A33]/30"
                      }`}
                    />
                    <span className="font-mono text-[10.5px] tracking-[0.2em] uppercase font-semibold text-[#8F6B2C]">
                      {p.step}
                    </span>
                  </div>

                  <div
                    className={`font-sans text-xs lg:text-sm font-semibold tracking-wide transition-colors duration-300 ${
                      isActive ? "text-[#071A33]" : "text-[#071A33]/70"
                    }`}
                  >
                    {p.fullText}
                  </div>

                  {/* Active gold underline */}
                  <span
                    className={`h-[1px] bg-[#C89A3D] mt-1.5 transition-all duration-400 ${originClass} ${
                      isActive ? "w-12 scale-x-100 opacity-100" : "w-6 scale-x-0 opacity-0"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── MOBILE & TABLET EDITORIAL CARDS (< 1024px) ─────────────── */}
      <div className="block lg:hidden mobile-principles-container relative z-10 w-full max-w-2xl mx-auto px-6 sm:px-10 pt-28 sm:pt-32 pb-20 sm:pb-24">
        {/* Section Header */}
        <div className="mb-10 sm:mb-12">
          <div className="flex items-center gap-2 font-mono text-xs tracking-[0.28em] uppercase text-[#C89A3D] font-semibold mb-2">
            <span className="w-4 h-[1px] bg-[#C89A3D]" />
            <span>OUR SIGNATURE</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#071A33] tracking-tight leading-tight">
            The IntrinsQ Principles
          </h2>
          <p className="font-sans text-sm sm:text-base text-[#071A33]/70 font-light leading-relaxed mt-2.5">
            The non-negotiable standards that govern every financial decision and advisory relationship.
          </p>
        </div>

        {/* 5 Luxury Principle Cards */}
        <div className="flex flex-col space-y-5 sm:space-y-6">
          {PRINCIPLES_DATA.map((p) => (
            <div
              key={`mob-p-${p.id}`}
              className="mobile-principle-card relative bg-[#FAF7F2] border border-[#071A33]/[0.1] border-l-4 border-l-[#C89A3D] p-6 sm:p-7 rounded-2xl shadow-[0_6px_20px_rgba(7,26,51,0.04)]"
            >
              {/* Top Metadata Row */}
              <div className="flex items-center justify-between border-b border-[#071A33]/[0.08] pb-3 mb-4">
                <span className="font-mono text-[11px] tracking-widest font-semibold text-[#8F6B2C] uppercase">
                  {p.tag}
                </span>
                <span className="font-mono text-xs text-[#071A33]/50">
                  PRINCIPLE {p.step}
                </span>
              </div>

              {/* Short Label */}
              <h3 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-[#071A33] mb-2">
                {p.shortLabel}
              </h3>

              {/* Full Text Quote */}
              <p className="font-serif italic text-base sm:text-lg text-[#C89A3D] font-normal leading-relaxed">
                “{p.fullText}”
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
