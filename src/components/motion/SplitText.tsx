"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface SplitTextProps {
  children: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
}

export default function SplitText({
  children,
  className = "",
  wordClassName = "",
  delay = 0,
  stagger = 0.045,
  triggerOnScroll = true,
}: SplitTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const words = containerRef.current.querySelectorAll(".split-word-inner");
    if (!words.length) return;

    gsap.set(words, {
      y: "115%",
      opacity: 0,
      rotateX: -30,
      filter: "blur(6px)",
    });

    const animConfig = {
      y: "0%",
      opacity: 1,
      rotateX: 0,
      filter: "blur(0px)",
      duration: 0.95,
      ease: "power3.out",
      stagger,
      delay,
    };

    if (triggerOnScroll) {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 88%",
        onEnter: () => {
          gsap.to(words, animConfig);
        },
        once: true,
      });
    } else {
      gsap.to(words, animConfig);
    }
  }, [children, delay, stagger, triggerOnScroll]);

  const words = children.split(" ");

  return (
    <span
      ref={containerRef}
      className={`inline-block select-none ${className}`}
      aria-label={children}
      style={{ perspective: "800px" }}
    >
      {words.map((word, i) => (
        <span
          key={`word-${i}-${word}`}
          className="inline-block overflow-hidden mr-[0.26em] align-top will-change-transform"
        >
          <span
            className={`split-word-inner inline-block will-change-transform ${wordClassName}`}
            style={{ transformOrigin: "50% 100%" }}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}
