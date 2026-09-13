import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#05090E",
          900: "#070D14",
          850: "#0A121C",
          800: "#0E1825",
          700: "#162438",
        },
        gold: {
          100: "#FAF4E5",
          200: "#F3E7C4",
          300: "#E6D195",
          400: "#D6B86C",
          500: "#C5A059",
          600: "#B08A42",
          700: "#8C6A2A",
        },
        ivory: {
          50: "#FCFAF7",
          100: "#F7F4EE",
          200: "#EDE7DC",
          300: "#DFD6C5",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3E7C4 0%, #C5A059 50%, #9E7B3B 100%)",
        "gold-shimmer": "linear-gradient(90deg, #C5A059 0%, #FFF3D6 50%, #C5A059 100%)",
        "radial-amber": "radial-gradient(ellipse at center, rgba(197, 160, 89, 0.15) 0%, transparent 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
