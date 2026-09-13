"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CARD_1_SERVICES = [
  "Virtual CFO",
  "MIS",
  "Compliance",
  "Payroll",
  "Tax",
];

const CARD_2_SERVICES = [
  "Planning",
  "Taxes",
  "Retirement Dashboard",
  "Investments",
  "Insurance",
];

export default function WhoWeWorkWithSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // Cards Container & Offset References
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const centerMarkerRef = useRef<HTMLDivElement>(null);
  const centerMarkerLineRef = useRef<HTMLSpanElement>(null);

  // Card 1 Internal Elements
  const c1TopLineRef = useRef<HTMLDivElement>(null);
  const c1CornersRef = useRef<(SVGPathElement | null)[]>([]);
  const c1RomanRef = useRef<HTMLSpanElement>(null);
  const c1HeadingRef = useRef<HTMLHeadingElement>(null);
  const c1RevenueRef = useRef<HTMLDivElement>(null);
  const c1DescRef = useRef<HTMLParagraphElement>(null);
  const c1ServicesTrackRef = useRef<HTMLDivElement>(null);
  const c1BulletsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const c1TextsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Card 2 Internal Elements
  const c2TopLineRef = useRef<HTMLDivElement>(null);
  const c2CornersRef = useRef<(SVGPathElement | null)[]>([]);
  const c2RomanRef = useRef<HTMLSpanElement>(null);
  const c2HeadingRef = useRef<HTMLHeadingElement>(null);
  const c2RevenueRef = useRef<HTMLDivElement>(null);
  const c2DescRef = useRef<HTMLParagraphElement>(null);
  const c2VerticalLineRef = useRef<HTMLDivElement>(null);
  const c2BulletsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const c2TextsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Interactive state
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // GSAP context and entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set(
          [
            eyebrowRef.current,
            headlineRef.current,
            card1Ref.current,
            card2Ref.current,
            c1RomanRef.current,
            c2RomanRef.current,
          ],
          { opacity: 1, y: 0, x: 0 }
        );
        return;
      }

      // Initial state: Assembly reveal
      gsap.set(eyebrowRef.current, { opacity: 0, y: 15 });
      gsap.set(headlineRef.current, { opacity: 0, y: 25 });
      gsap.set([card1Ref.current, card2Ref.current], { opacity: 0, y: 35 });
      gsap.set([c1TopLineRef.current, c2TopLineRef.current], { scaleX: 0 });
      gsap.set([c1RomanRef.current, c2RomanRef.current], { opacity: 0, y: 15 });
      gsap.set(centerMarkerRef.current, { opacity: 0.3, scale: 0.8 });

      // Entrance timeline
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      entranceTl
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4")
        .to(
          card1Ref.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          card2Ref.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.65"
        )
        .to(
          [c1RomanRef.current, c2RomanRef.current],
          { opacity: 0.05, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          centerMarkerRef.current,
          { opacity: 0.6, scale: 1, duration: 0.6, ease: "power2.out" },
          "-=0.6"
        );

      // Subtle scroll opposing parallax between Left and Right cards
      gsap.to(card1Ref.current, {
        y: -14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(card2Ref.current, {
        y: 14,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // -----------------------------------------------------------------
  // CARD 01 HOVER SYSTEM ("MOMENTUM")
  // -----------------------------------------------------------------
  const handleCard1Enter = () => {
    setActiveCard(1);

    // 1. Center geometric connector activates
    gsap.to(centerMarkerLineRef.current, { scaleX: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(centerMarkerRef.current, { borderColor: "#C89A3D", scale: 1.1, duration: 0.3 });

    // 2. Card 01 Top gold line scaleX: 0 -> 1 from left
    gsap.to(c1TopLineRef.current, { scaleX: 1, duration: 0.5, ease: "power2.out" });

    // 3. Corners expand (8px -> 18px strokeDash)
    c1CornersRef.current.forEach((c) => {
      if (c) gsap.to(c, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" });
    });

    // 4. Roman numeral "I" watermark shifts
    gsap.to(c1RomanRef.current, { x: 8, y: -6, opacity: 0.09, duration: 0.6, ease: "power2.out" });

    // 5. Heading lifts upward by 3px
    gsap.to(c1HeadingRef.current, { y: -3, color: "#F4EFE5", duration: 0.4, ease: "power2.out" });

    // 6. Revenue indicator moves slightly right (x: +4px)
    gsap.to(c1RevenueRef.current, { x: 4, duration: 0.45, ease: "power2.out" });

    // 7. Description reveals with subtle shift
    gsap.to(c1DescRef.current, { x: 2, color: "rgba(244, 239, 229, 0.85)", duration: 0.4 });

    // 8. Service items sequentially activate with expanding gold line
    c1BulletsRef.current.forEach((b, idx) => {
      if (b) {
        gsap.to(b, {
          width: 14,
          backgroundColor: "#C89A3D",
          delay: 0.08 * idx,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    c1TextsRef.current.forEach((t, idx) => {
      if (t) {
        gsap.to(t, {
          x: 5,
          color: "#F4EFE5",
          delay: 0.08 * idx,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    // 9. Tracking vertical line moves through service list
    if (c1ServicesTrackRef.current) {
      gsap.to(c1ServicesTrackRef.current, { scaleY: 1, opacity: 0.8, duration: 0.6, ease: "power2.out" });
    }
  };

  const handleCard1Leave = () => {
    setActiveCard(null);

    // Center marker resets
    gsap.to(centerMarkerLineRef.current, { scaleX: 0, opacity: 0, duration: 0.3 });
    gsap.to(centerMarkerRef.current, { borderColor: "rgba(200, 154, 61, 0.4)", scale: 1, duration: 0.3 });

    // Top gold line returns
    gsap.to(c1TopLineRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });

    // Corners retract
    c1CornersRef.current.forEach((c) => {
      if (c) gsap.to(c, { strokeDashoffset: 14, duration: 0.4 });
    });

    // Roman numeral returns
    gsap.to(c1RomanRef.current, { x: 0, y: 0, opacity: 0.05, duration: 0.5 });

    // Heading & Revenue reset
    gsap.to(c1HeadingRef.current, { y: 0, duration: 0.35 });
    gsap.to(c1RevenueRef.current, { x: 0, duration: 0.35 });
    gsap.to(c1DescRef.current, { x: 0, color: "rgba(244, 239, 229, 0.7)", duration: 0.35 });

    // Service items reset
    c1BulletsRef.current.forEach((b) => {
      if (b) gsap.to(b, { width: 5, backgroundColor: "rgba(200, 154, 61, 0.4)", duration: 0.25 });
    });

    c1TextsRef.current.forEach((t) => {
      if (t) gsap.to(t, { x: 0, color: "rgba(244, 239, 229, 0.8)", duration: 0.25 });
    });

    if (c1ServicesTrackRef.current) {
      gsap.to(c1ServicesTrackRef.current, { scaleY: 0, opacity: 0, duration: 0.35 });
    }
  };

  // -----------------------------------------------------------------
  // CARD 02 HOVER SYSTEM ("PROTECTION + COMPOUNDING")
  // -----------------------------------------------------------------
  const handleCard2Enter = () => {
    setActiveCard(2);

    // Center geometric connector activates
    gsap.to(centerMarkerLineRef.current, { scaleX: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
    gsap.to(centerMarkerRef.current, { borderColor: "#C89A3D", scale: 1.1, duration: 0.3 });

    // 1. Top border draws from right -> left
    gsap.to(c2TopLineRef.current, { scaleX: 1, duration: 0.5, ease: "power2.out" });

    // 2. Corners expand
    c2CornersRef.current.forEach((c) => {
      if (c) gsap.to(c, { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" });
    });

    // 3. Roman numeral "II" watermark shifts
    gsap.to(c2RomanRef.current, { x: -8, y: -6, opacity: 0.09, duration: 0.6, ease: "power2.out" });

    // 4. Heading & Metadata subtly slide inward
    gsap.to(c2HeadingRef.current, { y: -3, color: "#F4EFE5", duration: 0.4, ease: "power2.out" });
    gsap.to(c2RevenueRef.current, { x: -4, duration: 0.45, ease: "power2.out" });
    gsap.to(c2DescRef.current, { x: -2, color: "rgba(244, 239, 229, 0.85)", duration: 0.4 });

    // 5. Thin gold vertical line grows upward beside services
    if (c2VerticalLineRef.current) {
      gsap.to(c2VerticalLineRef.current, { scaleY: 1, opacity: 0.85, duration: 0.5, ease: "power2.out" });
    }

    // 6. Service items reveal in staggered sequence
    c2BulletsRef.current.forEach((b, idx) => {
      if (b) {
        gsap.to(b, {
          width: 14,
          backgroundColor: "#C89A3D",
          delay: 0.08 * idx,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    c2TextsRef.current.forEach((t, idx) => {
      if (t) {
        gsap.to(t, {
          x: 5,
          color: "#F4EFE5",
          delay: 0.08 * idx,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });
  };

  const handleCard2Leave = () => {
    setActiveCard(null);

    // Center marker resets
    gsap.to(centerMarkerLineRef.current, { scaleX: 0, opacity: 0, duration: 0.3 });
    gsap.to(centerMarkerRef.current, { borderColor: "rgba(200, 154, 61, 0.4)", scale: 1, duration: 0.3 });

    // Top gold line returns to right
    gsap.to(c2TopLineRef.current, { scaleX: 0, duration: 0.4, ease: "power2.in" });

    // Corners retract
    c2CornersRef.current.forEach((c) => {
      if (c) gsap.to(c, { strokeDashoffset: 14, duration: 0.4 });
    });

    // Roman numeral returns
    gsap.to(c2RomanRef.current, { x: 0, y: 0, opacity: 0.05, duration: 0.5 });

    // Reset heading & copy
    gsap.to(c2HeadingRef.current, { y: 0, duration: 0.35 });
    gsap.to(c2RevenueRef.current, { x: 0, duration: 0.35 });
    gsap.to(c2DescRef.current, { x: 0, color: "rgba(244, 239, 229, 0.7)", duration: 0.35 });

    // Vertical line resets
    if (c2VerticalLineRef.current) {
      gsap.to(c2VerticalLineRef.current, { scaleY: 0, opacity: 0, duration: 0.35 });
    }

    // Service items reset
    c2BulletsRef.current.forEach((b) => {
      if (b) gsap.to(b, { width: 5, backgroundColor: "rgba(200, 154, 61, 0.4)", duration: 0.25 });
    });

    c2TextsRef.current.forEach((t) => {
      if (t) gsap.to(t, { x: 0, color: "rgba(244, 239, 229, 0.8)", duration: 0.25 });
    });
  };

  // -----------------------------------------------------------------
  // MOUSE PROXIMITY & MAGNETIC COMPOSITION (1-3px Subtle Shift - No 3D Tilt)
  // -----------------------------------------------------------------
  const handleMouseMove1 = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card1Ref.current) return;
    const rect = card1Ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    // Shift internal decorative elements very subtly (1-3px)
    gsap.to(c1RomanRef.current, { x: 8 + relX * 6, y: -6 + relY * 6, duration: 0.3, ease: "power1.out" });
    gsap.to(c1RevenueRef.current, { x: 4 + relX * 3, y: relY * 2, duration: 0.3, ease: "power1.out" });
  };

  const handleMouseMove2 = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!card2Ref.current) return;
    const rect = card2Ref.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(c2RomanRef.current, { x: -8 + relX * 6, y: -6 + relY * 6, duration: 0.3, ease: "power1.out" });
    gsap.to(c2RevenueRef.current, { x: -4 + relX * 3, y: relY * 2, duration: 0.3, ease: "power1.out" });
  };

  return (
    <section
      ref={sectionRef}
      id="who-we-work-with"
      aria-label="Who We Work With: Tailored Advisory Architecture"
      className="relative w-full bg-[#071A33] text-[#F4EFE5] py-24 sm:py-32 md:py-36 px-6 sm:px-10 md:px-16 lg:px-24 transition-colors duration-700 overflow-hidden select-none"
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
        {/* 1. UPPER EDITORIAL SECTION HEADER                          */}
        {/* ========================================================== */}
        <div className="text-center max-w-3xl mb-16 sm:mb-20 md:mb-24">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="flex items-center justify-center space-x-3 mb-4 md:mb-5"
          >
            <span className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block" />
            <span className="text-xs sm:text-[13px] tracking-[0.28em] uppercase font-mono font-semibold text-[#C89A3D]">
              WHO WE WORK WITH
            </span>
            <span className="h-[1.5px] w-9 bg-[#C89A3D] rounded-full inline-block" />
          </div>

          {/* Headline */}
          <h2
            ref={headlineRef}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal leading-[1.18] tracking-tight text-[#F4EFE5] pb-2"
          >
            Distinct journeys.{" "}
            <span className="font-serif italic font-normal text-[#C89A3D] drop-shadow-[0_2px_14px_rgba(200,154,61,0.35)] pb-1 inline-block">
              Uncompromising
            </span>{" "}
            conviction.
          </h2>
        </div>

        {/* ========================================================== */}
        {/* 2. THE TWO EDITORIAL OBJECT CARDS                          */}
        {/* ========================================================== */}
        <div className="relative w-full grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* -------------------------------------------------------- */}
          {/* CARD 01: Growing Businesses (Slightly Higher Offset -12px) */}
          {/* -------------------------------------------------------- */}
          <div
            ref={card1Ref}
            onMouseEnter={handleCard1Enter}
            onMouseLeave={handleCard1Leave}
            onMouseMove={handleMouseMove1}
            className={`group relative bg-[#091F3D]/70 border rounded-2xl p-7 sm:p-9 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-400 ease-out lg:-translate-y-2 cursor-pointer ${
              activeCard === 1
                ? "border-[#C89A3D]/70 shadow-[0_16px_48px_rgba(7,26,51,0.4)]"
                : "border-white/[0.12] hover:border-white/25"
            }`}
          >
            {/* Top Interactive Gold Rule (transform-origin: left) */}
            <div
              ref={c1TopLineRef}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C89A3D] via-[#F4EFE5] to-[#C89A3D] shadow-[0_0_10px_#C89A3D] origin-left pointer-events-none z-20"
            />

            {/* Corner Registration Marks (Architectural Blueprint Details) */}
            {/* Top-Left */}
            <svg className="absolute top-2.5 left-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c1CornersRef.current[0] = el; }}
                d="M 18 0 L 0 0 L 0 18"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Top-Right */}
            <svg className="absolute top-2.5 right-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c1CornersRef.current[1] = el; }}
                d="M 0 0 L 18 0 L 18 18"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Bottom-Left */}
            <svg className="absolute bottom-2.5 left-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c1CornersRef.current[2] = el; }}
                d="M 18 18 L 0 18 L 0 0"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Bottom-Right */}
            <svg className="absolute bottom-2.5 right-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c1CornersRef.current[3] = el; }}
                d="M 0 18 L 18 18 L 18 0"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>

            {/* Oversized Roman Numeral "I" Watermark */}
            <span
              ref={c1RomanRef}
              className="absolute -right-4 -bottom-10 font-serif text-[13rem] font-light text-[#F4EFE5] select-none pointer-events-none z-0 tracking-tighter leading-none"
            >
              I
            </span>

            {/* Card Content (Relative z-10 for pristine layering) */}
            <div className="relative z-10">
              {/* Header Row: Title & Metadata */}
              <div className="mb-5 sm:mb-6">
                <div
                  ref={c1RevenueRef}
                  className="inline-flex items-center space-x-2 font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#C89A3D] font-semibold mb-3 px-2.5 py-1 rounded bg-[#C89A3D]/10 border border-[#C89A3D]/25"
                >
                  <span>₹50L — ₹10CR REVENUE</span>
                </div>

                <h3
                  ref={c1HeadingRef}
                  className="font-serif text-2xl sm:text-3xl md:text-[2rem] font-normal leading-snug tracking-tight text-[#F4EFE5] transition-colors"
                >
                  Growing Businesses
                </h3>
              </div>

              {/* Description Body */}
              <p
                ref={c1DescRef}
                className="font-sans text-sm sm:text-base text-[#F4EFE5]/70 font-light leading-relaxed mb-8 max-w-md"
              >
                For founders scaling past the first plateau, when instinct is no longer enough.
              </p>
            </div>

            {/* Services List Section */}
            <div className="relative z-10 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#C89A3D]/80 font-semibold">
                  SERVICES:
                </span>
              </div>

              {/* Service Items with Dynamic Micro Indicator */}
              <div className="relative flex flex-col space-y-2.5 pl-1">
                {/* Thin Vertical Tracking Guide */}
                <div
                  ref={c1ServicesTrackRef}
                  className="absolute left-0 top-1 bottom-1 w-[1.5px] bg-[#C89A3D] origin-top scale-y-0 opacity-0 pointer-events-none"
                />

                {CARD_1_SERVICES.map((srv, idx) => (
                  <div key={srv} className="flex items-center space-x-3">
                    {/* Transforming Bullet: 4px -> 14px line */}
                    <span
                      ref={(el) => { c1BulletsRef.current[idx] = el; }}
                      className="h-[1.5px] w-[5px] bg-[#C89A3D]/40 rounded-full inline-block transition-colors"
                    />
                    <span
                      ref={(el) => { c1TextsRef.current[idx] = el; }}
                      className="font-sans text-sm sm:text-[15px] font-light text-[#F4EFE5]/80 tracking-wide"
                    >
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------- */}
          {/* CARD 02: Professionals & Families (Offset +12px Lower)   */}
          {/* -------------------------------------------------------- */}
          <div
            ref={card2Ref}
            onMouseEnter={handleCard2Enter}
            onMouseLeave={handleCard2Leave}
            onMouseMove={handleMouseMove2}
            className={`group relative bg-[#08172E] border rounded-2xl p-7 sm:p-9 md:p-10 flex flex-col justify-between overflow-hidden transition-all duration-400 ease-out lg:translate-y-3 cursor-pointer ${
              activeCard === 2
                ? "border-[#C89A3D]/70 shadow-[0_16px_48px_rgba(7,26,51,0.4)]"
                : "border-white/[0.12] hover:border-white/25"
            }`}
          >
            {/* Top Interactive Gold Rule (transform-origin: right) */}
            <div
              ref={c2TopLineRef}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C89A3D] via-[#F4EFE5] to-[#C89A3D] shadow-[0_0_10px_#C89A3D] origin-right pointer-events-none z-20"
            />

            {/* Corner Registration Marks */}
            {/* Top-Left */}
            <svg className="absolute top-2.5 left-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c2CornersRef.current[0] = el; }}
                d="M 18 0 L 0 0 L 0 18"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Top-Right */}
            <svg className="absolute top-2.5 right-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c2CornersRef.current[1] = el; }}
                d="M 0 0 L 18 0 L 18 18"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Bottom-Left */}
            <svg className="absolute bottom-2.5 left-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c2CornersRef.current[2] = el; }}
                d="M 18 18 L 0 18 L 0 0"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>
            {/* Bottom-Right */}
            <svg className="absolute bottom-2.5 right-2.5 w-6 h-6 pointer-events-none z-20 overflow-visible">
              <path
                ref={(el) => { c2CornersRef.current[3] = el; }}
                d="M 0 18 L 18 18 L 18 0"
                fill="none"
                stroke="#C89A3D"
                strokeWidth="1.2"
                strokeDasharray="36"
                strokeDashoffset="14"
              />
            </svg>

            {/* Oversized Roman Numeral "II" Watermark */}
            <span
              ref={c2RomanRef}
              className="absolute -right-4 -bottom-10 font-serif text-[13rem] font-light text-[#F4EFE5] select-none pointer-events-none z-0 tracking-tighter leading-none"
            >
              II
            </span>

            {/* Card Content */}
            <div className="relative z-10">
              {/* Header Row: Title & Metadata */}
              <div className="mb-5 sm:mb-6">
                <div
                  ref={c2RevenueRef}
                  className="inline-flex items-center space-x-2 font-mono text-[11px] sm:text-xs tracking-[0.24em] uppercase text-[#C89A3D] font-semibold mb-3 px-2.5 py-1 rounded bg-[#C89A3D]/10 border border-[#C89A3D]/25"
                >
                  <span>HIGH-EARNING INDIVIDUALS</span>
                </div>

                <h3
                  ref={c2HeadingRef}
                  className="font-serif text-2xl sm:text-3xl md:text-[2rem] font-normal leading-snug tracking-tight text-[#F4EFE5] transition-colors"
                >
                  Professionals & Families
                </h3>
              </div>

              {/* Description Body */}
              <p
                ref={c2DescRef}
                className="font-sans text-sm sm:text-base text-[#F4EFE5]/70 font-light leading-relaxed mb-8 max-w-md"
              >
                For those whose income is strong but whose time is scarce — advice that protects and compounds.
              </p>
            </div>

            {/* Services List Section */}
            <div className="relative z-10 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center space-x-2 mb-4">
                <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-[#C89A3D]/80 font-semibold">
                  SERVICES:
                </span>
              </div>

              {/* Service Items with Growing Side Conduit */}
              <div className="relative flex flex-col space-y-2.5 pl-1">
                {/* Thin Vertical Gold Accent Line growing upward */}
                <div
                  ref={c2VerticalLineRef}
                  className="absolute left-0 top-1 bottom-1 w-[1.5px] bg-[#C89A3D] origin-bottom scale-y-0 opacity-0 pointer-events-none"
                />

                {CARD_2_SERVICES.map((srv, idx) => (
                  <div key={srv} className="flex items-center space-x-3">
                    <span
                      ref={(el) => { c2BulletsRef.current[idx] = el; }}
                      className="h-[1.5px] w-[5px] bg-[#C89A3D]/40 rounded-full inline-block transition-colors"
                    />
                    <span
                      ref={(el) => { c2TextsRef.current[idx] = el; }}
                      className="font-sans text-sm sm:text-[15px] font-light text-[#F4EFE5]/80 tracking-wide"
                    >
                      {srv}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================== */}
        {/* 3. SPECIAL CENTER INTERACTIVE CONNECTOR                    */}
        {/* ========================================================== */}
        <div className="hidden lg:flex items-center justify-center mt-12 space-x-3 pointer-events-none">
          <div
            ref={centerMarkerRef}
            className="w-4 h-4 rotate-45 border border-[#C89A3D]/40 bg-[#071A33] flex items-center justify-center transition-all duration-300"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />
          </div>
          <span
            ref={centerMarkerLineRef}
            className="h-[1px] w-12 bg-gradient-to-r from-[#C89A3D] to-transparent scale-x-0 origin-left transition-all duration-300 opacity-0"
          />
        </div>

      </div>
    </section>
  );
}
