"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Micro architectural corner registration marks component
function RegistrationCrosshairs({
  active,
  corner = "tl",
}: {
  active: boolean;
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const posClasses = {
    tl: "top-2 left-2",
    tr: "top-2 right-2",
    bl: "bottom-2 left-2",
    br: "bottom-2 right-2",
  }[corner];

  return (
    <div
      className={`absolute ${posClasses} pointer-events-none transition-colors duration-500`}
      aria-hidden="true"
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`transition-colors duration-500 ${
          active ? "text-[#C89A3D]" : "text-[#071A33]/20"
        }`}
      >
        <path
          d="M5 0V10M0 5H10"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function PrecisionStatisticsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // Line refs
  const horizontalGoldLineRef = useRef<HTMLDivElement | null>(null);
  const verticalGoldLineRef = useRef<HTMLDivElement | null>(null);

  // Divider line inner gold fills (desktop vertical dividers between 4 stations)
  const divider1FillRef = useRef<HTMLDivElement | null>(null);
  const divider2FillRef = useRef<HTMLDivElement | null>(null);
  const divider3FillRef = useRef<HTMLDivElement | null>(null);

  // Station card/node refs
  const stationRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaBoxRefs = useRef<(HTMLDivElement | null)[]>([]);
  const underlineRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Stat 1 calibration text ref
  const stat1TextRef = useRef<HTMLSpanElement | null>(null);
  const stat1UnderlineRef = useRef<HTMLDivElement | null>(null);

  // Stat 2 assembly segments refs
  const stat2SymRef = useRef<HTMLSpanElement | null>(null);
  const stat2NumRef = useRef<HTMLSpanElement | null>(null);
  const stat2SufRef = useRef<HTMLSpanElement | null>(null);

  // Stat 3 vertical reveal ref
  const stat3TextRef = useRef<HTMLSpanElement | null>(null);
  const stat3TickRef = useRef<HTMLDivElement | null>(null);

  // Stat 4 precision lock text ref
  const stat4TextRef = useRef<HTMLSpanElement | null>(null);

  // Pulse flash indicator rings
  const pulseRingsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Reactive state for UI indicators
  const [activeStation, setActiveStation] = useState<number>(-1);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Magnetic cursor quickTo functions for each station
  const quickToMap = useRef<
    {
      numX?: (val: number) => void;
      numY?: (val: number) => void;
      metaX?: (val: number) => void;
      metaY?: (val: number) => void;
    }[]
  >([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!sectionRef.current) return;

    // Refresh ScrollTrigger to ensure accurate positions after prior sections mount
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      // Setup magnetic quickTo helpers for desktop stations
      for (let i = 0; i < 4; i++) {
        const numEl = numberBoxRefs.current[i];
        const metaEl = metaBoxRefs.current[i];
        if (numEl && metaEl) {
          quickToMap.current[i] = {
            numX: gsap.quickTo(numEl, "x", { duration: 0.35, ease: "power2.out" }),
            numY: gsap.quickTo(numEl, "y", { duration: 0.35, ease: "power2.out" }),
            metaX: gsap.quickTo(metaEl, "x", { duration: 0.45, ease: "power2.out" }),
            metaY: gsap.quickTo(metaEl, "y", { duration: 0.45, ease: "power2.out" }),
          };
        }
      }

      if (prefersReducedMotion) {
        // Reduced motion: immediate full display
        if (stat1TextRef.current) stat1TextRef.current.textContent = "50+";
        if (stat4TextRef.current) stat4TextRef.current.textContent = "48 hrs";
        gsap.set(
          [
            horizontalGoldLineRef.current,
            verticalGoldLineRef.current,
            divider1FillRef.current,
            divider2FillRef.current,
            divider3FillRef.current,
            stat1UnderlineRef.current,
            stat3TickRef.current,
          ],
          { scaleX: 1, scaleY: 1, opacity: 1 }
        );
        gsap.set(
          [
            stat2SymRef.current,
            stat2NumRef.current,
            stat2SufRef.current,
            stat3TextRef.current,
          ],
          { opacity: 1, x: 0, y: 0, clipPath: "inset(0% 0 0% 0)" }
        );
        setActiveStation(3);
        setIsCompleted(true);
        return;
      }

      const mm = gsap.matchMedia();

      // ==========================================================
      // DESKTOP SCROLL INTERACTION (min-width: 1024px)
      // ==========================================================
      mm.add("(min-width: 1024px)", () => {
        // Initial setup for desktop
        if (stat1TextRef.current) stat1TextRef.current.textContent = "12";
        if (stat4TextRef.current) stat4TextRef.current.textContent = "00 hrs";

        gsap.set(horizontalGoldLineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        // Dividers start collapsed (0% height from center)
        gsap.set(
          [divider1FillRef.current, divider2FillRef.current, divider3FillRef.current],
          {
            scaleY: 0,
            transformOrigin: "center center",
            opacity: 0.4,
          }
        );

        // Stat 1 underline
        gsap.set(stat1UnderlineRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        // Stat 2 assembly segments
        gsap.set(stat2SymRef.current, { opacity: 0, x: -14 });
        gsap.set(stat2NumRef.current, { opacity: 0, x: -10 });
        gsap.set(stat2SufRef.current, { opacity: 0, x: -6 });

        // Stat 3 vertical reveal
        gsap.set(stat3TextRef.current, {
          y: 40,
          opacity: 0,
          clipPath: "inset(100% 0% 0% 0%)",
        });
        gsap.set(stat3TickRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        // Master ScrollTrigger directly scrubbed with pin
        let currentStation = -1;
        let currentCompleted = false;
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=100%",
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;

            // 1. Signature Gold Line follows scrub (0 to 100%)
            if (horizontalGoldLineRef.current) {
              gsap.set(horizontalGoldLineRef.current, { scaleX: p });
            }

            // 2. Station 01 (50+) Calibration Sequence: (0.00 -> 0.24)
            if (stat1TextRef.current) {
              if (p < 0.04) {
                stat1TextRef.current.textContent = "12";
              } else if (p < 0.09) {
                stat1TextRef.current.textContent = "24";
              } else if (p < 0.14) {
                stat1TextRef.current.textContent = "31";
              } else if (p < 0.19) {
                stat1TextRef.current.textContent = "43";
              } else {
                stat1TextRef.current.textContent = "50+";
              }
            }
            if (stat1UnderlineRef.current) {
              const u1 = Math.min(1, Math.max(0, (p - 0.12) / 0.1));
              gsap.set(stat1UnderlineRef.current, { scaleX: u1 });
            }

            // 3. Divider 1 draws: (0.20 -> 0.38)
            const d1 = Math.min(1, Math.max(0, (p - 0.20) / 0.15));
            if (divider1FillRef.current) {
              gsap.set(divider1FillRef.current, {
                scaleY: d1,
                opacity: d1 > 0.8 ? 1 : 0.3 + d1 * 0.7,
              });
            }

            // 4. Station 02 (₹500Cr+) Assembly Sequence: (0.24 -> 0.50)
            if (stat2SymRef.current) {
              const symP = Math.min(1, Math.max(0, (p - 0.24) / 0.08));
              gsap.set(stat2SymRef.current, {
                opacity: symP,
                x: (1 - symP) * -12,
              });
            }
            if (stat2NumRef.current) {
              const numP = Math.min(1, Math.max(0, (p - 0.30) / 0.09));
              gsap.set(stat2NumRef.current, {
                opacity: numP,
                x: (1 - numP) * -10,
              });
            }
            if (stat2SufRef.current) {
              const sufP = Math.min(1, Math.max(0, (p - 0.36) / 0.08));
              gsap.set(stat2SufRef.current, {
                opacity: sufP,
                x: (1 - sufP) * -8,
              });
            }

            // 5. Divider 2 draws: (0.45 -> 0.62)
            const d2 = Math.min(1, Math.max(0, (p - 0.45) / 0.15));
            if (divider2FillRef.current) {
              gsap.set(divider2FillRef.current, {
                scaleY: d2,
                opacity: d2 > 0.8 ? 1 : 0.3 + d2 * 0.7,
              });
            }

            // 6. Station 03 (15+) Vertical Reveal: (0.48 -> 0.74)
            if (stat3TextRef.current) {
              const s3P = Math.min(1, Math.max(0, (p - 0.48) / 0.16));
              gsap.set(stat3TextRef.current, {
                y: (1 - s3P) * 35,
                opacity: s3P,
                clipPath: `inset(${(1 - s3P) * 100}% 0% 0% 0%)`,
              });
            }
            if (stat3TickRef.current) {
              const tickP = Math.min(1, Math.max(0, (p - 0.60) / 0.1));
              gsap.set(stat3TickRef.current, { scaleY: tickP });
            }

            // 7. Divider 3 draws: (0.68 -> 0.85)
            const d3 = Math.min(1, Math.max(0, (p - 0.68) / 0.15));
            if (divider3FillRef.current) {
              gsap.set(divider3FillRef.current, {
                scaleY: d3,
                opacity: d3 > 0.8 ? 1 : 0.3 + d3 * 0.7,
              });
            }

            // 8. Station 04 (48 hrs) Precision Measurement Lock: (0.72 -> 0.95)
            if (stat4TextRef.current) {
              if (p < 0.72) {
                stat4TextRef.current.textContent = "00 hrs";
              } else if (p < 0.77) {
                stat4TextRef.current.textContent = "12 hrs";
              } else if (p < 0.82) {
                stat4TextRef.current.textContent = "24 hrs";
              } else if (p < 0.87) {
                stat4TextRef.current.textContent = "36 hrs";
              } else {
                stat4TextRef.current.textContent = "48 hrs";
              }
            }

            // Determine active station & completion with change guard
            let nextStation = -1;
            let nextCompleted = false;
            if (p < 0.12) {
              nextStation = -1;
              nextCompleted = false;
            } else if (p >= 0.12 && p < 0.38) {
              nextStation = 0;
              nextCompleted = false;
            } else if (p >= 0.38 && p < 0.62) {
              nextStation = 1;
              nextCompleted = false;
            } else if (p >= 0.62 && p < 0.86) {
              nextStation = 2;
              nextCompleted = false;
            } else {
              nextStation = 3;
              nextCompleted = p >= 0.95;
            }

            if (nextStation !== currentStation) {
              currentStation = nextStation;
              setActiveStation(nextStation);
            }
            if (nextCompleted !== currentCompleted) {
              currentCompleted = nextCompleted;
              setIsCompleted(nextCompleted);
            }
          },
        });
      });

      // ==========================================================
      // MOBILE SCROLL INTERACTION (< 1024px)
      // Stacks vertically; vertical line draws downward
      // ==========================================================
      mm.add("(max-width: 1023px)", () => {
        let currentMobStation = -1;
        let currentMobCompleted = false;

        if (stat1TextRef.current) stat1TextRef.current.textContent = "50+";
        if (stat4TextRef.current) stat4TextRef.current.textContent = "48 hrs";

        gsap.set(verticalGoldLineRef.current, {
          scaleY: 0,
          transformOrigin: "top center",
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 65%",
          end: "bottom 75%",
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;

            if (verticalGoldLineRef.current) {
              gsap.set(verticalGoldLineRef.current, { scaleY: p });
            }

            let nextMobStation = 0;
            let nextMobCompleted = false;
            if (p < 0.25) nextMobStation = 0;
            else if (p < 0.5) nextMobStation = 1;
            else if (p < 0.75) nextMobStation = 2;
            else {
              nextMobStation = 3;
              nextMobCompleted = p >= 0.9;
            }

            if (nextMobStation !== currentMobStation) {
              currentMobStation = nextMobStation;
              setActiveStation(nextMobStation);
            }
            if (nextMobCompleted !== currentMobCompleted) {
              currentMobCompleted = nextMobCompleted;
              setIsCompleted(nextMobCompleted);
            }
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Desktop subtle magnetic cursor handler (Max 4px movement)
  const handleMouseMove = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const node = stationRefs.current[idx];
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    const targetNumX = normX * 3.5;
    const targetNumY = normY * 3.5;
    const targetMetaX = normX * 1.5;
    const targetMetaY = normY * 1.5;

    const funcs = quickToMap.current[idx];
    if (funcs?.numX && funcs?.numY) {
      funcs.numX(targetNumX);
      funcs.numY(targetNumY);
    }
    if (funcs?.metaX && funcs?.metaY) {
      funcs.metaX(targetMetaX);
      funcs.metaY(targetMetaY);
    }

    const ul = underlineRefs.current[idx];
    if (ul) {
      gsap.to(ul, { scaleX: 1.2, duration: 0.3, ease: "power1.out" });
    }
  };

  const handleMouseLeave = (idx: number) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const funcs = quickToMap.current[idx];
    if (funcs?.numX && funcs?.numY) {
      funcs.numX(0);
      funcs.numY(0);
    }
    if (funcs?.metaX && funcs?.metaY) {
      funcs.metaX(0);
      funcs.metaY(0);
    }

    const ul = underlineRefs.current[idx];
    if (ul) {
      gsap.to(ul, { scaleX: 1, duration: 0.35, ease: "power1.out" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="proof"
      aria-label="Precision Statistics & Proof of Scale"
      className="relative w-full min-h-screen bg-[#F4EFE5] text-[#071A33] overflow-hidden select-none flex flex-col justify-between pt-24 sm:pt-28 lg:pt-20 pb-16 px-6 sm:px-10 md:px-16 lg:px-24"
    >
      {/* ========================================================== */}
      {/* HORIZONTAL PRECISION GRID & LUXURY DRAFTING TEXTURE        */}
      {/* ========================================================== */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #071A33 1px, transparent 1px),
            linear-gradient(to bottom, #071A33 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      {/* Fine diagonal drafting paper grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #071A33,
            #071A33 1px,
            transparent 1px,
            transparent 16px
          )`,
        }}
      />

      {/* Top subtle boundary separating from blog section */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-[#071A33]/[0.08]" />

      {/* ── Editorial Header / Eyebrow Row ──────────────────────── */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between border-b border-[#071A33]/[0.08] pb-5 sm:pb-6 relative z-10">
        <div className="flex items-center space-x-3.5">
          <span className="h-[1.5px] w-9 bg-[#C89A3D] inline-block rounded-full" />
          <span className="font-mono text-xs sm:text-[13px] tracking-[0.26em] uppercase font-semibold text-[#8F6B2C]">
            PRECISION ARCHITECTURE
          </span>
        </div>
      </div>

      {/* ── Central Precision Statistics Horizontal Stage ────────── */}
      <div className="max-w-7xl mx-auto w-full my-auto py-8 lg:py-14 relative z-10">
        {/* Subtle horizontal baseline grid line behind stations */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-[#071A33]/[0.05] pointer-events-none" />

        {/* ======================================================== */}
        {/* DESKTOP 4-STATION HORIZONTAL CONTINUOUS ROW              */}
        {/* ======================================================== */}
        <div className="hidden lg:flex items-stretch justify-between w-full relative z-10">
          {/* ------------------------------------------------------ */}
          {/* STATION 01: 50+ BUSINESSES SUPPORTED                  */}
          {/* ------------------------------------------------------ */}
          <div
            ref={(el) => {
              stationRefs.current[0] = el;
            }}
            onMouseMove={(e) => handleMouseMove(0, e)}
            onMouseLeave={() => handleMouseLeave(0)}
            className={`flex-1 relative px-6 xl:px-8 py-8 flex flex-col justify-between transition-all duration-500 cursor-default group ${
              activeStation === 0 || isCompleted
                ? "opacity-100"
                : "opacity-55 hover:opacity-85"
            }`}
          >
            <RegistrationCrosshairs active={activeStation === 0 || isCompleted} corner="tl" />
            <RegistrationCrosshairs active={activeStation === 0 || isCompleted} corner="tr" />

            {/* Station Tag & Pulse Ring */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-400 ${
                  activeStation === 0 || isCompleted
                    ? "text-[#C89A3D] font-semibold"
                    : "text-[#071A33]/40"
                }`}
              >
                01
              </span>
              <div
                ref={(el) => {
                  pulseRingsRef.current[0] = el;
                }}
                className={`w-2 h-2 rounded-full border border-[#C89A3D] transition-opacity duration-300 ${
                  activeStation === 0 ? "opacity-80 scale-110" : "opacity-0 scale-90"
                }`}
              />
            </div>

            {/* Hero Metric Number Box */}
            <div
              ref={(el) => {
                numberBoxRefs.current[0] = el;
              }}
              className="my-2 will-change-transform"
            >
              <div className="flex items-baseline">
                <span
                  ref={stat1TextRef}
                  className="font-serif text-6xl xl:text-7xl 2xl:text-[5rem] font-light tracking-tight text-[#071A33] leading-none"
                >
                  50+
                </span>
              </div>
              {/* Station Gold Underline */}
              <div
                ref={(el) => {
                  stat1UnderlineRef.current = el;
                  underlineRefs.current[0] = el;
                }}
                className="mt-3.5 h-[1.5px] bg-[#C89A3D] w-12 origin-left transition-all duration-300"
              />
            </div>

            {/* Editorial Metadata Label */}
            <div
              ref={(el) => {
                metaBoxRefs.current[0] = el;
              }}
              className="mt-6 will-change-transform"
            >
              <p className="font-sans text-[12px] xl:text-[13px] tracking-[0.18em] uppercase font-semibold text-[#071A33]/85 leading-snug">
                Businesses
                <br />
                Supported
              </p>
              <span className="block mt-2 font-mono text-[9.5px] tracking-wider uppercase text-[#8F6B2C]/70">
                ACTIVE PORTFOLIO
              </span>
            </div>
          </div>

          {/* ── Divider 1 ────────────────────────────────────────── */}
          <div className="w-[1px] relative flex justify-center items-center pointer-events-none mx-2">
            <div className="w-[1px] h-full bg-[#071A33]/12 absolute inset-y-0" />
            <div
              ref={divider1FillRef}
              className="w-[1.5px] h-full bg-gradient-to-b from-[#C89A3D]/40 via-[#C89A3D] to-[#C89A3D]/40 absolute inset-y-0 z-20"
            />
          </div>

          {/* ------------------------------------------------------ */}
          {/* STATION 02: ₹500Cr+ FINANCIAL OVERSIGHT               */}
          {/* ------------------------------------------------------ */}
          <div
            ref={(el) => {
              stationRefs.current[1] = el;
            }}
            onMouseMove={(e) => handleMouseMove(1, e)}
            onMouseLeave={() => handleMouseLeave(1)}
            className={`flex-1 relative px-6 xl:px-8 py-8 flex flex-col justify-between transition-all duration-500 cursor-default group ${
              activeStation === 1 || isCompleted
                ? "opacity-100"
                : "opacity-55 hover:opacity-85"
            }`}
          >
            <RegistrationCrosshairs active={activeStation === 1 || isCompleted} corner="tl" />
            <RegistrationCrosshairs active={activeStation === 1 || isCompleted} corner="tr" />

            {/* Station Tag & Pulse Ring */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-400 ${
                  activeStation === 1 || isCompleted
                    ? "text-[#C89A3D] font-semibold"
                    : "text-[#071A33]/40"
                }`}
              >
                02
              </span>
              <div
                ref={(el) => {
                  pulseRingsRef.current[1] = el;
                }}
                className={`w-2 h-2 rounded-full border border-[#C89A3D] transition-opacity duration-300 ${
                  activeStation === 1 ? "opacity-80 scale-110" : "opacity-0 scale-90"
                }`}
              />
            </div>

            {/* Hero Metric Number Box - Assembly Sequence */}
            <div
              ref={(el) => {
                numberBoxRefs.current[1] = el;
              }}
              className="my-2 will-change-transform"
            >
              <div className="flex items-baseline overflow-hidden py-1">
                {/* Currency Symbol ₹ */}
                <span
                  ref={stat2SymRef}
                  className="font-serif text-5xl xl:text-6xl 2xl:text-[4.4rem] font-light tracking-tight text-[#C89A3D] leading-none mr-0.5 inline-block"
                >
                  ₹
                </span>
                {/* Number 500 */}
                <span
                  ref={stat2NumRef}
                  className="font-serif text-6xl xl:text-7xl 2xl:text-[5rem] font-light tracking-tight text-[#071A33] leading-none inline-block"
                >
                  500
                </span>
                {/* Suffix Cr+ */}
                <span
                  ref={stat2SufRef}
                  className="font-serif text-3xl xl:text-4xl 2xl:text-[2.8rem] font-light italic text-[#8F6B2C] leading-none ml-1 inline-block"
                >
                  Cr+
                </span>
              </div>
              {/* Micro underline */}
              <div
                ref={(el) => {
                  underlineRefs.current[1] = el;
                }}
                className={`mt-3.5 h-[1.5px] bg-[#C89A3D] w-12 origin-left transition-all duration-300 ${
                  activeStation >= 1 || isCompleted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
              />
            </div>

            {/* Editorial Metadata Label */}
            <div
              ref={(el) => {
                metaBoxRefs.current[1] = el;
              }}
              className="mt-6 will-change-transform"
            >
              <p className="font-sans text-[12px] xl:text-[13px] tracking-[0.18em] uppercase font-semibold text-[#071A33]/85 leading-snug">
                Financial
                <br />
                Oversight
              </p>
              <span className="block mt-2 font-mono text-[9.5px] tracking-wider uppercase text-[#8F6B2C]/70">
                AUDITED CAPITAL
              </span>
            </div>
          </div>

          {/* ── Divider 2 ────────────────────────────────────────── */}
          <div className="w-[1px] relative flex justify-center items-center pointer-events-none mx-2">
            <div className="w-[1px] h-full bg-[#071A33]/12 absolute inset-y-0" />
            <div
              ref={divider2FillRef}
              className="w-[1.5px] h-full bg-gradient-to-b from-[#C89A3D]/40 via-[#C89A3D] to-[#C89A3D]/40 absolute inset-y-0 z-20"
            />
          </div>

          {/* ------------------------------------------------------ */}
          {/* STATION 03: 15+ YEARS OF EXPERIENCE                   */}
          {/* ------------------------------------------------------ */}
          <div
            ref={(el) => {
              stationRefs.current[2] = el;
            }}
            onMouseMove={(e) => handleMouseMove(2, e)}
            onMouseLeave={() => handleMouseLeave(2)}
            className={`flex-1 relative px-6 xl:px-8 py-8 flex flex-col justify-between transition-all duration-500 cursor-default group ${
              activeStation === 2 || isCompleted
                ? "opacity-100"
                : "opacity-55 hover:opacity-85"
            }`}
          >
            <RegistrationCrosshairs active={activeStation === 2 || isCompleted} corner="tl" />
            <RegistrationCrosshairs active={activeStation === 2 || isCompleted} corner="tr" />

            {/* Station Tag & Pulse Ring */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-400 ${
                  activeStation === 2 || isCompleted
                    ? "text-[#C89A3D] font-semibold"
                    : "text-[#071A33]/40"
                }`}
              >
                03
              </span>
              <div
                ref={(el) => {
                  pulseRingsRef.current[2] = el;
                }}
                className={`w-2 h-2 rounded-full border border-[#C89A3D] transition-opacity duration-300 ${
                  activeStation === 2 ? "opacity-80 scale-110" : "opacity-0 scale-90"
                }`}
              />
            </div>

            {/* Hero Metric Number Box - Vertical Reveal */}
            <div
              ref={(el) => {
                numberBoxRefs.current[2] = el;
              }}
              className="my-2 will-change-transform overflow-hidden"
            >
              <div className="flex items-baseline">
                <span
                  ref={stat3TextRef}
                  className="font-serif text-6xl xl:text-7xl 2xl:text-[5rem] font-light tracking-tight text-[#071A33] leading-none inline-block"
                >
                  15+
                </span>
              </div>
              {/* Station Vertical Gold Line Underneath */}
              <div className="flex items-center space-x-2 mt-3.5">
                <div
                  ref={stat3TickRef}
                  className="w-[1.5px] h-4 bg-[#C89A3D] origin-top"
                />
                <div
                  ref={(el) => {
                    underlineRefs.current[2] = el;
                  }}
                  className={`h-[1.5px] bg-[#C89A3D]/70 w-10 origin-left transition-all duration-300 ${
                    activeStation >= 2 || isCompleted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Editorial Metadata Label */}
            <div
              ref={(el) => {
                metaBoxRefs.current[2] = el;
              }}
              className="mt-6 will-change-transform"
            >
              <p className="font-sans text-[12px] xl:text-[13px] tracking-[0.18em] uppercase font-semibold text-[#071A33]/85 leading-snug">
                Years of
                <br />
                Experience
              </p>
              <span className="block mt-2 font-mono text-[9.5px] tracking-wider uppercase text-[#8F6B2C]/70">
                COMPOUNDED PROOF
              </span>
            </div>
          </div>

          {/* ── Divider 3 ────────────────────────────────────────── */}
          <div className="w-[1px] relative flex justify-center items-center pointer-events-none mx-2">
            <div className="w-[1px] h-full bg-[#071A33]/12 absolute inset-y-0" />
            <div
              ref={divider3FillRef}
              className="w-[1.5px] h-full bg-gradient-to-b from-[#C89A3D]/40 via-[#C89A3D] to-[#C89A3D]/40 absolute inset-y-0 z-20"
            />
          </div>

          {/* ------------------------------------------------------ */}
          {/* STATION 04: 48 hrs REPORTING TURNAROUND               */}
          {/* ------------------------------------------------------ */}
          <div
            ref={(el) => {
              stationRefs.current[3] = el;
            }}
            onMouseMove={(e) => handleMouseMove(3, e)}
            onMouseLeave={() => handleMouseLeave(3)}
            className={`flex-1 relative px-6 xl:px-8 py-8 flex flex-col justify-between transition-all duration-500 cursor-default group ${
              activeStation === 3 || isCompleted
                ? "opacity-100"
                : "opacity-55 hover:opacity-85"
            }`}
          >
            <RegistrationCrosshairs active={activeStation === 3 || isCompleted} corner="tl" />
            <RegistrationCrosshairs active={activeStation === 3 || isCompleted} corner="tr" />

            {/* Station Tag & Pulse Ring */}
            <div className="flex items-center justify-between mb-6">
              <span
                className={`font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-400 ${
                  activeStation === 3 || isCompleted
                    ? "text-[#C89A3D] font-semibold"
                    : "text-[#071A33]/40"
                }`}
              >
                04
              </span>
              <div
                ref={(el) => {
                  pulseRingsRef.current[3] = el;
                }}
                className={`w-2 h-2 rounded-full border border-[#C89A3D] transition-opacity duration-300 ${
                  activeStation === 3 ? "opacity-80 scale-110" : "opacity-0 scale-90"
                }`}
              />
            </div>

            {/* Hero Metric Number Box - Precision Measurement Lock */}
            <div
              ref={(el) => {
                numberBoxRefs.current[3] = el;
              }}
              className="my-2 will-change-transform"
            >
              <div className="flex items-baseline">
                <span
                  ref={stat4TextRef}
                  className="font-serif text-5xl xl:text-6xl 2xl:text-[4.4rem] font-light tracking-tight text-[#071A33] leading-none whitespace-nowrap"
                >
                  48 hrs
                </span>
              </div>
              {/* Station Underline */}
              <div
                ref={(el) => {
                  underlineRefs.current[3] = el;
                }}
                className={`mt-3.5 h-[1.5px] bg-[#C89A3D] w-12 origin-left transition-all duration-300 ${
                  activeStation === 3 || isCompleted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                }`}
              />
            </div>

            {/* Editorial Metadata Label */}
            <div
              ref={(el) => {
                metaBoxRefs.current[3] = el;
              }}
              className="mt-6 will-change-transform"
            >
              <p className="font-sans text-[12px] xl:text-[13px] tracking-[0.18em] uppercase font-semibold text-[#071A33]/85 leading-snug">
                Reporting
                <br />
                Turnaround
              </p>
              <span className="block mt-2 font-mono text-[9.5px] tracking-wider uppercase text-[#8F6B2C]/70">
                GUARANTEED CADENCE
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* THE SIGNATURE HORIZONTAL GOLD PRECISION LINE (Desktop)    */}
        {/* ======================================================== */}
        <div className="hidden lg:block relative mt-8 xl:mt-12 w-full">
          {/* Background Track Line */}
          <div className="w-full h-[1.5px] bg-[#071A33]/10" />

          {/* Active Drawing Champagne-Gold Precision Line */}
          <div
            ref={horizontalGoldLineRef}
            className="absolute top-0 left-0 h-[1.5px] bg-[#C89A3D] w-full origin-left pointer-events-none"
            style={{
              boxShadow: "0 0 8px rgba(200, 154, 61, 0.4)",
            }}
          />

          {/* 4 Station Indicator Nodes Centered Under Each Column */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] flex pointer-events-none">
            {[0, 1, 2, 3].map((idx) => {
              const isPassed = activeStation >= idx || isCompleted;
              return (
                <div key={idx} className="flex-1 flex justify-center items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full border -translate-y-[0.5px] transition-all duration-300 flex items-center justify-center ${
                      isPassed
                        ? "border-[#C89A3D] bg-[#F4EFE5] scale-110"
                        : "border-[#071A33]/30 bg-[#F4EFE5] scale-90"
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                        isPassed ? "bg-[#C89A3D]" : "bg-transparent"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE VERTICAL FEED (< 1024px) — CENTERED TIMELINE      */}
        {/* ======================================================== */}
        <div className="lg:hidden relative max-w-md mx-auto py-6 space-y-14 sm:space-y-16 text-center">
          {/* Vertical Background Line Track Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1.5px] bg-[#071A33]/10 pointer-events-none z-0" />

          {/* Vertical Active Gold Precision Line Centered */}
          <div
            ref={verticalGoldLineRef}
            className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-[1.5px] bg-[#C89A3D] pointer-events-none z-0"
            style={{
              boxShadow: "0 0 10px rgba(200, 154, 61, 0.5)",
            }}
          />

          {/* Mobile Stat 01 */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Centered Node */}
            <div className="w-4 h-4 rounded-full border border-[#C89A3D] bg-[#F4EFE5] flex items-center justify-center shadow-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8F6B2C] font-semibold bg-[#F4EFE5] px-3.5 py-0.5 rounded-full">
              01
            </span>
            <div className="mt-2 font-serif text-5xl sm:text-6xl font-light text-[#071A33] leading-none bg-[#F4EFE5] px-4 py-0.5">
              <span>50+</span>
            </div>
            <p className="mt-2 font-sans text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#071A33]/80 bg-[#F4EFE5] px-3">
              Businesses Supported
            </p>
          </div>

          {/* Mobile Stat 02 */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Centered Node */}
            <div className="w-4 h-4 rounded-full border border-[#C89A3D] bg-[#F4EFE5] flex items-center justify-center shadow-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8F6B2C] font-semibold bg-[#F4EFE5] px-3.5 py-0.5 rounded-full">
              02
            </span>
            <div className="mt-2 font-serif text-5xl sm:text-6xl font-light text-[#071A33] leading-none flex items-baseline justify-center bg-[#F4EFE5] px-4 py-0.5">
              <span className="text-[#C89A3D]">₹</span>
              <span>500</span>
              <span className="text-3xl italic text-[#8F6B2C] ml-1">Cr+</span>
            </div>
            <p className="mt-2 font-sans text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#071A33]/80 bg-[#F4EFE5] px-3">
              Financial Oversight
            </p>
          </div>

          {/* Mobile Stat 03 */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Centered Node */}
            <div className="w-4 h-4 rounded-full border border-[#C89A3D] bg-[#F4EFE5] flex items-center justify-center shadow-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8F6B2C] font-semibold bg-[#F4EFE5] px-3.5 py-0.5 rounded-full">
              03
            </span>
            <div className="mt-2 font-serif text-5xl sm:text-6xl font-light text-[#071A33] leading-none bg-[#F4EFE5] px-4 py-0.5">
              <span>15+</span>
            </div>
            <p className="mt-2 font-sans text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#071A33]/80 bg-[#F4EFE5] px-3">
              Years of Experience
            </p>
          </div>

          {/* Mobile Stat 04 */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Centered Node */}
            <div className="w-4 h-4 rounded-full border border-[#C89A3D] bg-[#F4EFE5] flex items-center justify-center shadow-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />
            </div>
            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-[#8F6B2C] font-semibold bg-[#F4EFE5] px-3.5 py-0.5 rounded-full">
              04
            </span>
            <div className="mt-2 font-serif text-5xl sm:text-6xl font-light text-[#071A33] leading-none bg-[#F4EFE5] px-4 py-0.5">
              <span>48 hrs</span>
            </div>
            <p className="mt-2 font-sans text-xs sm:text-sm tracking-wider uppercase font-semibold text-[#071A33]/80 bg-[#F4EFE5] px-3">
              Reporting Turnaround
            </p>
          </div>
        </div>
      </div>

      {/* Gentle transition line extending slightly and fading naturally */}
      <div className="absolute bottom-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="w-full max-w-xl h-[1px] bg-gradient-to-r from-transparent via-[#C89A3D]/40 to-transparent" />
      </div>
    </section>
  );
}
