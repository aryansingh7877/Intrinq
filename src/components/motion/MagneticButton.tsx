"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface MagneticButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  textStrength?: number;
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.28,
  textStrength = 0.42,
  ...props
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouch || !buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(buttonRef.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: x * textStrength,
        y: y * textStrength,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (isTouch || !buttonRef.current) return;

    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: "elastic.out(1.1, 0.4)",
      overwrite: "auto",
    });

    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.65,
        ease: "elastic.out(1.1, 0.4)",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-magnetic="true"
      className={`inline-block cursor-pointer will-change-transform ${className}`}
      {...props}
    >
      <div ref={contentRef} className="will-change-transform">
        {children}
      </div>
    </div>
  );
}
