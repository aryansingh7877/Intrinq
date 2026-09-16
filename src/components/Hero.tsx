"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowDown } from "lucide-react";
import MagneticButton from "@/components/motion/MagneticButton";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoWrapperRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const topPillarsRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLSpanElement>(null);
  const eyebrowTextRef = useRef<HTMLSpanElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const headlineLine3Ref = useRef<HTMLSpanElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");

  useEffect(() => {
    // Delay video src loading until after initial critical paint
    // poster="/poster.jpg" renders immediately with zero layout shift or network contention
    const timer = setTimeout(() => {
      setVideoSrc("/hero_vedio.mp4");
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(
        [
          logoRef.current,
          topPillarsRef.current,
          eyebrowLineRef.current,
          eyebrowTextRef.current,
          headlineLine1Ref.current,
          headlineLine2Ref.current,
          headlineLine3Ref.current,
          paragraphRef.current,
          ctaGroupRef.current,
          taglineRef.current,
          scrollIndicatorRef.current,
        ],
        { opacity: 1, y: 0, x: 0, scaleX: 1, scale: 1 }
      );
      return;
    }

    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(videoWrapperRef.current, { scale: 1.08 });
      gsap.set([logoRef.current, topPillarsRef.current], { opacity: 0, y: -20 });
      gsap.set(eyebrowLineRef.current, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(eyebrowTextRef.current, { opacity: 0, x: -14 });
      gsap.set([headlineLine1Ref.current, headlineLine2Ref.current], {
        y: "120%",
        opacity: 0,
      });
      gsap.set(headlineLine3Ref.current, {
        y: "130%",
        opacity: 0,
      });
      gsap.set(paragraphRef.current, { opacity: 0, y: 25 });
      gsap.set(ctaGroupRef.current, { opacity: 0, y: 25 });
      gsap.set(taglineRef.current, { opacity: 0, y: 15 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0, y: 20 });

      // Master Choreographed Timeline
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.2,
      });

      // Video settle
      tl.to(
        videoWrapperRef.current,
        {
          scale: 1,
          duration: 3.0,
          ease: "power2.out",
        },
        0
      );

      // ScrollTrigger video contraction & corner curvature on scroll toward Section 2
      gsap.to(videoWrapperRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
        scale: 0.93,
        borderRadius: "28px",
        opacity: 0.45,
        ease: "none",
      });

      // Logo & Top elements
      tl.to(
        logoRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
        },
        0.2
      );

      tl.to(
        topPillarsRef.current,
        {
          opacity: 0.8,
          y: 0,
          duration: 1.1,
          ease: "power2.out",
        },
        0.3
      );

      // Eyebrow line & text
      tl.to(
        eyebrowLineRef.current,
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0.45
      );

      tl.to(
        eyebrowTextRef.current,
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        0.58
      );

      // Headline line 1 & 2
      tl.to(
        headlineLine1Ref.current,
        {
          y: "0%",
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          clearProps: "transform,filter",
        },
        0.72
      );

      tl.to(
        headlineLine2Ref.current,
        {
          y: "0%",
          opacity: 1,
          duration: 1.0,
          ease: "power3.out",
          clearProps: "transform,filter",
        },
        0.88
      );

      // "Compounds." distinctive reveal
      tl.to(
        headlineLine3Ref.current,
        {
          y: "0%",
          opacity: 1,
          duration: 1.25,
          ease: "power2.out",
          clearProps: "transform,filter",
        },
        1.05
      );

      // Paragraph
      tl.to(
        paragraphRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
        },
        1.3
      );

      // CTA Group
      tl.to(
        ctaGroupRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
        },
        1.48
      );

      // Tagline & Scroll indicator
      tl.to(
        taglineRef.current,
        {
          opacity: 0.75,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        },
        1.62
      );

      tl.to(
        scrollIndicatorRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
        },
        1.72
      );

      // Genuine 3D differential camera & depth parallax using quickTo
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      if (!isTouch && videoWrapperRef.current && contentWrapperRef.current) {
        const xToVideo = gsap.quickTo(videoWrapperRef.current, "x", { duration: 1.4, ease: "power2.out" });
        const yToVideo = gsap.quickTo(videoWrapperRef.current, "y", { duration: 1.4, ease: "power2.out" });
        const xToContent = gsap.quickTo(contentWrapperRef.current, "x", { duration: 1.0, ease: "power2.out" });
        const yToContent = gsap.quickTo(contentWrapperRef.current, "y", { duration: 1.0, ease: "power2.out" });

        const handleMouseMove = (e: MouseEvent) => {
          const { innerWidth, innerHeight } = window;
          const mouseX = (e.clientX / innerWidth - 0.5) * 2;
          const mouseY = (e.clientY / innerHeight - 0.5) * 2;

          xToVideo(mouseX * -18);
          yToVideo(mouseY * -12);
          xToContent(mouseX * 8);
          yToContent(mouseY * 6);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
        };
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <main
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-[100svh] h-auto lg:h-[100vh] lg:overflow-hidden bg-[#060B11] text-[#F7F4EE] select-none"
    >
      {/* ========================================================== */}
      {/* 1. CINEMATIC VIDEO BACKGROUND LAYER                       */}
      {/* ========================================================== */}
      <div
        ref={videoWrapperRef}
        className="absolute inset-[-2%] w-[104%] h-[104%] pointer-events-none overflow-hidden will-change-transform"
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/poster.jpg"
          className="w-full h-full object-cover object-center transform-gpu"
        >
          {videoSrc && <source src={videoSrc} type="video/mp4" />}
        </video>
      </div>

      {/* ========================================================== */}
      {/* 2. MULTI-LAYER CINEMATIC LUXURY OVERLAYS                   */}
      {/* ========================================================== */}
      {/* Editorial Left-weighted Vignette (Guarantees text clarity) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(6, 11, 17, 0.94) 0%, rgba(6, 11, 17, 0.82) 34%, rgba(6, 11, 17, 0.45) 62%, rgba(6, 11, 17, 0.12) 85%, rgba(6, 11, 17, 0.25) 100%)",
        }}
      />

      {/* Top & Bottom Depth Vignettes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(6, 11, 17, 0.82) 0%, transparent 20%, transparent 70%, rgba(6, 11, 17, 0.9) 100%)",
        }}
      />

      {/* Warm Golden Hour Glow on Marble & Books */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at 78% 42%, rgba(197, 160, 89, 0.2) 0%, rgba(197, 160, 89, 0.05) 45%, transparent 75%)",
        }}
      />

      {/* Filmic Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none grain-overlay z-10" />

      {/* ========================================================== */}
      {/* 3. TOP FIXED HEADER (Logo & Minimal Triad)                 */}
      {/* ========================================================== */}
      <header className="absolute top-0 left-0 w-full z-30 px-6 sm:px-10 md:px-16 pt-7 md:pt-8 flex items-center justify-between pointer-events-auto">
        {/* Official IntrinsQ Logo at Top-Left (Ivory & Gold for dark backgrounds) */}
        <div ref={logoRef} className="relative flex items-center">
          <Link
            href="/"
            className="group relative inline-flex items-center transition-transform duration-300 hover:scale-[1.02]"
            aria-label="IntrinsQ Private Advisory Home"
          >
            <div className="relative h-11 sm:h-12 md:h-14 w-32 sm:w-36 md:w-44 filter drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]">
              <Image
                src="/intrinsq_logo_white.png"
                alt="IntrinsQ Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
        </div>

        {/* Top-Right Editorial Pillars */}
        <div
          ref={topPillarsRef}
          className="hidden md:flex items-center space-x-3.5 text-xs tracking-[0.24em] uppercase text-ivory-200/65 font-light"
        >
          <span className="hover:text-gold-300 transition-colors duration-300">
            Strategic
          </span>
          <span className="text-gold-500/40">|</span>
          <span className="hover:text-gold-300 transition-colors duration-300">
            Disciplined
          </span>
          <span className="text-gold-500/40">|</span>
          <span className="hover:text-gold-300 transition-colors duration-300">
            Enduring
          </span>
        </div>
      </header>

      {/* ========================================================== */}
      {/* 4. MAIN HERO CONTENT (Guaranteed clearance below logo)     */}
      {/* ========================================================== */}
      <div className="relative z-20 w-full h-full flex flex-col justify-start px-6 sm:px-10 md:px-16 lg:px-20 pt-28 sm:pt-32 md:pt-36 lg:pt-40 pb-36 sm:pb-32 md:pb-28">
        <div ref={contentWrapperRef} className="max-w-xl md:max-w-2xl lg:max-w-[740px] will-change-transform">
          {/* Eyebrow with gold accent line */}
          <div className="flex items-center space-x-3.5 mb-4 sm:mb-5 md:mb-6">
            <span
              ref={eyebrowLineRef}
              className="h-[1.5px] w-9 md:w-12 bg-gradient-to-r from-gold-400 to-gold-200 rounded-full inline-block shadow-[0_0_10px_rgba(197,160,89,0.6)]"
            />
            <span
              ref={eyebrowTextRef}
              className="text-xs sm:text-[13px] tracking-[0.26em] uppercase font-medium text-gold-300/95 font-sans"
            >
              ADVICE THAT COMPOUNDS
            </span>
          </div>

          {/* Large High-Contrast Editorial Headline */}
          <h1 className="font-serif text-[2.5rem] sm:text-5xl md:text-6xl lg:text-[4.75rem] xl:text-[5.2rem] font-normal leading-[1.08] tracking-[-0.015em] text-[#FCFAF7] mb-4 sm:mb-5 md:mb-6">
            <span className="block overflow-hidden pb-2 sm:pb-3">
              <span ref={headlineLine1Ref} className="block will-change-transform pb-1">
                Strategic Financial
              </span>
            </span>
            <span className="block overflow-hidden pb-2 sm:pb-3">
              <span ref={headlineLine2Ref} className="block will-change-transform pb-1">
                Advice That
              </span>
            </span>
            <span className="block overflow-hidden pb-4 -mb-2">
              <span
                ref={headlineLine3Ref}
                className="inline-block font-serif italic font-normal text-gold-metallic tracking-normal pr-3 pb-2 will-change-transform"
              >
                Compounds.
              </span>
            </span>
          </h1>

          {/* Supporting paragraph */}
          <p
            ref={paragraphRef}
            className="text-sm sm:text-base md:text-[17px] text-ivory-200/80 font-sans font-light leading-relaxed max-w-lg md:max-w-xl mb-6 md:mb-8 text-balance"
          >
            AI handles the routine. We handle the decisions that shape your
            business — clarity, strategy, and discipline from a single advisory
            partner.
          </p>

          {/* Call To Action Buttons */}
          <div
            ref={ctaGroupRef}
            className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6 md:mb-8"
          >
            {/* Primary CTA with Magnetic Pull */}
            <MagneticButton strength={0.32} textStrength={0.48}>
              <Link
                href="#consultation"
                className="group relative inline-flex items-center justify-center space-x-3 px-7 py-3.5 sm:px-8 sm:py-4 rounded-full bg-[#F7F4EE] text-[#0A121C] font-sans text-xs sm:text-sm font-semibold tracking-wide shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-all duration-300 hover:bg-white hover:shadow-[0_14px_36px_rgba(197,160,89,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Book a Consultation</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-gold-700" />
              </Link>
            </MagneticButton>

            {/* Secondary CTA with Magnetic Pull */}
            <MagneticButton strength={0.2} textStrength={0.35}>
              <Link
                href="#services"
                className="group inline-flex items-center space-x-2.5 py-3 px-2 text-xs sm:text-sm font-medium tracking-wide text-ivory-100 hover:text-gold-300 transition-colors duration-300 relative"
              >
                <span>Explore Our Services</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5 text-gold-400" />
                <span className="absolute bottom-1.5 left-2 right-2 h-[1px] bg-gold-400/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            </MagneticButton>
          </div>

          {/* Discipline tagline */}
          <div className="flex items-center mb-6">
            <p
              ref={taglineRef}
              className="text-xs sm:text-[13px] italic font-serif text-ivory-300/70 tracking-wide"
            >
              Discipline today. Freedom tomorrow.
            </p>
          </div>

          {/* Elegant Circular Down Arrow */}
          <div
            ref={scrollIndicatorRef}
            className="hidden lg:flex items-center"
          >
            <MagneticButton strength={0.4} textStrength={0.55}>
              <a
                href="#marquee"
                aria-label="Scroll to explore"
                className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-ivory-200/25 bg-black/20 hover:border-gold-400/60 hover:bg-gold-500/10 transition-all duration-300 shadow-sm"
              >
                <ArrowDown className="w-4 h-4 text-gold-300 group-hover:text-gold-200 animate-bounce duration-1000" />
              </a>
            </MagneticButton>
          </div>
        </div>
      </div>
    </main>
  );
}
