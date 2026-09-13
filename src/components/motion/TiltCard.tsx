"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glare?: boolean;
  glareColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 7,
  glare = true,
  glareColor = "rgba(200, 154, 61, 0.45)",
  ...props
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      scale: 1.015,
      transformPerspective: 1000,
      transformOrigin: "center center",
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (glare && glareRef.current) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      gsap.to(glareRef.current, {
        opacity: 0.3,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, ${glareColor} 0%, transparent 65%)`,
        duration: 0.2,
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (isTouch || !cardRef.current) return;

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
      overwrite: "auto",
    });

    if (glare && glareRef.current) {
      gsap.to(glareRef.current, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative transform-gpu will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d" }}
      {...props}
    >
      {/* Specular Cursor Glare Layer */}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[inherit] opacity-0 transition-opacity duration-300 z-30 mix-blend-screen"
        />
      )}
      {children}
    </div>
  );
}
