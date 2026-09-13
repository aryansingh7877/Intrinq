"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, ArrowRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const AI_ITEMS = [
  { id: "01", title: "Data preparation", category: "INGESTION" },
  { id: "02", title: "Report generation", category: "SYNTHESIS" },
  { id: "03", title: "Reconciliation", category: "INTEGRITY" },
  { id: "04", title: "Payroll calculations", category: "EXECUTION" },
  { id: "05", title: "Workflow automation", category: "ORCHESTRATION" },
];

const HUMAN_ITEMS = [
  { id: "01", title: "Judgment", realm: "CONVICTION" },
  { id: "02", title: "Strategy", realm: "DIRECTION" },
  { id: "03", title: "Difficult decisions", realm: "GOVERNANCE" },
  { id: "04", title: "Financial planning", realm: "HORIZON" },
  { id: "05", title: "Business conversations", realm: "LEADERSHIP" },
];

export default function AiVsHumanSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const centerGlyphRef = useRef<HTMLDivElement>(null);
  const aiItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const humanItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Hover state pairing: hovering item index 0 highlights item index 0 on both sides
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [
            eyebrowLineRef.current,
            eyebrowTextRef.current,
            headlineRef.current,
            leftColRef.current,
            rightColRef.current,
            dividerRef.current,
            centerGlyphRef.current,
            aiItemsRef.current,
            humanItemsRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scaleY: 1, scale: 1 }
        );
        return;
      }

      // Initial states for smooth entrance
      gsap.set(eyebrowLineRef.current, { scaleX: 0, transformOrigin: "center center" });
      gsap.set(eyebrowTextRef.current, { opacity: 0, y: 10 });
      gsap.set(headlineRef.current, { opacity: 0, y: 25 });
      gsap.set(leftColRef.current, { opacity: 0, x: -20 });
      gsap.set(rightColRef.current, { opacity: 0, x: 20 });
      gsap.set(dividerRef.current, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(centerGlyphRef.current, { scale: 0, rotation: 0, transformOrigin: "center center" });
      gsap.set(aiItemsRef.current, { opacity: 0, y: 14 });
      gsap.set(humanItemsRef.current, { opacity: 0, y: 14 });

      // Clean, elegant parallel ScrollTrigger reveal
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      tl.to(eyebrowLineRef.current, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0)
        .to(eyebrowTextRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" }, 0.15)
        .to(dividerRef.current, { scaleY: 1, duration: 0.6, ease: "power2.out" }, 0.2)
        .to(centerGlyphRef.current, { scale: 1, rotation: 45, duration: 0.5, ease: "back.out(1.6)" }, 0.25)
        .to([leftColRef.current, rightColRef.current], { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 0.2)
        .to(aiItemsRef.current, { opacity: 1, y: 0, stagger: 0.05, duration: 0.45, ease: "power2.out" }, 0.25)
        .to(humanItemsRef.current, { opacity: 1, y: 0, stagger: 0.05, duration: 0.45, ease: "power2.out" }, 0.25);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="decision-arena"
      aria-label="A Process Built on Judgment: AI Speed vs Human Conviction"
      className="relative w-full bg-[#071A33] text-[#F4EFE5] py-24 sm:py-28 md:py-32 px-6 sm:px-10 md:px-16 lg:px-24 transition-colors duration-700 overflow-hidden select-none"
    >
      {/* Background Architectural Luxury Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200, 154, 61, 0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 154, 61, 0.35) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Ambient Subtle Center Radial Glow */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(200, 154, 61, 0.18) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center">
        {/* ========================================================== */}
        {/* 1. UPPER EDITORIAL HEADER                                  */}
        {/* ========================================================== */}
        <div className="text-center max-w-3xl mb-14 sm:mb-16 md:mb-20">
          {/* Eyebrow */}
          <div className="flex items-center justify-center space-x-3 mb-4 md:mb-5">
            <span
              ref={eyebrowLineRef}
              className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block"
            />
            <span
              ref={eyebrowTextRef}
              className="text-xs sm:text-[13px] tracking-[0.28em] uppercase font-mono font-semibold text-[#C89A3D]"
            >
              A PROCESS BUILT ON JUDGMENT
            </span>
            <span className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block" />
          </div>

          {/* Heading */}
          <h2
            ref={headlineRef}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal leading-[1.14] tracking-tight text-[#F4EFE5]"
          >
            <span className="block">AI gives us speed.</span>
            <span className="block mt-1 sm:mt-1.5">
              Experience gives us{" "}
              <span className="font-serif italic font-normal text-[#C89A3D] drop-shadow-[0_2px_14px_rgba(200,154,61,0.35)]">
                conviction.
              </span>
            </span>
          </h2>
        </div>

        {/* ========================================================== */}
        {/* 2. TWO OPPOSING COLUMNS WITH CENTER ARCHITECTURAL DIVIDER  */}
        {/* ========================================================== */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-11 gap-10 lg:gap-0 items-start justify-between">
          {/* -------------------------------------------------------- */}
          {/* LEFT COLUMN: AI HANDLES / The Repeatable (~5 cols)       */}
          {/* -------------------------------------------------------- */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col lg:pr-8">
            {/* Column Header */}
            <div className="border-l-2 border-[#C89A3D]/70 pl-4 mb-5 md:mb-6">
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.26em] uppercase text-[#C89A3D] font-semibold block mb-1">
                AI HANDLES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE5] font-light italic">
                The Repeatable.
              </h3>
            </div>

            {/* 5 AI Items */}
            <div className="flex flex-col space-y-3.5">
              {AI_ITEMS.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      aiItemsRef.current[idx] = el;
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group relative flex items-center justify-between p-4 sm:p-4.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "bg-[#0B254A] border-[#C89A3D] shadow-[0_8px_24px_rgba(200,154,61,0.18)] -translate-x-1"
                        : "bg-[#091F3D]/80 border-white/[0.12] hover:border-white/25 shadow-sm"
                    }`}
                  >
                    {/* Left: Index & Title */}
                    <div className="flex items-center space-x-3.5">
                      <span
                        className={`font-mono text-xs tracking-widest font-semibold transition-colors duration-300 ${
                          isHovered ? "text-[#C89A3D]" : "text-[#C89A3D]/70"
                        }`}
                      >
                        {item.id}
                      </span>
                      <div className="h-3.5 w-[1px] bg-white/20" />
                      <span
                        className={`font-sans text-base sm:text-lg font-light tracking-wide transition-colors duration-300 ${
                          isHovered ? "text-[#F4EFE5]" : "text-[#F4EFE5]"
                        }`}
                      >
                        <span className="text-[#C89A3D] mr-2">✓</span>
                        {item.title}
                      </span>
                    </div>

                    {/* Right: Technical Spec Tag */}
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] tracking-widest text-[#C89A3D]/70 uppercase hidden sm:inline">
                        {item.category}
                      </span>
                      <ArrowRight
                        className={`w-3.5 h-3.5 text-[#C89A3D] transition-transform duration-300 ${
                          isHovered ? "translate-x-1 opacity-100" : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CENTER: ARCHITECTURAL VERTICAL DIVIDER (~1 col)          */}
          {/* -------------------------------------------------------- */}
          <div className="hidden lg:flex lg:col-span-1 self-stretch relative items-center justify-center">
            {/* Center Vertical Line */}
            <div
              ref={dividerRef}
              className="absolute inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-[#C89A3D]/50 to-transparent pointer-events-none"
            />

            {/* Central Gold Diamond Marker */}
            <div
              ref={centerGlyphRef}
              className="relative z-10 w-8 h-8 rounded-sm bg-[#071A33] border border-[#C89A3D] flex items-center justify-center shadow-[0_0_15px_rgba(200,154,61,0.3)] transition-transform duration-500"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#C89A3D]" />
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* RIGHT COLUMN: WE HANDLE / The Consequential (~5 cols)    */}
          {/* -------------------------------------------------------- */}
          <div ref={rightColRef} className="lg:col-span-5 flex flex-col lg:pl-8">
            {/* Column Header */}
            <div className="border-l-2 border-[#C89A3D] pl-4 mb-5 md:mb-6">
              <span className="text-xs sm:text-[13px] font-mono tracking-[0.26em] uppercase text-[#C89A3D] font-semibold block mb-1">
                WE HANDLE
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F4EFE5] font-light italic">
                The Consequential.
              </h3>
            </div>

            {/* 5 Human Items */}
            <div className="flex flex-col space-y-3.5">
              {HUMAN_ITEMS.map((item, idx) => {
                const isHovered = hoveredIndex === idx;
                return (
                  <div
                    key={item.id}
                    ref={(el) => {
                      humanItemsRef.current[idx] = el;
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`group relative flex items-center justify-between p-4 sm:p-4.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "bg-[#0B254A] border-[#C89A3D] shadow-[0_8px_28px_rgba(200,154,61,0.22)] translate-x-1"
                        : "bg-[#08172E] border-white/[0.12] hover:border-[#C89A3D]/50 shadow-sm"
                    }`}
                  >
                    {/* Left: Gold Checkmark Badge & Title */}
                    <div className="flex items-center space-x-3.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isHovered
                            ? "bg-[#C89A3D] text-[#071A33] shadow-[0_0_10px_#C89A3D]"
                            : "bg-[#C89A3D]/20 border border-[#C89A3D]/70 text-[#C89A3D]"
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>

                      <span
                        className={`font-sans text-base sm:text-lg font-normal tracking-wide transition-colors duration-300 ${
                          isHovered ? "text-[#F4EFE5]" : "text-[#F4EFE5]"
                        }`}
                      >
                        ✓ {item.title}
                      </span>
                    </div>

                    {/* Right: Architectural Realm Tag */}
                    <span
                      className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                        isHovered ? "text-[#C89A3D]" : "text-[#C89A3D]/75"
                      }`}
                    >
                      {item.realm}
                    </span>

                    {/* Bottom Gold Accent Underline on Hover */}
                    <span
                      className={`absolute bottom-0 left-4 right-4 h-[1.5px] bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent transition-opacity duration-300 pointer-events-none ${
                        isHovered ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
