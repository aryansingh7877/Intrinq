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
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();

    let currentHeader = false;
    let currentNavy = false;
    let currentNav = "";
    let ticking = false;

    const updateNavState = () => {
      checkMobile();
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
      if (shouldBeHeader !== currentHeader) {
        currentHeader = shouldBeHeader;
        setIsHeader(shouldBeHeader);
      }

      const isDiffNavy = diffSection ? (diffSection.getBoundingClientRect().top <= 90 && diffSection.getBoundingClientRect().bottom >= 80) : false;
      const isArenaNavy = arenaSection ? (arenaSection.getBoundingClientRect().top <= 90 && arenaSection.getBoundingClientRect().bottom >= 80) : false;
      const isWhoNavy = whoSection ? (whoSection.getBoundingClientRect().top <= 90 && whoSection.getBoundingClientRect().bottom >= 80) : false;
      const shouldBeNavy = isDiffNavy || isArenaNavy || isWhoNavy;
      if (shouldBeNavy !== currentNavy) {
        currentNavy = shouldBeNavy;
        setIsNavyHeader(shouldBeNavy);
      }

      // Track active section for navbar indicator
      let nextNav = "";
      if (contactSection && contactSection.getBoundingClientRect().top <= window.innerHeight * 0.6) {
        nextNav = "Contact";
      } else if (blogSection) {
        const blogRect = blogSection.getBoundingClientRect();
        if (blogRect.top <= window.innerHeight * 0.5 && blogRect.bottom >= 100) nextNav = "Our Blog";
      }
      if (!nextNav && servicesSection) {
        const servRect = servicesSection.getBoundingClientRect();
        if (servRect.top <= window.innerHeight * 0.5 && servRect.bottom >= 100) nextNav = "Services";
      }
      if (!nextNav && diffSection) {
        const diffRect = diffSection.getBoundingClientRect();
        if (diffRect.top <= window.innerHeight * 0.5 && diffRect.bottom >= 100) nextNav = "Our Approach";
      }
      if (!nextNav && aboutSection) {
        if (aboutRect.top <= window.innerHeight * 0.5 && aboutRect.bottom >= 100) nextNav = "About";
      }
      if (window.scrollY < 400) {
        nextNav = "";
      }

      if (nextNav !== currentNav) {
        currentNav = nextNav;
        setActiveNav(nextNav);
      }
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateNavState();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateNavState();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  // Lock body scroll and support Escape key when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileMenuOpen]);

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

  // Logo selection: light logo on dark backgrounds (Hero, navy sections), dark logo on light sections
  const isLightSection = isHeader && !isNavyHeader;
  const logoSrc = isLightSection ? "/intrinsq_logo.png" : "/intrinsq_logo_white.png";

  return (
    <>
      {/* Click-away backdrop overlay covering full viewport */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-md z-40 md:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 md:px-8 pointer-events-none flex justify-center pt-[max(env(safe-area-inset-top,0px),8px)] md:pt-0">
        <nav
          aria-label="Primary navigation"
          style={{
            transform: !isMounted
              ? "translateY(0px)"
              : isMobile
              ? "translateY(0px)"
              : isHeader
              ? "translateY(16px)"
              : "translateY(calc(100vh - 84px))",
          }}
          className={`pointer-events-auto relative w-full flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-md:!translate-y-0 ${
            isLightSection
              ? "max-w-7xl bg-[#F5F1E8]/95 backdrop-blur-2xl border border-[#071A33]/12 rounded-2xl py-2.5 sm:py-3 px-4 sm:px-7 md:px-8 shadow-[0_12px_36px_rgba(7,26,51,0.08)] text-[#071A33]"
              : isHeader && isNavyHeader
              ? "max-w-7xl bg-[#071A33]/92 backdrop-blur-2xl border border-white/10 rounded-2xl py-2.5 sm:py-3 px-4 sm:px-7 md:px-8 shadow-[0_16px_40px_rgba(0,0,0,0.5)] text-[#F4EFE5]"
              : "max-w-5xl bg-[#090E16]/85 backdrop-blur-2xl border border-white/[0.12] rounded-2xl md:rounded-full py-2.5 sm:py-3 px-4 sm:px-7 md:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] text-[#F7F4EE]"
          } ${!isMounted ? "opacity-0" : "opacity-100"}`}
        >
          {/* Top subtle highlight reflection line */}
          <div
            className={`absolute inset-x-8 top-0 h-[1px] pointer-events-none transition-opacity duration-500 ${
              isLightSection
                ? "bg-gradient-to-r from-transparent via-[#071A33]/10 to-transparent"
                : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
            }`}
          />

          {/* Left: Logo & Navigation Links */}
          <div className="flex items-center">
            {/* IntrinsQ Logo — persistent on mobile, morphs smoothly on desktop */}
            <div
              className={`flex items-center shrink-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isHeader || isMobile
                  ? "w-28 sm:w-32 opacity-100 mr-3 sm:mr-6 md:mr-8"
                  : "w-0 opacity-0 mr-0"
              }`}
            >
              <a
                href="#"
                onClick={handleLogoClick}
                className="relative h-7 sm:h-8 md:h-9 w-28 sm:w-32 block shrink-0 cursor-pointer"
              >
                <Image
                  src={logoSrc}
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
                          ? isLightSection
                            ? "text-[#C89A3D] font-semibold"
                            : "text-gold-200 font-medium"
                          : isLightSection
                          ? "text-[#071A33]/70 hover:text-[#071A33]"
                          : "text-ivory-200/70 hover:text-ivory-50"
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && (
                        <span
                          className={`absolute bottom-0 left-0 w-full h-[1.5px] rounded-full ${
                            isLightSection
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
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href="https://cal.com/intrinsq"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-[13px] font-medium tracking-wide transition-all duration-500 shadow-sm cursor-pointer ${
                isLightSection
                  ? "bg-[#071A33] text-[#F5F1E8] hover:bg-[#0A1D38] hover:shadow-md"
                  : isHeader && isNavyHeader
                  ? "bg-[#F4EFE5] text-[#071A33] hover:bg-white hover:shadow-md"
                  : "bg-gradient-to-r from-white/[0.08] to-white/[0.03] hover:from-gold-500/25 hover:to-gold-600/15 border border-white/[0.15] hover:border-gold-400/50 text-ivory-100"
              }`}
            >
              <span className="hidden sm:inline">Book a Consultation</span>
              <span className="sm:hidden">Consult</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C89A3D] group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden p-2 rounded-full border transition-colors ${
                isLightSection
                  ? "border-[#071A33]/20 text-[#071A33] hover:bg-[#071A33]/5"
                  : "border-white/20 text-[#F4EFE5] hover:bg-white/10"
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Dropdown Card */}
          {mobileMenuOpen && (
            <div
              style={{
                backgroundColor: isLightSection ? "#F5F1E8" : "#090E16",
              }}
              className={`md:hidden absolute top-full left-0 right-0 mt-3 p-5 rounded-2xl border shadow-[0_24px_60px_rgba(0,0,0,0.85)] transition-all duration-300 z-50 pointer-events-auto ${
                isLightSection
                  ? "border-[#071A33]/15 text-[#071A33]"
                  : "border-white/20 text-[#F7F4EE]"
              }`}
            >
              <ul className="flex flex-col space-y-1.5 font-sans text-sm tracking-wide">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeNav === item.name;
                  return (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        onClick={(e) => handleNavClick(e, item.href, item.name)}
                        className={`flex items-center justify-between py-2.5 px-3.5 rounded-xl transition-colors min-h-[44px] ${
                          isActive
                            ? "text-[#C89A3D] font-semibold bg-[#C89A3D]/10"
                            : isLightSection
                            ? "text-[#071A33]/85 hover:text-[#071A33] hover:bg-[#071A33]/5"
                            : "text-ivory-200/85 hover:text-ivory-50 hover:bg-white/5"
                        }`}
                      >
                        <span>{item.name}</span>
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#C89A3D]" />}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Dedicated Mobile Menu CTA */}
              <div className="mt-4 pt-3.5 border-t border-current/10 flex flex-col gap-2.5">
                <a
                  href="https://cal.com/intrinsq"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#C89A3D] to-[#E5BE6C] text-[#071A33] font-sans font-semibold text-xs tracking-wider uppercase shadow-md active:scale-[0.98] transition-transform"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#071A33]" />
                </a>
                <p className="text-[11px] italic font-serif text-center opacity-65 tracking-wide">
                  Discipline today. Freedom tomorrow.
                </p>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
