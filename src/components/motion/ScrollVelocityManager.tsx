"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollVelocityState {
  velocity: number; // 0 to 1+
  rawVelocity: number; // in px/s
  direction: number; // 1 (down) or -1 (up)
  isFastScrolling: boolean;
}

const ScrollVelocityContext = createContext<ScrollVelocityState>({
  velocity: 0,
  rawVelocity: 0,
  direction: 1,
  isFastScrolling: false,
});

export const useScrollVelocity = () => useContext(ScrollVelocityContext);

export default function ScrollVelocityManager({ children }: { children: React.ReactNode }) {
  const [velocityState, setVelocityState] = useState<ScrollVelocityState>({
    velocity: 0,
    rawVelocity: 0,
    direction: 1,
    isFastScrolling: false,
  });

  const stateRef = useRef<ScrollVelocityState>({
    velocity: 0,
    rawVelocity: 0,
    direction: 1,
    isFastScrolling: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let currentVelocity = 0;
    let targetVelocity = 0;
    let currentDir = 1;
    let animFrameId: number;

    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const currentScrollY = window.scrollY;
      const dy = currentScrollY - lastScrollY;

      if (Math.abs(dy) > 0.5) {
        currentDir = dy > 0 ? 1 : -1;
      }

      const v = Math.abs(dy) / dt; // pixels per ms
      targetVelocity = Math.min(v * 1.5, 4.0); // Capped normalized velocity

      lastScrollY = currentScrollY;
      lastTime = now;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Smooth decay loop
    const updateLoop = () => {
      // Lerp velocity toward 0
      currentVelocity += (targetVelocity - currentVelocity) * 0.12;
      targetVelocity *= 0.88; // decay target

      if (currentVelocity < 0.005) {
        currentVelocity = 0;
      }

      const isFast = currentVelocity > 0.8;
      const root = document.documentElement;

      // Update CSS custom properties for global CSS velocity reactions
      root.style.setProperty("--scroll-velocity", currentVelocity.toFixed(3));
      root.style.setProperty("--scroll-dir", currentDir.toString());
      root.style.setProperty(
        "--scroll-stretch",
        (1 + Math.min(currentVelocity * 0.04, 0.12)).toFixed(3)
      );

      // Only re-render React state when there is a significant delta to prevent React thrashing
      const last = stateRef.current;
      if (
        Math.abs(last.velocity - currentVelocity) > 0.08 ||
        last.direction !== currentDir ||
        last.isFastScrolling !== isFast
      ) {
        const nextState = {
          velocity: currentVelocity,
          rawVelocity: currentVelocity * 1000,
          direction: currentDir,
          isFastScrolling: isFast,
        };
        stateRef.current = nextState;
        setVelocityState(nextState);
      }

      animFrameId = requestAnimationFrame(updateLoop);
    };

    animFrameId = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <ScrollVelocityContext.Provider value={velocityState}>
      {children}
    </ScrollVelocityContext.Provider>
  );
}
