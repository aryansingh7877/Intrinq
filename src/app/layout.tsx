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

import dynamic from "next/dynamic";
import SmoothScroll from "@/components/motion/SmoothScroll";

const WebGLWorld = dynamic(() => import("@/components/motion/WebGLWorld"), {
  ssr: false,
});

const MagneticCursor = dynamic(() => import("@/components/motion/MagneticCursor"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#060B11] text-[#F7F4EE] antialiased selection:bg-gold-500/30 selection:text-white overflow-x-hidden">
        <SmoothScroll>
            {/* 1. Global WebGL World Background Canvas */}
            <WebGLWorld />

            {/* 2. Luxury Precision Magnetic Cursor */}
            <MagneticCursor />

            {/* 3. Core Website Content Hierarchy */}
            <div className="relative z-10 w-full min-h-screen">
              {children}
            </div>
        </SmoothScroll>
      </body>
    </html>
  );
}
