"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV_GROUPS = [
  {
    num: "01",
    title: "COMPANY",
    links: [
      { label: "About Us", href: "#modern-business" },
      { label: "Our Approach", href: "#difference" },
      { label: "Our Blog", href: "#blog" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    num: "02",
    title: "SERVICES",
    links: [
      { label: "Virtual CFO", href: "#services" },
      { label: "Financial Strategy", href: "#services" },
      { label: "Tax & Compliance", href: "#services" },
      { label: "HR & Payroll", href: "#services" },
      { label: "MIS & Reporting", href: "#services" },
    ],
  },
  {
    num: "03",
    title: "LEGAL",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
  {
    num: "04",
    title: "CONTACT",
    isContact: true,
  },
];

const WORD_LETTERS = ["I", "N", "T", "R", "I", "N", "S", "Q"];

export default function TypographicFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const navSectionRef = useRef<HTMLDivElement | null>(null);

  // Word & Gold Material Reveal refs
  const wordContainerRef = useRef<HTMLDivElement | null>(null);
  const goldLayerRef = useRef<HTMLDivElement | null>(null);
  const qLetterRef = useRef<HTMLSpanElement | null>(null);
  const letterSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Line & dot refs
  const signatureLineRef = useRef<HTMLDivElement | null>(null);
  const signatureTrackRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  // Interaction states
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ x: -200, y: -200 });

  // Handle email copy
  const handleCopyEmail = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("hello@intrinsq.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } else {
      window.location.href = "mailto:hello@intrinsq.com";
    }
  }, []);

  // Mobile tap reveal
  const handleMobileTap = () => {
    setIsHovered(true);
    // Center reveal temporarily on mobile tap
    if (wordContainerRef.current) {
      const rect = wordContainerRef.current.getBoundingClientRect();
      setMaskPos({ x: rect.width / 2, y: rect.height / 2 });
    }
    setTimeout(() => {
      setIsHovered(false);
    }, 1800);
  };

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        if (wordContainerRef.current) gsap.set(wordContainerRef.current, { opacity: 1, y: 0 });
        if (signatureLineRef.current) gsap.set(signatureLineRef.current, { scaleX: 1 });
        if (dotRef.current) gsap.set(dotRef.current, { opacity: 1 });
        return;
      }

      // ── 1. Initial State ──────────────────────────────────────────
      gsap.set(navSectionRef.current, { opacity: 0, y: 12 });
      gsap.set(wordContainerRef.current, { opacity: 0, y: 40 });
      gsap.set(signatureLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(dotRef.current, { opacity: 0, x: 0 });

      // ── 2. Scroll Entry Timeline ──────────────────────────────────
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 82%",
        },
      });

      // Navigation reveals
      tl.to(navSectionRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
      });

      // INTRINSQ slides upward into stable position
      tl.to(
        wordContainerRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        },
        "-=0.35"
      );

      // Signature line draws left → right
      tl.to(
        signatureLineRef.current,
        {
          scaleX: 1,
          duration: 0.85,
          ease: "power2.inOut",
        },
        "-=0.2"
      );

      // Gold dot travels along the line and locks right under Q
      tl.call(() => {
        if (signatureTrackRef.current && qLetterRef.current && dotRef.current) {
          const trackRect = signatureTrackRef.current.getBoundingClientRect();
          const qRect = qLetterRef.current.getBoundingClientRect();
          const targetX = qRect.left - trackRect.left + qRect.width / 2 - 3.5;

          gsap.fromTo(
            dotRef.current,
            { opacity: 0, x: 0 },
            {
              opacity: 1,
              x: Math.max(0, targetX),
              duration: 0.75,
              ease: "power2.out",
            }
          );
        }
      });

      // ── 3. Desktop Cursor-Follow for Gold Material Reveal ──────────
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const wordEl = wordContainerRef.current;
        if (!wordEl) return;

        // Smooth cursor interpolation (0.18s lag for luxury tactile feel)
        const pos = { x: -200, y: -200 };
        const xTo = gsap.quickTo(pos, "x", {
          duration: 0.22,
          ease: "power2.out",
          onUpdate: () => setMaskPos({ x: pos.x, y: pos.y }),
        });
        const yTo = gsap.quickTo(pos, "y", {
          duration: 0.22,
          ease: "power2.out",
          onUpdate: () => setMaskPos({ x: pos.x, y: pos.y }),
        });

        const handleMouseMove = (e: MouseEvent) => {
          const rect = wordEl.getBoundingClientRect();
          const relX = e.clientX - rect.left;
          const relY = e.clientY - rect.top;
          xTo(relX);
          yTo(relY);
        };

        const handleMouseEnter = (e: MouseEvent) => {
          const rect = wordEl.getBoundingClientRect();
          pos.x = e.clientX - rect.left;
          pos.y = e.clientY - rect.top;
          setMaskPos({ x: pos.x, y: pos.y });
          setIsHovered(true);
        };

        const handleMouseLeave = () => {
          setIsHovered(false);
        };

        wordEl.addEventListener("mousemove", handleMouseMove);
        wordEl.addEventListener("mouseenter", handleMouseEnter);
        wordEl.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          wordEl.removeEventListener("mousemove", handleMouseMove);
          wordEl.removeEventListener("mouseenter", handleMouseEnter);
          wordEl.removeEventListener("mouseleave", handleMouseLeave);
        };
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="footer"
      className="relative w-full bg-[#071A33] text-[#F4EFE5] min-h-[46vh] lg:min-h-[52vh] flex flex-col justify-between overflow-hidden select-none pt-10 sm:pt-12 pb-5 sm:pb-6"
      aria-label="IntrinsQ Advisory Footer"
    >
      {/* ── Background Architectural Construction Arc (0.03–0.05 Opacity) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-end z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 800 600"
          className="w-[650px] h-[480px] sm:w-[800px] sm:h-[580px] opacity-[0.04] translate-x-20 -translate-y-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="600"
            cy="300"
            r="380"
            stroke="#C89A3D"
            strokeWidth="0.8"
            strokeDasharray="4 8"
          />
          <circle
            cx="600"
            cy="300"
            r="360"
            stroke="#F4EFE5"
            strokeWidth="0.5"
          />
          <line
            x1="240"
            y1="300"
            x2="600"
            y2="300"
            stroke="#F4EFE5"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      {/* ── Main Structured Content ──────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-between">
        {/* TOP: Location Marker */}
        <div className="flex items-center gap-2.5 pb-6 sm:pb-8 border-b border-[#F4EFE5]/[0.08]">
          <span className="w-4 h-[1px] bg-[#C89A3D]" />
          <span className="font-mono text-[10.5px] sm:text-xs tracking-[0.24em] uppercase text-[#C89A3D] font-medium">
            BENGALURU · INDIA
          </span>
        </div>

        {/* ── NAVIGATION: Compact 4 Columns ──────────────────────── */}
        <div
          ref={navSectionRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-14 pt-6 sm:pt-8 pb-6 sm:pb-8"
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col space-y-2 sm:space-y-2.5">
              <div className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.2em] text-[#F4EFE5]/40 font-semibold uppercase">
                <span className="text-[#C89A3D]/70">{group.num}</span>
                <span>{group.title}</span>
              </div>

              {group.links && (
                <ul className="space-y-1.5 font-sans text-xs sm:text-[13px] text-[#F4EFE5]/80">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group inline-flex items-center relative transition-transform duration-200 hover:translate-x-0.5 py-0.5"
                      >
                        <span className="group-hover:text-[#F4EFE5] transition-colors">
                          {link.label}
                        </span>
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C89A3D] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}

              {group.isContact && (
                <div className="space-y-2">
                  <div className="relative inline-block">
                    <a
                      href="mailto:hello@intrinsq.com"
                      onClick={handleCopyEmail}
                      className="group relative inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] text-[#F4EFE5] py-0.5 transition-transform duration-200 hover:translate-x-0.5 focus:outline-none"
                      title="Click to copy email address"
                    >
                      <span>hello@intrinsq.com</span>
                      <span className="text-[#C89A3D] opacity-70 group-hover:opacity-100 transition-opacity">
                        ↗
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#C89A3D] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out pointer-events-none" />
                    </a>

                    {copied && (
                      <span className="absolute -top-7 left-0 bg-[#C89A3D] text-[#071A33] font-mono text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-[2px] shadow-md animate-fade-in">
                        COPIED
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-[11px] text-[#F4EFE5]/50 leading-relaxed">
                    Bengaluru · India
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── MAIN BRAND AREA: INTRINSQ (Gold Material Reveal) ───── */}
        <div className="w-full pt-4 pb-2 flex flex-col items-start">
          <div
            ref={wordContainerRef}
            onClick={handleMobileTap}
            className="relative w-full cursor-pointer select-none overflow-hidden"
          >
            {/* ── LAYER 1: Base Warm Ivory Typography (#F4EFE5) ───── */}
            <div className="w-full flex items-baseline justify-between">
              <h3 className="w-full flex items-baseline justify-between font-serif text-[11.5vw] sm:text-[11vw] md:text-[10.5vw] lg:text-[10vw] font-normal leading-[0.85] tracking-tight text-[#F4EFE5]">
                {WORD_LETTERS.map((char, i) => (
                  <span
                    key={`base-${i}`}
                    ref={(el) => {
                      letterSpanRefs.current[i] = el;
                      if (char === "Q") qLetterRef.current = el;
                    }}
                    className="inline-block transition-colors duration-300"
                  >
                    {char}
                  </span>
                ))}
              </h3>
            </div>

            {/* ── LAYER 2: Brushed Champagne Gold Foil Reveal Layer ─ */}
            {/* Masked dynamically by cursor radial gradient */}
            <div
              ref={goldLayerRef}
              className="absolute inset-0 pointer-events-none flex items-baseline justify-between"
              style={{
                WebkitMaskImage: `radial-gradient(circle 120px at ${maskPos.x}px ${maskPos.y}px, black 30%, rgba(0,0,0,0.6) 65%, transparent 100%)`,
                maskImage: `radial-gradient(circle 120px at ${maskPos.x}px ${maskPos.y}px, black 30%, rgba(0,0,0,0.6) 65%, transparent 100%)`,
                opacity: isHovered ? 1 : 0,
                transition: isHovered
                  ? "opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
                  : "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              aria-hidden="true"
            >
              <div className="w-full flex items-baseline justify-between font-serif text-[11.5vw] sm:text-[11vw] md:text-[10.5vw] lg:text-[10vw] font-normal leading-[0.85] tracking-tight">
                {WORD_LETTERS.map((char, i) => (
                  <span
                    key={`gold-${i}`}
                    className="inline-block relative text-transparent"
                    style={{
                      backgroundImage: `
                        linear-gradient(
                          115deg,
                          #B88A32 0%,
                          #D4AA55 20%,
                          #FFF1D0 38%,
                          #C89A3D 52%,
                          #B88A32 68%,
                          #F5DC9C 84%,
                          #C89A3D 100%
                        )
                      `,
                      backgroundSize: "220% 100%",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      filter: "drop-shadow(0 0 12px rgba(200, 154, 61, 0.35))",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── CRAZY DETAIL: Signature Gold Line & Traveling Dot ──── */}
          <div
            ref={signatureTrackRef}
            className="relative w-full h-[2px] mt-2 sm:mt-2.5 flex items-center"
          >
            {/* The expanding thin champagne-gold line */}
            <div
              ref={signatureLineRef}
              className="h-[1px] w-full bg-[#C89A3D]/50"
            />

            {/* Traveling gold dot that locks directly under the Q */}
            <div
              ref={dotRef}
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-[#C89A3D] shadow-[0_0_6px_rgba(200,154,61,0.8)] pointer-events-none"
              style={{ opacity: 0 }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM COPYRIGHT BAR ─────────────────────────────────── */}
      <div className="relative z-10 w-full border-t border-[#F4EFE5]/[0.08] mt-3 pt-3.5 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[10.5px] text-[#F4EFE5]/45">
          <div>© 2026 IntrinsQ Advisory. All rights reserved.</div>
          <div className="tracking-[0.22em] uppercase text-[#C89A3D]/80 font-medium">
            Truth before comfort.
          </div>
        </div>
      </div>
    </footer>
  );
}
