"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { useLenis } from "@/components/motion/SmoothScroll";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Our Approach", href: "#approach" },
  { name: "Our Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
];

export default function MorphingNavbar() {
  const { lenis } = useLenis();
  const [isHeader, setIsHeader] = useState(false);
  const [isNavyHeader, setIsNavyHeader] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateNavState = () => {
      const aboutSection = document.getElementById("about") || document.getElementById("modern-business");
      const diffSection = document.getElementById("approach") || document.getElementById("difference");
      const arenaSection = document.getElementById("decision-arena");
      const whoSection = document.getElementById("who-we-work-with");
      const servicesSection = document.getElementById("services");
      const blogSection = document.getElementById("blog");
      const contactSection = document.getElementById("contact");
      if (!aboutSection) return;

      const aboutRect = aboutSection.getBoundingClientRect();
      const shouldBeHeader = aboutRect.top <= window.innerHeight * 0.75;
      setIsHeader(shouldBeHeader);

      const isDiffNavy = diffSection ? (diffSection.getBoundingClientRect().top <= 90 && diffSection.getBoundingClientRect().bottom >= 80) : false;
      const isArenaNavy = arenaSection ? (arenaSection.getBoundingClientRect().top <= 90 && arenaSection.getBoundingClientRect().bottom >= 80) : false;
      const isWhoNavy = whoSection ? (whoSection.getBoundingClientRect().top <= 90 && whoSection.getBoundingClientRect().bottom >= 80) : false;
      setIsNavyHeader(isDiffNavy || isArenaNavy || isWhoNavy);

      // Track active section for navbar indicator
      if (contactSection) {
        const contactRect = contactSection.getBoundingClientRect();
        if (contactRect.top <= window.innerHeight * 0.6) {
          setActiveNav("Contact");
          return;
        }
      }

      if (blogSection) {
        const blogRect = blogSection.getBoundingClientRect();
        if (blogRect.top <= window.innerHeight * 0.5 && blogRect.bottom >= 100) {
          setActiveNav("Our Blog");
          return;
        }
      }

      if (servicesSection) {
        const servRect = servicesSection.getBoundingClientRect();
        if (servRect.top <= window.innerHeight * 0.5 && servRect.bottom >= 100) {
          setActiveNav("Services");
          return;
        }
      }

      if (diffSection) {
        const diffRect = diffSection.getBoundingClientRect();
        if (diffRect.top <= window.innerHeight * 0.5 && diffRect.bottom >= 100) {
          setActiveNav("Our Approach");
          return;
        }
      }

      if (aboutSection) {
        if (aboutRect.top <= window.innerHeight * 0.5 && aboutRect.bottom >= 100) {
          setActiveNav("About");
          return;
        }
      }

      if (window.scrollY < 400) {
        setActiveNav("");
      }
    };

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
    name: string
  ) => {
    e.preventDefault();
    setActiveNav(name);
    setMobileMenuOpen(false);

    if (lenis) {
      // Sections define scroll-mt-24 (96px); Lenis honors it for selector targets.
      // Supplying a second offset made every navigation stop too far into the section.
      lenis.scrollTo(href, { duration: 1.2 });
    } else {
      const target = document.querySelector(href);
      if (target) {
        const yOffset = -96;
        const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav("");
    setMobileMenuOpen(false);

    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 pointer-events-none flex justify-center">
      <nav
        aria-label="Primary morphing navigation"
        style={{
          transform: isHeader
            ? "translateY(16px)"
            : "translateY(calc(100vh - 84px))",
        }}
        className={`pointer-events-auto relative w-full flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isHeader
            ? isNavyHeader
              ? "max-w-7xl bg-[#071A33]/92 backdrop-blur-2xl border border-white/10 rounded-2xl py-3 px-6 sm:px-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)] text-[#F4EFE5]"
              : "max-w-7xl bg-[#F5F1E8]/95 backdrop-blur-2xl border border-[#071A33]/12 rounded-2xl py-3 px-6 sm:px-8 shadow-[0_12px_36px_rgba(7,26,51,0.08)] text-[#071A33]"
            : "max-w-5xl bg-[#090E16]/85 backdrop-blur-2xl border border-white/[0.12] rounded-full py-2.5 sm:py-3 px-5 sm:px-7 md:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-[#F7F4EE]"
        } ${!isMounted ? "opacity-0" : "opacity-100"}`}
      >
        {/* Top subtle highlight reflection line */}
        <div
          className={`absolute inset-x-8 top-0 h-[1px] pointer-events-none transition-opacity duration-500 ${
            isHeader && !isNavyHeader
              ? "bg-gradient-to-r from-transparent via-[#071A33]/10 to-transparent"
              : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
          }`}
        />

        {/* Left: Logo & Navigation Links */}
        <div className="flex items-center">
          {/* Official IntrinsQ Logo in Header State */}
          <div
            className={`flex items-center shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isHeader
                ? "w-28 sm:w-32 opacity-100 mr-4 sm:mr-8"
                : "w-0 opacity-0 mr-0"
            }`}
          >
            <a
              href="#"
              onClick={handleLogoClick}
              className="relative h-8 sm:h-9 w-28 sm:w-32 block shrink-0 cursor-pointer"
            >
              <Image
                src={isNavyHeader ? "/intrinsq_logo_white.png" : "/intrinsq_logo.png"}
                alt="IntrinsQ Logo"
                fill
                priority
                className="object-contain object-left"
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="hidden md:flex items-center space-x-6 lg:space-x-8 text-xs lg:text-[13px] font-sans tracking-wide">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.name;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.name)}
                    className={`relative py-1 transition-colors duration-200 cursor-pointer ${
                      isActive
                        ? isHeader && !isNavyHeader
                          ? "text-[#C89A3D] font-semibold"
                          : "text-gold-200 font-medium"
                        : isHeader && !isNavyHeader
                        ? "text-[#071A33]/70 hover:text-[#071A33]"
                        : "text-ivory-200/70 hover:text-ivory-50"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span
                        className={`absolute bottom-0 left-0 w-full h-[1.5px] rounded-full ${
                          isHeader && !isNavyHeader
                            ? "bg-[#C89A3D]"
                            : "bg-gradient-to-r from-gold-400 to-gold-200 shadow-[0_0_8px_rgba(197,160,89,0.8)]"
                        }`}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Book a Consultation CTA & Mobile Menu Toggle */}
        <div className="flex items-center space-x-3">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact", "Contact")}
            className={`group relative inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-500 shadow-sm cursor-pointer ${
              isHeader
                ? isNavyHeader
                  ? "bg-[#F4EFE5] text-[#071A33] hover:bg-white hover:shadow-md"
                  : "bg-[#071A33] text-[#F5F1E8] hover:bg-[#0A1D38] hover:shadow-md"
                : "bg-gradient-to-r from-white/[0.08] to-white/[0.03] hover:from-gold-500/25 hover:to-gold-600/15 border border-white/[0.15] hover:border-gold-400/50 text-ivory-100"
            }`}
          >
            <span>Book a Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#C89A3D] group-hover:translate-x-1 transition-transform duration-300" />
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-full border transition-colors ${
              isHeader && !isNavyHeader
                ? "border-[#071A33]/20 text-[#071A33] hover:bg-[#071A33]/5"
                : "border-white/20 text-[#F4EFE5] hover:bg-white/10"
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            className={`md:hidden absolute top-full left-0 right-0 mt-3 p-5 rounded-2xl border backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
              isHeader && !isNavyHeader
                ? "bg-[#F5F1E8]/98 border-[#071A33]/15 text-[#071A33]"
                : "bg-[#090E16]/95 border-white/15 text-[#F7F4EE]"
            }`}
          >
            <ul className="flex flex-col space-y-4 font-sans text-sm tracking-wide">
              {NAV_ITEMS.map((item) => {
                const isActive = activeNav === item.name;
                return (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      onClick={(e) => handleNavClick(e, item.href, item.name)}
                      className={`block py-1 transition-colors ${
                        isActive
                          ? "text-[#C89A3D] font-semibold"
                          : isHeader && !isNavyHeader
                          ? "text-[#071A33]/80 hover:text-[#071A33]"
                          : "text-ivory-200/80 hover:text-ivory-50"
                      }`}
                    >
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}
