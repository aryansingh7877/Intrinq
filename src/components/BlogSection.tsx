"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  (window as any).ScrollTrigger = ScrollTrigger;
}

// ─── Article Data (Exact Copy Preserved) ──────────────────────────────────────
interface ArticleData {
  id: string;
  number: string;
  issueMarker: string;
  category: string;
  readTime: string;
  title: string;
  imageSrc: string;
  altText: string;
  widthRatio: string;
}

const ARTICLES: ArticleData[] = [
  {
    id: "art-01",
    number: "01",
    issueMarker: "ARTICLE 01",
    category: "CASH FLOW",
    readTime: "6 MIN READ",
    title: "How cash flow quietly kills growing businesses.",
    imageSrc: "/blog/article_01.jpg",
    altText: "Architectural monolithic geometry and natural light",
    widthRatio: "aspect-[16/11]",
  },
  {
    id: "art-02",
    number: "02",
    issueMarker: "ARTICLE 02",
    category: "FOUNDERS",
    readTime: "5 MIN READ",
    title: "The four numbers every founder should track monthly.",
    imageSrc: "/blog/article_02.jpg",
    altText: "Minimalist executive architecture and serene light",
    widthRatio: "aspect-[16/11.8]",
  },
  {
    id: "art-03",
    number: "03",
    issueMarker: "ARTICLE 03",
    category: "TAX",
    readTime: "7 MIN READ",
    title: "The compounding cost of reactive tax planning.",
    imageSrc: "/blog/article_03.jpg",
    altText: "Classical architectural stone columns and deep shadow",
    widthRatio: "aspect-[16/11.4]",
  },
];

// ─── Architectural Corner Marks Component ─────────────────────────────────────
// ┌ ┐ └ ┘ that expand 6px on hover
function ArchitecturalCornerMarks({ isHovered }: { isHovered: boolean }) {
  const arm = isHovered ? 20 : 13;
  const strokeW = 1.3;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20 transition-all duration-300 ease-out"
      aria-hidden="true"
    >
      {/* Top-Left: ┌ */}
      <line
        x1="5"
        y1={5 + arm}
        x2="5"
        y2="5"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />
      <line
        x1="5"
        y1="5"
        x2={5 + arm}
        y2="5"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />

      {/* Top-Right: ┐ */}
      <line
        x1="calc(100% - 5px)"
        y1={5 + arm}
        x2="calc(100% - 5px)"
        y2="5"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />
      <line
        x1="calc(100% - 5px)"
        y1="5"
        x2={`calc(100% - ${5 + arm}px)`}
        y2="5"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />

      {/* Bottom-Left: └ */}
      <line
        x1="5"
        y1={`calc(100% - ${5 + arm}px)`}
        x2="5"
        y2="calc(100% - 5px)"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />
      <line
        x1="5"
        y1="calc(100% - 5px)"
        x2={5 + arm}
        y2="calc(100% - 5px)"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />

      {/* Bottom-Right: ┘ */}
      <line
        x1="calc(100% - 5px)"
        y1={`calc(100% - ${5 + arm}px)`}
        x2="calc(100% - 5px)"
        y2="calc(100% - 5px)"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />
      <line
        x1="calc(100% - 5px)"
        y1="calc(100% - 5px)"
        x2={`calc(100% - ${5 + arm}px)`}
        y2="calc(100% - 5px)"
        stroke="#C89A3D"
        strokeWidth={strokeW}
        className="transition-all duration-300 opacity-40 group-hover:opacity-95"
      />
    </svg>
  );
}

