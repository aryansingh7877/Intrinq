"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CinematicLoader() {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [percent, setPercent] = useState<number>(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const shutterTopRef = useRef<HTMLDivElement>(null);
  const shutterBottomRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If reduced motion is preferred or already seen in this session, skip intro
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasSeenIntro = sessionStorage.getItem("intrinsq_motion_seen");

    if (prefersReducedMotion || hasSeenIntro) {
      setIsLoaded(true);
      // Still refresh ScrollTrigger so pinned sections calculate correctly
      setTimeout(() => ScrollTrigger.refresh(true), 200);
      return;
    }

    let progressObj = { value: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        sessionStorage.setItem("intrinsq_motion_seen", "true");
        setIsLoaded(true);
        // Recalculate all ScrollTrigger positions now that layout is fully visible
        setTimeout(() => {
          ScrollTrigger.refresh(true);
        }, 100);
      },
    });

    // Animate percentage count from 0 to 100
    tl.to(progressObj, {
      value: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        setPercent(Math.round(progressObj.value));
      },
    });

    // Monogram flash & scale
    tl.fromTo(
      logoRef.current,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" },
      0.2
    );

    // Content fade out before shutter opens
    tl.to(contentRef.current, {
      opacity: 0,
      scale: 0.96,
      duration: 0.35,
      ease: "power2.in",
    });

    // Shutter split reveal (top half moves up, bottom half moves down)
    tl.to(
      shutterTopRef.current,
      {
        yPercent: -100,
        duration: 0.85,
        ease: "power4.inOut",
      },
      "-=0.1"
    );

    tl.to(
      shutterBottomRef.current,
      {
        yPercent: 100,
        duration: 0.85,
        ease: "power4.inOut",
      },
      "<"
    );
  }, []);

  if (isLoaded) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Top Shutter Half */}
      <div
        ref={shutterTopRef}
        className="absolute top-0 left-0 w-full h-1/2 bg-[#05090E] border-b border-[#C89A3D]/20 z-10 will-change-transform"
      />

      {/* Bottom Shutter Half */}
      <div
        ref={shutterBottomRef}
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#05090E] border-t border-[#C89A3D]/20 z-10 will-change-transform"
      />

      {/* Central Telemetry Content */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col items-center justify-center text-center px-6"
      >
        {/* Monogram Brand Crest */}
        <div ref={logoRef} className="flex items-center gap-2 mb-6">
          <div className="w-9 h-9 rounded-full border border-[#C89A3D]/50 flex items-center justify-center bg-[#C89A3D]/10">
            <span className="font-serif text-[#C89A3D] text-lg font-semibold tracking-wider">
              IQ
            </span>
          </div>
          <span className="font-serif text-xl tracking-[0.2em] text-[#F7F4EE] uppercase">
            INTRINSQ
          </span>
        </div>

        {/* Telemetry Status Line */}
        <div className="font-mono text-[10.5px] tracking-[0.26em] uppercase text-[#C89A3D] mb-3">
          LOADING EXPERIENCE · {percent < 10 ? `0${percent}` : percent}%
        </div>

        {/* High-Precision Progress Track */}
        <div className="w-48 sm:w-64 h-[1.5px] bg-[#F7F4EE]/10 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#C89A3D] via-[#FAF4E5] to-[#C89A3D] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Tactical Sub-label */}
        <div className="font-mono text-[9px] tracking-[0.22em] text-[#F7F4EE]/40 uppercase">
          STRATEGIC ADVISORY WORLD
        </div>
      </div>
    </div>
  );
}
