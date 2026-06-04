import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#06080f",
          900: "#090d18",
          800: "#0d1525",
          700: "#111e35",
          600: "#172847",
        },
        gold: {
          200: "#fdeea8",
          300: "#f7d97a",
          400: "#f2c84a",
          500: "#e8b830",
          600: "#c99a1a",
        },
        amber: {
          glow: "#f59e2a",
        },
        cream: {
          50:  "#fdf6e8",
          100: "#f9edcf",
          200: "#f2dfa8",
        },
        wine: {
          800: "#5c0f1e",
          700: "#7a1428",
          600: "#991b35",
        },
        parchment: "#f0e0b8",
      },
      fontFamily: {
        sans:    ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        serif:   ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        hebrew:  ["SBL Hebrew", "Ezra SIL", "serif"],
        display: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "star-pattern":   "radial-gradient(circle, rgba(242,200,74,0.07) 1px, transparent 1px)",
        "gold-radial":    "radial-gradient(ellipse at center, rgba(242,200,74,0.12) 0%, transparent 70%)",
        "candle-glow":    "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(245,158,42,0.2) 0%, transparent 70%)",
        "hero-gradient":  "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(20,40,90,0.9) 0%, transparent 60%)",
      },
      backgroundSize: {
        "star-lg": "44px 44px",
      },
      boxShadow: {
        "gold-sm":   "0 0 12px rgba(242,200,74,0.15)",
        "gold":      "0 0 24px rgba(242,200,74,0.25)",
        "gold-lg":   "0 0 48px rgba(242,200,74,0.35)",
        "amber-glow":"0 0 60px rgba(245,158,42,0.15)",
        "card":      "0 4px 24px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.04)",
        "inset-top": "inset 0 1px 0 rgba(255,255,255,0.06)",
      },
      animation: {
        "fade-in":     "fadeIn 0.6s ease forwards",
        "slide-up":    "slideUp 0.7s ease forwards",
        "glow-pulse":  "glowPulse 4s ease-in-out infinite",
        "float":       "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: "0" },                                     to: { opacity: "1" } },
        slideUp:   { from: { opacity: "0", transform: "translateY(24px)" },      to: { opacity: "1", transform: "translateY(0)" } },
        glowPulse: { "0%,100%": { opacity: "0.4" },                              "50%": { opacity: "0.9" } },
        float:     { "0%,100%": { transform: "translateY(0px)" },                "50%": { transform: "translateY(-8px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
