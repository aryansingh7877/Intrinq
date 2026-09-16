"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MarqueeItem {
  id: string;
  tag: string;
  title: string;
  metric: string;
  highlight?: boolean;
}

const MODULES: MarqueeItem[] = [
  { id: "01", tag: "VENTURE / SCALE", title: "FOUNDERS", metric: "ALPHA 98.4%", highlight: false },
  { id: "02", tag: "ENTERPRISE / GOVERNANCE", title: "BUSINESS OWNERS", metric: "CAPITAL DISCIPLINE", highlight: true },
  { id: "03", tag: "CAPITAL / ALLOCATION", title: "PROFESSIONALS", metric: "COMPOUNDING EFFICIENCY", highlight: false },
  { id: "04", tag: "STRATEGY / EXPANSION", title: "GROWING COMPANIES", metric: "SYSTEMIC AGILITY", highlight: false },
  { id: "05", tag: "PRESERVATION / LEGACY", title: "FAMILY OFFICES", metric: "MULTI-GENERATION", highlight: true },
  { id: "06", tag: "VELOCITY / INCEPTION", title: "STARTUPS", metric: "EQUITY ARCHITECTURE", highlight: false },
];

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hudTrackRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const cursorFollowerRef = useRef<HTMLDivElement>(null);

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!sectionRef.current || !trackRef.current) return;

    // 1. Seamless Infinite Marquee Loop using GSAP Ticker
    let currentX = 0;
    let baseSpeed = prefersReducedMotion ? 0 : 0.85; // controlled, slow, luxurious
    let targetVelocity = 0;
    let currentVelocity = 0;
    let singleSetWidth = 0;
    let hudSetWidth = 0;

    // Measure sets of items
    const calculateWidth = () => {
      if (trackRef.current) {
        // Track contains 3 repeated sets of 6 items (18 total). Width of 1 set is total / 3
        singleSetWidth = trackRef.current.scrollWidth / 3;
      }
      if (hudTrackRef.current) {
        hudSetWidth = hudTrackRef.current.scrollWidth / 3;
      }
    };

    calculateWidth();
    window.addEventListener("resize", calculateWidth);

    // ScrollTrigger to detect page scroll velocity
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        // Clamp velocity so it doesn't get crazy
        const vel = Math.abs(self.getVelocity() / 250);
        targetVelocity = Math.min(vel, 3.5);
      },
    });

    // Secondary reverse HUD sub-stream
    let hudX = 0;
    const hudSpeed = 0.45;

    // Ticker Loop for perfectly smooth 60fps movement
    const updateMarquee = () => {
      // Lerp velocity back to 0 smoothly
      currentVelocity += (targetVelocity - currentVelocity) * 0.08;
      targetVelocity *= 0.94;

      const effectiveSpeed = baseSpeed + currentVelocity;

      currentX -= effectiveSpeed;
      if (singleSetWidth > 0 && currentX <= -singleSetWidth) {
        currentX += singleSetWidth;
      }

      if (trackRef.current) {
        gsap.set(trackRef.current, {
          x: currentX,
          skewX: -Math.min(currentVelocity * 1.8, 3.5),
        });
      }

      // Reverse secondary HUD ticker
      if (hudTrackRef.current) {
        hudX += (hudSpeed + currentVelocity * 0.3);
        if (hudSetWidth > 0 && hudX >= 0) {
          hudX -= hudSetWidth;
        }
        gsap.set(hudTrackRef.current, {
          x: hudX,
          skewX: Math.min(currentVelocity * 1.2, 2.5),
        });
      }
    };

    gsap.ticker.add(updateMarquee);

    // 2. Scanning Laser Beam Animation
    let scannerTween: gsap.core.Tween | null = null;
    if (scannerRef.current && !prefersReducedMotion) {
      scannerTween = gsap.to(scannerRef.current, {
        x: "100vw",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }

    // 3. Subtle 2.5D Cursor Parallax
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        const normX = (e.clientX / window.innerWidth - 0.5) * 2;
        const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

        if (cursorFollowerRef.current) {
          gsap.to(cursorFollowerRef.current, {
            x: e.clientX,
            opacity: 0.8,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      } else {
        if (cursorFollowerRef.current) {
          gsap.to(cursorFollowerRef.current, {
            opacity: 0,
            duration: 0.4,
          });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      gsap.ticker.remove(updateMarquee);
      window.removeEventListener("resize", calculateWidth);
      window.removeEventListener("mousemove", handleMouseMove);
      if (scannerTween) scannerTween.kill();
      st.kill();
    };
  }, []);

  // Triple set ensures zero gap across any screen width up to ultra-wide 4K
  const repeatedItems = [...MODULES, ...MODULES, ...MODULES];

  const hudLabels = [
    "STRATEGIC ASSET ALLOCATION",
    "DISCIPLINE BEFORE GROWTH",
    "COMPOUNDING HORIZON · MULTI-DECADE ARCHITECTURE",
    "PORTFOLIO GOVERNANCE · TAX OPTIMIZATION LAYER",
    "EQUITY ALIGNMENT · INSTITUTIONAL RIGOR",
    "FIDUCIARY INTEGRITY · COMPOUNDING CAPITAL",
  ];
  const repeatedHud = [...hudLabels, ...hudLabels, ...hudLabels];

  return (
    <section
      ref={sectionRef}
      aria-label="Client profiles and advisory modules"
      className="relative w-full overflow-hidden bg-[#050B14] py-8 sm:py-10 md:py-12 select-none border-y border-[#C89A3D]/20"
    >
      {/* ========================================================== */}
      {/* 1. ATMOSPHERIC SCANNING LASER & AMBIENT GLOW               */}
      {/* ========================================================== */}
      {/* Ambient background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(7, 26, 51, 0.6) 0%, rgba(5, 11, 20, 0.95) 75%)",
        }}
      />

      {/* Traveling Champagne-Gold Scanning Laser Beam */}
      <div
        ref={scannerRef}
        className="absolute top-0 left-0 h-full w-[1.5px] pointer-events-none z-20 will-change-transform opacity-75"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #F4EFE5 15%, #C89A3D 50%, #8F6B2C 85%, transparent 100%)",
          boxShadow: "0 0 20px 2px rgba(200, 154, 61, 0.5), 0 0 40px rgba(200, 154, 61, 0.25)",
        }}
      />

      {/* Cursor tracking ambient glow (Desktop) */}
      <div
        ref={cursorFollowerRef}
        className="hidden md:block absolute top-0 left-0 w-48 h-full pointer-events-none -translate-x-1/2 z-10 opacity-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(200, 154, 61, 0.12) 0%, transparent 70%)",
        }}
      />

      {/* Center Focus Vignette Mask: edges softly fade, center is razor sharp */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background:
            "linear-gradient(90deg, #050B14 0%, transparent 12%, transparent 88%, #050B14 100%)",
        }}
      />

      {/* Top & Bottom Thin Animated Gold Rules */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C89A3D]/45 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C89A3D]/30 to-transparent pointer-events-none" />

      {/* ========================================================== */}
      {/* 2. PRIMARY SEAMLESS INFINITE MARQUEE TRACK                 */}
      {/* ========================================================== */}
      <div className="relative w-full overflow-hidden py-3 sm:py-4">
        <div
          ref={trackRef}
          className="flex items-center will-change-transform select-none cursor-default"
          style={{ width: "max-content" }}
        >
          {repeatedItems.map((item, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={`${item.id}-${idx}`}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="group relative flex items-center shrink-0 px-6 sm:px-10 md:px-14 lg:px-16 transition-all duration-300"
              >
                {/* Module Container */}
                <div
                  className={`flex flex-col items-start transition-transform duration-300 ease-out ${
                    isHovered ? "scale-[1.04] -translate-y-1" : "scale-100 translate-y-0"
                  }`}
                >
                  {/* Micro HUD Tag above title */}
                  <div className="flex items-center space-x-2 mb-1.5">
                    <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-[#C89A3D] tracking-wider">
                      [{item.id}]
                    </span>
                    <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.25em] uppercase text-[#F4EFE5]/50 group-hover:text-[#C89A3D]/90 transition-colors duration-200">
                      {item.tag}
                    </span>
                  </div>

                  {/* Large Editorial Serif Marquee Title */}
                  <h2
                    className={`font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-normal tracking-[-0.01em] leading-none transition-all duration-300 ${
                      isHovered
                        ? "text-[#C89A3D] drop-shadow-[0_2px_20px_rgba(200,154,61,0.5)]"
                        : "text-[#F4EFE5] group-hover:text-[#C89A3D]"
                    } ${item.highlight ? "italic font-normal" : ""}`}
                  >
                    {item.title}
                  </h2>

                  {/* Micro metric label below */}
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="w-2 h-[1px] bg-[#C89A3D]/40 group-hover:w-4 group-hover:bg-[#C89A3D] transition-all duration-300" />
                    <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] text-[#8F6B2C] group-hover:text-[#F4EFE5]/80 transition-colors duration-200">
                      {item.metric}
                    </span>
                  </div>

                  {/* Hover Underline Glow */}
                  <div
                    className={`h-[1.5px] bg-gradient-to-r from-transparent via-[#C89A3D] to-transparent rounded-full mt-1.5 transition-all duration-300 origin-center ${
                      isHovered ? "w-full opacity-100 shadow-[0_0_12px_#C89A3D]" : "w-0 opacity-0"
                    }`}
                  />
                </div>

                {/* HUD Futuristic Delimiter */}
                <div className="ml-6 sm:ml-10 md:ml-14 lg:ml-16 flex items-center space-x-2 opacity-35 group-hover:opacity-75 transition-opacity">
                  <span className="text-[#C89A3D] font-mono text-xs">✦</span>
                  <span className="h-6 w-[1px] bg-[#C89A3D]/30" />
                  <span className="text-[#C89A3D] font-mono text-xs">✦</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================== */}
      {/* 4. SECONDARY REVERSE HUD MICRO-DATA STREAM                */}
      {/* ========================================================== */}
      <div className="relative w-full overflow-hidden mt-3 sm:mt-4 pt-2 border-t border-white/[0.04]">
        <div
          ref={hudTrackRef}
          className="flex items-center will-change-transform opacity-40 hover:opacity-70 transition-opacity select-none"
          style={{ width: "max-content" }}
        >
          {repeatedHud.map((label, i) => (
            <div
              key={i}
              className="flex items-center shrink-0 space-x-6 sm:space-x-10 px-4 sm:px-6 text-[9px] sm:text-[10px] font-mono tracking-[0.26em] text-[#8F6B2C] uppercase"
            >
              <span>{label}</span>
              <span className="text-[#C89A3D]/40">·</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