// ─── Main Blog Section Component ──────────────────────────────────────────────
export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLSpanElement>(null);
  const word2Ref = useRef<HTMLSpanElement>(null);
  const word3Ref = useRef<HTMLSpanElement>(null);
  const viewBlogRef = useRef<HTMLAnchorElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Article element arrays for GSAP targeting
  const articleContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const windowFrameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageInnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const metaContainerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleContainerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Interactive Hover and Active Article Tracking
  const [activeArticleIndex, setActiveArticleIndex] = useState(0);
  const [hoveredArticleIndex, setHoveredArticleIndex] = useState<number | null>(null);
  const [viewBlogHovered, setViewBlogHovered] = useState(false);

  // Magnetic Indicator Refs for each article window
  const magneticIndicatorRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle window hover & parallax shift opposite to cursor
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    if (hoveredArticleIndex !== idx) {
      setHoveredArticleIndex(idx);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    const relX = localX / rect.width - 0.5; // -0.5 to 0.5
    const relY = localY / rect.height - 0.5;

    // Shift image opposite to cursor movement: max 8-12px
    const innerImg = imageInnerRefs.current[idx];
    if (innerImg) {
      gsap.to(innerImg, {
        x: -relX * 12,
        y: -relY * 12,
        duration: 0.35,
        ease: "power1.out",
        overwrite: "auto",
      });
    }

    // Magnetic READ → indicator follows cursor within image with 120ms easing
    const indicator = magneticIndicatorRefs.current[idx];
    if (indicator) {
      gsap.to(indicator, {
        x: localX,
        y: localY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.14,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleImageMouseEnter = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    setHoveredArticleIndex(idx);

    const rect = e.currentTarget.getBoundingClientRect();
    const localX = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const localY = e.clientY ? e.clientY - rect.top : rect.height / 2;

    const indicator = magneticIndicatorRefs.current[idx];
    if (indicator) {
      gsap.set(indicator, { x: localX, y: localY, xPercent: -50, yPercent: -50 });
    }
  };

  const handleImageMouseLeave = (idx: number) => {
    setHoveredArticleIndex(null);

    const innerImg = imageInnerRefs.current[idx];
    if (innerImg) {
      gsap.to(innerImg, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  // ─── GSAP ScrollTrigger Sequence ───────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        // Reduced motion: instantaneous clean visibility
        if (eyebrowRef.current) gsap.set(eyebrowRef.current, { opacity: 1 });
        if (word1Ref.current) gsap.set(word1Ref.current, { opacity: 1, y: 0 });
        if (word2Ref.current) gsap.set(word2Ref.current, { opacity: 1, y: 0 });
        if (word3Ref.current) gsap.set(word3Ref.current, { opacity: 1, y: 0 });
        if (viewBlogRef.current) gsap.set(viewBlogRef.current, { opacity: 1 });

        articleContainerRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1, y: 0 }));
        windowFrameRefs.current.forEach((el) => el && gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" }));
        metaContainerRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
        titleContainerRefs.current.forEach((el) => el && gsap.set(el, { clipPath: "inset(0% 0% 0% 0%)" }));
        return;
      }

      // 1. Header Reveal:
      // "OUR BLOG" appears first -> "Ideas" -> "that" -> "compound." (gold word last)
      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      headerTl
        .fromTo(
          eyebrowRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        )
        .fromTo(
          word1Ref.current,
          { opacity: 0, y: 24, clipPath: "inset(100% 0% 0% 0%)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0% -25% 0%)", duration: 0.55, ease: "power3.out", clearProps: "clipPath,transform" },
          "-=0.2"
        )
        .fromTo(
          word2Ref.current,
          { opacity: 0, y: 24, clipPath: "inset(100% 0% 0% 0%)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0% -25% 0%)", duration: 0.55, ease: "power3.out", clearProps: "clipPath,transform" },
          "-=0.35"
        )
        .fromTo(
          word3Ref.current,
          { opacity: 0, y: 28, clipPath: "inset(100% 0% 0% 0%)" },
          { opacity: 1, y: 0, clipPath: "inset(0% 0% -30% 0%)", duration: 0.65, ease: "power3.out", clearProps: "clipPath,transform" },
          "-=0.3"
        )
        .fromTo(
          viewBlogRef.current,
          { opacity: 0, x: -14 },
          { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
          "-=0.4"
        );

      // 2. Sequential Article Image Window Reveals (Desktop)
      // Article 01 -> Article 02 -> Article 03
      ARTICLES.forEach((_, idx) => {
        const cardEl = articleContainerRefs.current[idx];
        const frameEl = windowFrameRefs.current[idx];
        const innerImg = imageInnerRefs.current[idx];
        const metaEl = metaContainerRefs.current[idx];
        const titleEl = titleContainerRefs.current[idx];

        if (!cardEl || !frameEl) return;

        const articleTl = gsap.timeline({
          scrollTrigger: {
            trigger: cardEl,
            start: "top 82%",
            toggleActions: "play none none reverse",
            onEnter: () => setActiveArticleIndex(idx),
            onEnterBack: () => setActiveArticleIndex(idx),
          },
        });

        articleTl
          // Container fade & vertical settling
          .fromTo(
            cardEl,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
          )
          // Photographic Window unrolls: clip-path expands from vertical compression
          .fromTo(
            frameEl,
            { clipPath: "inset(8% 0% 8% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.95, ease: "expo.out" },
            "-=0.45"
          )
          // Image scale returns toward 1.0 from 1.06
          .fromTo(
            innerImg,
            { scale: 1.06 },
            { scale: 1.0, duration: 1.0, ease: "power2.out" },
            "-=0.95"
          )
          // Metadata appears
          .fromTo(
            metaEl,
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" },
            "-=0.6"
          )
          // Title reveals from bottom clip
          .fromTo(
            titleEl,
            { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
            { clipPath: "inset(0% 0% 0% 0%)", opacity: 1, duration: 0.7, ease: "power3.out" },
            "-=0.4"
          );

        // Subtle continuous scroll parallax inside fixed frame (10–20px camera move)
        if (innerImg) {
          gsap.to(innerImg, {
            y: -18,
            ease: "none",
            scrollTrigger: {
              trigger: cardEl,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          });
        }
      });

      // 3. Section Exit Transition (Article 03 subtle expansion as visual bridge)
      const article3Frame = windowFrameRefs.current[2];
      if (article3Frame) {
        gsap.to(article3Frame, {
          scaleX: 1.025,
          scaleY: 1.015,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "bottom 92%",
            end: "bottom 68%",
            scrub: 1.5,
          },
        });
      }

      // 4. Subtle Progress Indicator Bar Fill
      if (progressLineRef.current) {
        gsap.fromTo(
          progressLineRef.current,
          { scaleX: 0.1 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    // Refresh ScrollTrigger after DOM layout stabilizes with preceding pinned sections
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    const refreshTimer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  // Asymmetric vertical offsets for luxury magazine rhythm:
  // Article 01: 0px (baseline anchor)
  // Article 02: +36px (slightly offset down)
  // Article 03: -22px (slightly offset up)
  const verticalOffsets = [0, 36, -22];

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="relative w-full overflow-hidden select-none scroll-mt-24"
      style={{
        backgroundColor: "#F4EFE5",
        paddingTop: "clamp(90px, 11vw, 150px)",
        paddingBottom: "clamp(90px, 11vw, 150px)",
      }}
    >
      {/* Editorial subtle diagonal texture */}
      <div
        className="absolute inset-0 pointer-events-none select-none opacity-80"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            transparent,
            transparent 42px,
            rgba(7,26,51,0.016) 42px,
            rgba(7,26,51,0.016) 43px
          )`,
        }}
        aria-hidden="true"
      />



      {/* ── Main Container ──────────────────────────────────────────────────── */}
      <div className="relative mx-auto px-6 sm:px-10 lg:px-16 xl:px-24 max-w-[1440px]">
        {/* ── Section Header ─────────────────────────────────────────────────── */}
        <div className="mb-16 lg:mb-24 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-14 border-b border-[#071A33]/[0.08] pb-10">
          {/* Left: Eyebrow + Large Editorial Headline */}
          <div className="flex flex-col gap-4">
            {/* Eyebrow */}
            <div
              ref={eyebrowRef}
              className="flex items-center gap-3"
            >
              <span className="block w-6 h-[1.5px] bg-[#C89A3D]" />
              <span className="font-mono text-[11px] tracking-[0.26em] uppercase font-semibold text-[#071A33]/60">
                OUR BLOG
              </span>
            </div>

            {/* Headline: Sequential word reveal */}
            <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl xl:text-[5.4rem] font-normal leading-[1.16] tracking-tight text-[#071A33] pb-3">
              <span
                ref={word1Ref}
                className="inline-block mr-3 sm:mr-4 will-change-transform pb-1"
              >
                Ideas
              </span>
              <span
                ref={word2Ref}
                className="inline-block mr-3 sm:mr-4 will-change-transform pb-1"
              >
                that
              </span>
              <span
                ref={word3Ref}
                className="inline-block text-[#C89A3D] italic font-serif will-change-transform pb-2"
              >
                compound.
              </span>
            </h2>
          </div>

          {/* Right: View Blog Link with interactive travel & underline */}
          <a
            ref={viewBlogRef}
            href="#blog"
            className="group relative self-start lg:self-end flex items-center gap-3 pb-1 cursor-pointer no-underline"
            onMouseEnter={() => setViewBlogHovered(true)}
            onMouseLeave={() => setViewBlogHovered(false)}
          >
            <span
              className="font-mono text-[12.5px] tracking-[0.16em] uppercase font-semibold text-[#071A33] transition-transform duration-300 ease-out"
              style={{
                transform: viewBlogHovered ? "translateX(2px)" : "translateX(0)",
              }}
            >
              View Blog
            </span>
            <span
              className="font-mono text-[15px] text-[#C89A3D] transition-transform duration-300 ease-out"
              style={{
                transform: viewBlogHovered ? "translateX(10px)" : "translateX(0)",
              }}
            >
              →
            </span>
            {/* Gold underline expanding left to right */}
            <span
              className="absolute bottom-0 left-0 h-[1.5px] bg-[#C89A3D] transition-all duration-400 ease-out"
              style={{
                width: viewBlogHovered ? "100%" : "0%",
                opacity: 0.75,
              }}
            />
          </a>
        </div>

        {/* ── Asymmetric Editorial Journal Grid (Desktop >= 1024px) ──────────── */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-x-8 xl:gap-x-12 items-start">
          {ARTICLES.map((article, idx) => {
            const isHovered = hoveredArticleIndex === idx;
            const isActive = activeArticleIndex === idx;

            return (
              <div
                key={article.id}
                ref={(el) => {
                  articleContainerRefs.current[idx] = el;
                }}
                className="group relative flex flex-col will-change-transform"
                style={{
                  marginTop: `${verticalOffsets[idx]}px`,
                }}
              >
                {/* ── Photographic Window Frame ─────────────────────────────── */}
                <div
                  ref={(el) => {
                    windowFrameRefs.current[idx] = el;
                  }}
                  className={`relative w-full ${article.widthRatio} overflow-hidden cursor-none transition-all duration-400 border border-[#071A33]/12 group-hover:border-[#C89A3D]/65 group-hover:shadow-[0_16px_36px_-12px_rgba(7,26,51,0.12)]`}
                  onMouseEnter={(e) => handleImageMouseEnter(e, idx)}
                  onMouseLeave={() => handleImageMouseLeave(idx)}
                  onMouseMove={(e) => handleImageMouseMove(e, idx)}
                >
                  {/* Inner Parallax Image Carrier */}
                  <div
                    ref={(el) => {
                      imageInnerRefs.current[idx] = el;
                    }}
                    className="absolute inset-0 w-full h-full will-change-transform scale-100 group-hover:scale-[1.035] transition-transform duration-700 ease-out"
                  >
                    <Image
                      src={article.imageSrc}
                      alt={article.altText}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover transition-opacity duration-500 filter contrast-[1.02] brightness-[0.98]"
                      priority={idx === 0}
                    />
                    {/* Subtle warm tone overlay for cohesive luxury magazine grade */}
                    <div className="absolute inset-0 bg-[#071A33]/[0.08] mix-blend-multiply pointer-events-none" />
                  </div>

                  {/* Tiny Architectural Corner Marks ┌ ┐ └ ┘ */}
                  <ArchitecturalCornerMarks isHovered={isHovered} />

                  {/* Magnetic Cursor Indicator: READ → (Follows cursor within window) */}
                  <div
                    ref={(el) => {
                      magneticIndicatorRefs.current[idx] = el;
                    }}
                    className={`absolute z-40 pointer-events-none hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-[#071A33]/20 shadow-[0_4px_16px_rgba(7,26,51,0.14)] will-change-transform transition-opacity duration-200 ease-out ${
                      isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: "#F4EFE5",
                      top: 0,
                      left: 0,
                    }}
                    aria-hidden="true"
                  >
                    <span className="font-mono text-[10px] font-semibold tracking-[0.22em] uppercase text-[#071A33]">
                      Read
                    </span>
                    <span className="font-serif text-[12px] text-[#C89A3D] leading-none">→</span>
                  </div>

                  {/* Gold Article Tracker Line (Registration Mark along bottom edge) */}
                  <div
                    className="absolute bottom-0 left-0 h-[2px] bg-[#C89A3D] z-30 transition-all duration-700 ease-out"
                    style={{
                      width: isActive ? "100%" : "0%",
                      opacity: isActive ? 0.9 : 0,
                    }}
                  />
                </div>

                {/* ── Article Metadata & Issue Marker ───────────────────────── */}
                <div
                  ref={(el) => {
                    metaContainerRefs.current[idx] = el;
                  }}
                  className="flex items-center gap-3 mt-6 mb-3 px-1"
                >
                  {/* Issue Number */}
                  <span
                    className={`font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-300 ${
                      isHovered ? "text-[#C89A3D]" : "text-[#071A33]/45 group-hover:text-[#C89A3D]"
                    }`}
                  >
                    {article.number}
                  </span>

                  <span className="w-4 h-[1px] bg-[#C89A3D]/40" />

                  {/* Category */}
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase font-semibold text-[#8F6B2C]">
                    {article.category}
                  </span>
                </div>

                {/* ── Article Title (Serif Editorial Headline) ───────────────── */}
                <div
                  ref={(el) => {
                    titleContainerRefs.current[idx] = el;
                  }}
                  className="px-1 overflow-hidden"
                >
                  <h3
                    className="font-serif text-2xl xl:text-[1.85rem] font-normal leading-[1.24] tracking-tight text-[#071A33] transition-transform duration-300 ease-out group-hover:-translate-y-1"
                  >
                    {article.title}
                  </h3>

                  {/* Micro Gold Line appearing beneath title on hover */}
                  <div
                    className="mt-2.5 h-[1px] bg-[#C89A3D] transition-all duration-400 ease-out w-0 group-hover:w-full opacity-65"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile Vertical Editorial Feed (< 1024px) ──────────────────────── */}
        <div className="flex flex-col gap-14 lg:hidden">
          {ARTICLES.map((article, idx) => (
            <div key={article.id} className="flex flex-col">
              {/* Image Window */}
              <div className="relative w-full aspect-[16/10] overflow-hidden border border-[#071A33]/15">
                <Image
                  src={article.imageSrc}
                  alt={article.altText}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#071A33]/[0.08] mix-blend-multiply" />
                <ArchitecturalCornerMarks isHovered={false} />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2.5 mt-4 mb-2">
                <span className="font-mono text-[10.5px] font-bold tracking-[0.2em] uppercase text-[#071A33]/40">
                  {article.number}
                </span>
                <span className="w-3 h-[1px] bg-[#C89A3D]/40" />
                <span className="font-mono text-[10.5px] tracking-[0.16em] uppercase font-semibold text-[#8F6B2C]">
                  {article.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl font-normal leading-[1.25] tracking-tight text-[#071A33]">
                {article.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
