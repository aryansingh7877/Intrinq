"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, BookOpen, Compass, Target, TrendingUp } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  { id: "01", title: "Observe", description: "Audit & diagnose real cash realities.", icon: Eye },
  { id: "02", title: "Understand", description: "Deep unit economics & structural synthesis.", icon: BookOpen },
  { id: "03", title: "Advise", description: "Bespoke capital allocation & strategic roadmap.", icon: Compass },
  { id: "04", title: "Execute", description: "Hands-on discipline, compliance & operations.", icon: Target },
  { id: "05", title: "Compound", description: "Enduring wealth velocity & enterprise freedom.", icon: TrendingUp },
];

export default function DifferenceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const timelineTrackRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const stepNodesRef = useRef<HTMLDivElement[]>([]);

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(
          [
            eyebrowLineRef.current,
            eyebrowTextRef.current,
            headlineRef.current,
            paragraphRef.current,
            progressLineRef.current,
          ],
          { opacity: 1, scaleX: 1, y: 0 }
        );
        setActiveStepIndex(4);
        return;
      }

      // Initial states
      gsap.set(eyebrowLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(eyebrowTextRef.current, { opacity: 0, x: -12 });
      gsap.set(headlineRef.current, { opacity: 0, y: 35, clipPath: "inset(100% 0 0 0)" });
      gsap.set(paragraphRef.current, { opacity: 0, y: 20 });
      gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: "left center" });

      // 1. Entrance animation for header text
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 35%",
          toggleActions: "play none none reverse",
        },
      });

      entranceTl
        .to(eyebrowLineRef.current, {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
        })
        .to(
          eyebrowTextRef.current,
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          headlineRef.current,
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% -25% 0%)",
            duration: 1.1,
            ease: "power3.out",
            clearProps: "clipPath,transform",
          },
          "-=0.4"
        )
        .to(
          paragraphRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.5"
        );

      // 2. Scroll-driven timeline progress with pinning for the journey feel
      const timelineTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            // Determine active step index based on progress
            if (p < 0.2) {
              setActiveStepIndex(0);
            } else if (p < 0.45) {
              setActiveStepIndex(1);
            } else if (p < 0.7) {
              setActiveStepIndex(2);
            } else if (p < 0.9) {
              setActiveStepIndex(3);
            } else {
              setActiveStepIndex(4);
            }
          },
        },
      });

      // Progressively animate the gold connecting line across the 5 nodes
      timelineTl.to(progressLineRef.current, {
        scaleX: 1,
        ease: "none",
        duration: 1,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="approach"
      aria-label="The IntrinsQ Difference and Process"
      className="relative w-full min-h-screen bg-[#071A33] text-[#F4EFE5] py-28 sm:py-36 md:py-40 px-6 sm:px-10 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden transition-colors duration-700 select-none scroll-mt-24"
    >
      <div id="difference" className="absolute top-0 pointer-events-none" />
      {/* Background ultra-subtle architectural grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200, 154, 61, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 154, 61, 0.4) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ambient subtle center glow */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(200, 154, 61, 0.15) 0%, transparent 70%)",
        }}
      />

      <div ref={containerRef} className="relative z-10 max-w-7xl mx-auto w-full">
        {/* ========================================================== */}
        {/* 1. UPPER EDITORIAL CONTENT                                 */}
        {/* ========================================================== */}
        <div className="max-w-3xl mb-20 sm:mb-24 md:mb-28">
          {/* Eyebrow */}
          <div className="flex items-center space-x-3 mb-5 md:mb-6">
            <span
              ref={eyebrowLineRef}
              className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block shadow-[0_0_8px_rgba(200,154,61,0.5)]"
            />
            <span
              ref={eyebrowTextRef}
              className="text-xs sm:text-[13px] tracking-[0.26em] uppercase font-mono font-semibold text-[#C89A3D]"
            >
              THE INTRINSQ DIFFERENCE
            </span>
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-normal leading-[1.16] tracking-[-0.015em] text-[#F4EFE5] mb-6 md:mb-8 pb-3"
          >
            One Advisory{" "}
            <span className="font-serif italic font-normal text-[#C89A3D] drop-shadow-[0_2px_12px_rgba(200,154,61,0.35)] pb-1 inline-block">
              House.
            </span>
          </h2>

          {/* Supporting Copy */}
          <p
            ref={paragraphRef}
            className="text-base sm:text-lg md:text-[19px] text-[#F4EFE5]/75 font-sans font-light leading-relaxed max-w-2xl text-balance"
          >
            Finance. HR. Tax. Compliance. AI. Human judgment. Every discipline
            under one roof, working from the same understanding of your
            business.
          </p>
        </div>

        {/* ========================================================== */}
        {/* 2. FIVE-STEP HORIZONTAL PROCESS TIMELINE                   */}
        {/* ========================================================== */}
        <div className="relative w-full pt-8 pb-12">
          {/* Full-width baseline inactive track line — perfectly centered with circular nodes */}
          <div className="absolute top-[88px] sm:top-[92px] md:top-[96px] left-[10%] right-[10%] h-[1.5px] bg-white/[0.12] pointer-events-none z-0" />

          {/* Active progressive gold connecting line — perfectly centered with circular nodes */}
          <div
            ref={progressLineRef}
            className="absolute top-[88px] sm:top-[92px] md:top-[96px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#C89A3D] via-[#F4EFE5] to-[#C89A3D] shadow-[0_0_12px_#C89A3D] pointer-events-none z-0 will-change-transform"
          />

          {/* Five Step Nodes */}
          <div
            ref={timelineTrackRef}
            className="relative z-10 grid grid-cols-5 gap-2 sm:gap-4 md:gap-8 w-full"
          >
            {STEPS.map((step, idx) => {
              const isActive = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  ref={(el) => {
                    if (el) stepNodesRef.current[idx] = el;
                  }}
                  className="flex flex-col items-center text-center group cursor-pointer"
                  onClick={() => setActiveStepIndex(idx)}
                >
                  {/* Step ID metadata */}
                  <span
                    className={`font-mono text-xs sm:text-[13px] font-medium tracking-widest mb-3 sm:mb-4 transition-colors duration-400 ${
                      isActive ? "text-[#C89A3D]" : "text-[#F4EFE5]/40"
                    }`}
                  >
                    {step.id}
                  </span>

                  {/* Circular Node with Icon wrapped in MagneticButton */}
                  <div className="relative flex items-center justify-center mb-4 sm:mb-5">
                    {/* Subtle pulse ring on the currently active step */}
                    {isCurrent && (
                      <div className="absolute -inset-2 rounded-full border border-[#C89A3D]/40 animate-ping duration-1000 pointer-events-none" />
                    )}

                    <MagneticButton strength={0.35} textStrength={0.5}>
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${
                          isActive
                            ? "bg-[#071A33] border-2 border-[#C89A3D] shadow-[0_0_20px_rgba(200,154,61,0.4)] scale-105"
                            : "bg-[#050F20] border border-white/20 shadow-sm scale-95 hover:border-white/40"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-400 ${
                            isActive
                              ? "text-[#C89A3D] opacity-100 scale-105"
                              : "text-[#F4EFE5]/45 opacity-50 group-hover:opacity-80"
                          } ${idx === 4 && isActive ? "animate-pulse" : ""}`}
                        />
                      </div>
                    </MagneticButton>
                  </div>

                  {/* Step Title */}
                  <h3
                    className={`font-serif text-lg sm:text-xl md:text-2xl lg:text-[26px] font-normal tracking-tight transition-all duration-400 ${
                      isActive
                        ? "text-[#F4EFE5] translate-y-0"
                        : "text-[#F4EFE5]/50 translate-y-1"
                    } ${idx === 4 && isActive ? "italic text-[#C89A3D]" : ""}`}
                  >
                    {step.title}
                  </h3>

                  {/* Micro Description */}
                  <p className="hidden md:block text-[12px] sm:text-[13px] text-[#F4EFE5]/55 font-sans font-light leading-snug mt-2 max-w-[170px] text-balance">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
