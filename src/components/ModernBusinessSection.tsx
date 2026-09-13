"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import TiltCard from "@/components/motion/TiltCard";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROBLEMS = [
  {
    number: "01",
    tag: "VISIBILITY GAP",
    title: "No Financial Visibility",
    lines: ["Revenue is growing.", "Profit isn't.", "Nobody can tell you why."],
  },
  {
    number: "02",
    tag: "STATUTORY RISK",
    title: "Reactive Compliance",
    lines: ["GST. Payroll. Tax.", "Everything happens at the deadline.", "Nothing is planned."],
  },
  {
    number: "03",
    tag: "SILOED ADVICE",
    title: "Disconnected Advisors",
    lines: ["Accountant. HR. Tax.", "Everyone works separately.", "Nobody owns the full picture."],
  },
];

export default function ModernBusinessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement>(null);
  const headlineLinesRef = useRef<HTMLSpanElement[]>([]);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const panelsRef = useRef<HTMLDivElement[]>([]);

  const [activePanel, setActivePanel] = useState<number | null>(null);

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
            headlineLinesRef.current,
            paragraphRef.current,
            panelsRef.current,
          ],
          { opacity: 1, y: 0, x: 0, scaleX: 1 }
        );
        return;
      }

      // Initial states
      gsap.set(eyebrowLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(eyebrowTextRef.current, { opacity: 0, x: -12 });
      gsap.set(headlineLinesRef.current, { y: "115%", opacity: 0 });
      gsap.set(paragraphRef.current, { opacity: 0, y: 24 });
      gsap.set(panelsRef.current, { opacity: 0, x: 60 });

      // 1. Left Headline Staggered ScrollTrigger
      const leftTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          end: "top 30%",
          toggleActions: "play none none reverse",
        },
      });

      leftTl
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
          headlineLinesRef.current,
          {
            y: "0%",
            opacity: 1,
            duration: 1.0,
            stagger: 0.14,
            ease: "power3.out",
            clearProps: "transform",
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

      // 2. Right Side Problem Panels Sequential Reveal
      panelsRef.current.forEach((panel) => {
        if (!panel) return;
        gsap.to(panel, {
          x: 0,
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="The Modern Business Problem Space"
      className="relative w-full bg-[#F5F1E8] text-[#071A33] py-28 sm:py-36 md:py-44 px-6 sm:px-10 md:px-16 lg:px-24 transition-colors duration-700 scroll-mt-24"
    >
      <div id="modern-business" className="absolute top-0 pointer-events-none" />
      {/* Subtle architectural baseline grid lines (ultra-refined luxury texture) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#071A33 1px, transparent 1px), linear-gradient(90deg, #071A33 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-16">
        {/* ========================================================== */}
        {/* LEFT COLUMN (~44%) — Centered with Point 02                */}
        {/* ========================================================== */}
        <div
          ref={leftColRef}
          className="w-full lg:w-[44%] self-center"
        >
          {/* Eyebrow */}
          <div className="flex items-center space-x-3 mb-6 md:mb-8">
            <span
              ref={eyebrowLineRef}
              className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block"
            />
            <span
              ref={eyebrowTextRef}
              className="text-xs sm:text-[13px] tracking-[0.26em] uppercase font-mono font-semibold text-[#8F6B2C]"
            >
              THE MODERN BUSINESS
            </span>
          </div>

          {/* Large Editorial Heading */}
          <h2 className="font-serif text-[2.2rem] sm:text-4xl md:text-[2.8rem] lg:text-[3.1rem] xl:text-[3.4rem] font-normal leading-[1.18] tracking-[-0.015em] text-[#071A33] mb-7 md:mb-9">
            <span className="block overflow-hidden pb-2 sm:pb-3">
              <span
                ref={(el) => {
                  if (el) headlineLinesRef.current[0] = el;
                }}
                className="block will-change-transform lg:whitespace-nowrap pb-1"
              >
                Running a business
              </span>
            </span>
            <span className="block overflow-hidden pb-2 sm:pb-3">
              <span
                ref={(el) => {
                  if (el) headlineLinesRef.current[1] = el;
                }}
                className="block will-change-transform lg:whitespace-nowrap pb-1"
              >
                shouldn&apos;t mean
              </span>
            </span>
            <span className="block overflow-hidden pb-5 -mb-3">
              <span
                ref={(el) => {
                  if (el) headlineLinesRef.current[2] = el;
                }}
                className="inline-block will-change-transform lg:whitespace-nowrap pb-2"
              >
                <span className="font-serif italic font-normal text-[#C89A3D] drop-shadow-[0_1px_8px_rgba(200,154,61,0.25)] pr-2 inline-block pb-1">
                  guessing
                </span>
                your numbers.
              </span>
            </span>
          </h2>

          {/* Supporting Paragraph */}
          <p
            ref={paragraphRef}
            className="text-base sm:text-lg md:text-[18px] text-[#071A33]/75 font-sans font-light leading-relaxed max-w-md text-balance"
          >
            Most growing companies operate on lagging information and fragmented
            advice. By the time the picture is clear, the decision has already
            been made — often the wrong one.
          </p>
        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN (~54%) — Three Large Editorial Problem Panels  */}
        {/* ========================================================== */}
        <div className="w-full lg:w-[52%] flex flex-col space-y-6 sm:space-y-8">
          {PROBLEMS.map((problem, idx) => {
            const isHovered = activePanel === idx;
            return (
              <TiltCard
                key={problem.number}
                maxTilt={5}
                glare={true}
                className="rounded-2xl sm:rounded-3xl"
              >
                <div
                  ref={(el) => {
                    if (el) panelsRef.current[idx] = el;
                  }}
                  onMouseEnter={() => setActivePanel(idx)}
                  onMouseLeave={() => setActivePanel(null)}
                  className={`group relative bg-[#FDFBF7] rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border transition-all duration-400 ease-out ${
                    isHovered
                      ? "border-[#C89A3D]/60 shadow-[0_16px_40px_rgba(7,26,51,0.06)] -translate-y-1"
                      : "border-[#071A33]/10 shadow-[0_4px_20px_rgba(7,26,51,0.02)]"
                  }`}
                >
                  {/* Left Gold Vertical Accent Line */}
                  <div
                    className={`absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full transition-all duration-300 ${
                      isHovered
                        ? "bg-[#C89A3D] opacity-100 scale-y-100 shadow-[0_0_10px_#C89A3D]"
                        : "bg-[#C89A3D]/40 opacity-70 scale-y-75"
                    }`}
                  />

                  {/* Top Row: Number & Tag */}
                  <div className="flex items-center justify-between mb-5 sm:mb-6 pl-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-[#C89A3D]">
                        {problem.number}
                      </span>
                      <span className="w-4 h-[1px] bg-[#C89A3D]/40" />
                      <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-[#071A33]/50">
                        {problem.tag}
                      </span>
                    </div>

                    {/* Micro Corner Arrow Indicator */}
                    <div
                      data-magnetic="true"
                      className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        isHovered
                          ? "border-[#C89A3D] bg-[#C89A3D]/10 text-[#C89A3D]"
                          : "border-[#071A33]/10 text-[#071A33]/30"
                      }`}
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Problem Title */}
                  <h3
                    className={`font-serif text-2xl sm:text-3xl md:text-[2rem] font-normal leading-snug tracking-tight mb-4 pl-2 transition-colors duration-300 ${
                      isHovered ? "text-[#071A33]" : "text-[#071A33]/90"
                    }`}
                  >
                    {problem.title}
                  </h3>

                  {/* Problem Body Bullet Lines */}
                  <div className="flex flex-col space-y-1 pl-2 text-sm sm:text-base md:text-[17px] text-[#071A33]/70 font-sans font-light leading-relaxed">
                    {problem.lines.map((line, lIdx) => (
                      <p key={lIdx} className="tracking-wide">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
