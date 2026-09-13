"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DecisionCtaSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Content targets
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement | null>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);

  // CTA Button & magnetic wrapper refs
  const buttonWrapperRef = useRef<HTMLDivElement | null>(null);
  const magneticButtonRef = useRef<HTMLAnchorElement | null>(null);
  const buttonFillRef = useRef<HTMLSpanElement | null>(null);
  const buttonArrowRef = useRef<HTMLSpanElement | null>(null);
  const energyTrailRef = useRef<HTMLSpanElement | null>(null);

  // Interactive horizontal decision gold line
  const goldLineContainerRef = useRef<HTMLDivElement | null>(null);
  const goldLineRef = useRef<HTMLDivElement | null>(null);
  const bottomConnectorLineRef = useRef<HTMLDivElement | null>(null);

  // Micro-text & secondary info
  const secondaryContactRef = useRef<HTMLDivElement | null>(null);
  const microTextRef = useRef<HTMLDivElement | null>(null);

  // Email copy state
  const [copiedState, setCopiedState] = useState<"idle" | "hovered" | "copied">("idle");

  const handleCopyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@intrinsq.com");
      setCopiedState("copied");
      setTimeout(() => {
        setCopiedState("hovered");
      }, 1500);
    } else {
      window.location.href = "mailto:hello@intrinsq.com";
    }
  }, []);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (headlineLine1Ref.current) gsap.set(headlineLine1Ref.current, { clipPath: "inset(0 0% -25% 0)", opacity: 1 });
        if (headlineLine2Ref.current) gsap.set(headlineLine2Ref.current, { clipPath: "inset(0 0 -30% 0%)", opacity: 1 });
        if (paragraphRef.current) gsap.set(paragraphRef.current, { opacity: 1, y: 0 });
        if (goldLineRef.current) gsap.set(goldLineRef.current, { scaleX: 1 });
        if (buttonWrapperRef.current) gsap.set(buttonWrapperRef.current, { opacity: 1, y: 0 });
        if (secondaryContactRef.current) gsap.set(secondaryContactRef.current, { opacity: 1 });
        if (microTextRef.current) gsap.set(microTextRef.current, { opacity: 1 });
        return;
      }

      // ── Initial State for Cinematic Reveal ──────────────────────
      gsap.set(eyebrowRef.current, { opacity: 0, y: 12 });
      // Line 1 reveals left → right
      gsap.set(headlineLine1Ref.current, {
        clipPath: "inset(0 100% 0 0)",
        opacity: 1,
      });
      // Line 2 reveals right → left
      gsap.set(headlineLine2Ref.current, {
        clipPath: "inset(0 0 0 100%)",
        opacity: 1,
      });
      gsap.set(paragraphRef.current, { opacity: 0, y: 18 });
      gsap.set(buttonWrapperRef.current, { opacity: 0, y: 22 });
      gsap.set(secondaryContactRef.current, { opacity: 0, y: 10 });
      gsap.set(microTextRef.current, { opacity: 0 });

      // Initial state of gold line: starts at ~18% width
      gsap.set(goldLineRef.current, {
        scaleX: 0.18,
        transformOrigin: "center center",
      });
      gsap.set(bottomConnectorLineRef.current, {
        scaleY: 0,
        transformOrigin: "top center",
      });

      // ── ScrollTrigger Timeline (Reversible Bidirectional Flow) ────
      const ctaTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 72%",
          end: "bottom 85%",
          scrub: 1.0,
        },
      });

      // 0% -> 20%: Eyebrow & Line 1 reveals left → right
      ctaTimeline.to(
        eyebrowRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        0
      );

      ctaTimeline.to(
        headlineLine1Ref.current,
        {
          clipPath: "inset(0 0% -25% 0)",
          duration: 0.25,
          ease: "power2.out",
        },
        0.05
      );

      // 20% -> 35%: Line 2 "better numbers." reveals right → left
      ctaTimeline.to(
        headlineLine2Ref.current,
        {
          clipPath: "inset(0 0 -30% 0%)",
          duration: 0.25,
          ease: "power2.out",
        },
        0.2
      );

      // 35% -> 50%: Paragraph appears
      ctaTimeline.to(
        paragraphRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0.35
      );

      // 50% -> 65%: CTA Button becomes active
      ctaTimeline.to(
        buttonWrapperRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.2,
          ease: "power2.out",
        },
        0.5
      );

      ctaTimeline.to(
        secondaryContactRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          ease: "power2.out",
        },
        0.58
      );

      // 65% -> 85%: Horizontal Gold Decision Line expands from 18% -> 100%
      ctaTimeline.to(
        goldLineRef.current,
        {
          scaleX: 1,
          duration: 0.35,
          ease: "power1.inOut",
        },
        0.6
      );

      ctaTimeline.to(
        microTextRef.current,
        {
          opacity: 1,
          duration: 0.15,
          ease: "power2.out",
        },
        0.75
      );

      // 85% -> 100%: Connector line stretches toward bottom footer transition
      ctaTimeline.to(
        bottomConnectorLineRef.current,
        {
          scaleY: 1,
          duration: 0.2,
          ease: "power2.out",
        },
        0.8
      );

      // ── Desktop Magnetic Interactions & Line Proximity ───────────
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const btnWrapper = buttonWrapperRef.current;
        const btn = magneticButtonRef.current;
        const gLine = goldLineRef.current;
        if (!btnWrapper || !btn) return;

        // Button magnetic pull (8–14px max)
        const xToBtn = gsap.quickTo(btn, "x", { duration: 0.3, ease: "power3.out" });
        const yToBtn = gsap.quickTo(btn, "y", { duration: 0.3, ease: "power3.out" });

        // Line subtle 1–2px vertical shift toward cursor
        const yToLine = gLine
          ? gsap.quickTo(gLine, "y", { duration: 0.35, ease: "power2.out" })
          : null;

        const handleMouseMove = (e: MouseEvent) => {
          const rect = btn.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dx = e.clientX - centerX;
          const dy = e.clientY - centerY;
          const dist = Math.hypot(dx, dy);
          const magneticRadius = 150;

          if (dist < magneticRadius) {
            const factor = (1 - dist / magneticRadius);
            const moveX = (dx / dist) * factor * 12; // 8-12px
            const moveY = (dy / dist) * factor * 10;
            xToBtn(moveX);
            yToBtn(moveY);

            // Subtle line reaction
            if (yToLine) {
              const lineShift = (dy > 0 ? 1 : -1) * 1.5 * factor;
              yToLine(lineShift);
            }
          } else {
            xToBtn(0);
            yToBtn(0);
            if (yToLine) yToLine(0);
          }
        };

        const handleMouseLeave = () => {
          xToBtn(0);
          yToBtn(0);
          if (yToLine) yToLine(0);
        };

        const currentSection = sectionRef.current;
        if (currentSection) {
          currentSection.addEventListener("mousemove", handleMouseMove);
          currentSection.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
          if (currentSection) {
            currentSection.removeEventListener("mousemove", handleMouseMove);
            currentSection.removeEventListener("mouseleave", handleMouseLeave);
          }
        };
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Button Hover Interactions (Fill Sweep + Energy Trail) ────────
  const handleButtonMouseEnter = () => {
    // 1. Fill sweep left → right
    if (buttonFillRef.current) {
      gsap.fromTo(
        buttonFillRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        { scaleX: 1, duration: 0.45, ease: "power2.out" }
      );
    }
    // 2. Arrow moves 8px right
    if (buttonArrowRef.current) {
      gsap.to(buttonArrowRef.current, {
        x: 8,
        duration: 0.3,
        ease: "power2.out",
      });
    }
    // 3. Energy trail dot travels once from left edge toward arrow
    if (energyTrailRef.current) {
      gsap.fromTo(
        energyTrailRef.current,
        { x: -20, opacity: 0 },
        {
          x: 210,
          opacity: 1,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(energyTrailRef.current, { opacity: 0, duration: 0.2 });
          },
        }
      );
    }
  };

  const handleButtonMouseLeave = () => {
    if (buttonFillRef.current) {
      gsap.to(buttonFillRef.current, {
        scaleX: 0,
        transformOrigin: "right center",
        duration: 0.4,
        ease: "power2.out",
      });
    }
    if (buttonArrowRef.current) {
      gsap.to(buttonArrowRef.current, {
        x: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full bg-[#F5F1E8] text-[#071A33] min-h-[75vh] lg:min-h-[85vh] flex flex-col justify-between items-center overflow-hidden select-none pt-16 sm:pt-20 lg:pt-24 pb-0 scroll-mt-24"
      aria-label="Begin the Conversation — Strategic Financial Consultation"
    >
      <div id="consultation" className="absolute top-0 pointer-events-none" />
      {/* ── Extremely Subtle Fine Paper Texture Overlay ─────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(#071A33 0.75px, transparent 0.75px)`,
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />

      {/* ── Main Content Block (Centered Composition) ───────────── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-8 flex flex-col items-center text-center my-auto">
        {/* Top Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex items-center justify-center gap-2.5 font-mono text-xs tracking-[0.28em] uppercase text-[#C89A3D] font-semibold"
        >
          <span className="w-4 h-[1px] bg-[#C89A3D]" />
          <span>BEGIN THE CONVERSATION</span>
        </div>

        {/* Cinematic Large Editorial Headline */}
        <h2 className="mt-8 sm:mt-10 w-full max-w-3xl font-serif text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5rem] font-light leading-[1.16] tracking-tight text-[#071A33] pb-3">
          <span
            ref={headlineLine1Ref}
            className="block text-[#071A33] pb-1.5"
          >
            Every business needs
          </span>
          <span
            ref={headlineLine2Ref}
            className="block font-serif italic font-normal text-[#C89A3D] mt-1 sm:mt-2 pb-2"
          >
            better numbers.
          </span>
        </h2>

        {/* Editorial Paragraph */}
        <p
          ref={paragraphRef}
          className="mt-6 sm:mt-8 max-w-[520px] font-sans text-base sm:text-[18px] lg:text-[19px] text-[#071A33]/75 leading-relaxed font-normal"
        >
          Let’s start a conversation about your goals — and how
          disciplined advice can help you reach them.
        </p>

        {/* ── CTA Button: Outlined Transformation & Magnetic Physics ── */}
        <div
          ref={buttonWrapperRef}
          className="mt-10 sm:mt-12 flex flex-col items-center"
        >
          <div className="relative inline-block">
            <a
              ref={magneticButtonRef}
              href="https://cal.com/intrinsq"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
              aria-label="Book a Consultation with IntrinsQ Financial Advisors"
              className="relative inline-flex items-center justify-center px-9 sm:px-11 py-4 sm:py-4.5 rounded-[2px] bg-[#F5F1E8] border border-[#071A33]/80 hover:border-[#C89A3D] text-[#071A33] font-sans font-medium text-sm sm:text-base tracking-wide transition-colors duration-300 shadow-[0_4px_16px_rgba(7,26,51,0.06)] overflow-hidden group focus:outline-none focus:ring-1 focus:ring-[#C89A3D]"
            >
              {/* Champagne-Gold Fill sweep from LEFT → RIGHT */}
              <span
                ref={buttonFillRef}
                className="absolute inset-0 bg-[#C89A3D]/15 pointer-events-none scale-x-0 origin-left"
                aria-hidden="true"
              />

              {/* Energy Trail Dot traveling across the button on hover */}
              <span
                ref={energyTrailRef}
                className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 rounded-full bg-[#C89A3D] pointer-events-none opacity-0 shadow-[0_0_8px_rgba(200,154,61,0.8)]"
                aria-hidden="true"
              />

              {/* Button Text & Arrow */}
              <span className="relative z-10 flex items-center gap-3">
                <span className="group-hover:text-[#071A33] transition-colors">
                  Book a Consultation
                </span>
                <span
                  ref={buttonArrowRef}
                  className="inline-block text-[#C89A3D] font-serif text-lg leading-none"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </a>
          </div>
        </div>

        {/* ── Secondary Information: Email with Interactive COPY ────── */}
        <div
          ref={secondaryContactRef}
          className="mt-6 sm:mt-7 flex items-center justify-center"
        >
          <div
            className="relative flex items-center gap-2 cursor-pointer group"
            onMouseEnter={() => copiedState !== "copied" && setCopiedState("hovered")}
            onMouseLeave={() => copiedState !== "copied" && setCopiedState("idle")}
            onClick={handleCopyEmail}
          >
            <a
              href="mailto:hello@intrinsq.com"
              className="font-mono text-xs sm:text-[13px] tracking-wider text-[#071A33]/70 hover:text-[#071A33] transition-colors py-0.5"
              title="Click to copy email address"
            >
              hello@intrinsq.com
            </a>

            {/* Micro COPY / COPIED badge */}
            <span
              className={`font-mono text-[10px] tracking-wider uppercase px-1.5 py-0.5 rounded-[2px] transition-all duration-200 ${
                copiedState === "copied"
                  ? "bg-[#C89A3D] text-[#071A33] font-semibold opacity-100 scale-100"
                  : copiedState === "hovered"
                  ? "bg-[#071A33]/10 text-[#071A33]/80 opacity-100 scale-100"
                  : "opacity-0 scale-95 pointer-events-none"
              }`}
            >
              {copiedState === "copied" ? "COPIED ✓" : "COPY"}
            </span>
          </div>
        </div>
      </div>

      {/* ── THE CRAZY INTERACTION: Expanding Horizontal Gold Decision Line ── */}
      <div
        ref={goldLineContainerRef}
        className="relative w-full flex flex-col items-center mt-12 sm:mt-16"
      >
        <div className="w-full max-w-5xl px-6 sm:px-12 flex justify-center">
          <div
            ref={goldLineRef}
            className="w-full h-[1px] bg-[#C89A3D]/55"
            style={{ transformOrigin: "center center" }}
          />
        </div>

        {/* Micro-Text Signature before Footer */}
        <div
          ref={microTextRef}
          className="pt-6 pb-6 text-center font-mono text-[10.5px] sm:text-xs tracking-[0.32em] uppercase text-[#C89A3D] font-medium"
        >
          DISCIPLINE TODAY. FREEDOM TOMORROW.
        </div>

        {/* Vertical Connector Line Stretching Toward Footer (Zero Blank Gap) */}
        <div
          ref={bottomConnectorLineRef}
          className="w-[1px] h-8 bg-gradient-to-b from-[#C89A3D]/50 to-[#071A33]"
        />
      </div>
    </section>
  );
}
