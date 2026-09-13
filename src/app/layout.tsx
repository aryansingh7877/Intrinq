import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "IntrinsQ | Strategic Financial Advice That Compounds",
  description:
    "AI handles the routine. We handle the decisions that shape your business — clarity, strategy, and discipline from a single advisory partner.",
  icons: {
    icon: "/intrinsq_logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#060B11",
};

import SmoothScroll from "@/components/motion/SmoothScroll";
import ScrollVelocityManager from "@/components/motion/ScrollVelocityManager";
import WebGLWorld from "@/components/motion/WebGLWorld";
import CinematicLoader from "@/components/motion/CinematicLoader";
import MagneticCursor from "@/components/motion/MagneticCursor";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#060B11] text-[#F7F4EE] antialiased selection:bg-gold-500/30 selection:text-white overflow-x-hidden">
        <SmoothScroll>
          <ScrollVelocityManager>
            {/* 1. Global WebGL World Background Canvas */}
            <WebGLWorld />

            {/* 2. AAA Game Boot Cinematic Loader Sequence */}
            <CinematicLoader />

            {/* 3. Luxury Precision Magnetic Cursor */}
            <MagneticCursor />

            {/* 4. Core Website Content Hierarchy */}
            <div className="relative z-10 w-full min-h-screen">
              {children}
            </div>
          </ScrollVelocityManager>
        </SmoothScroll>
      </body>
    </html>
  );
}
