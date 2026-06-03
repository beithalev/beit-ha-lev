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
        // Deep navy — primary brand
        navy: {
          950: "#040d1a",
          900: "#071428",
          800: "#0d2040",
          700: "#112d58",
          600: "#163a70",
        },
        // Gold — accent
        gold: {
          300: "#f7d97a",
          400: "#f2c84a",
          500: "#e8b830",
          600: "#c99a1a",
        },
        // Warm cream — backgrounds / text
        cream: {
          50:  "#fdf8f0",
          100: "#f9f0df",
          200: "#f2e2c0",
        },
        // Parchment accent
        parchment: "#f5ead0",
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"],
        sans:  ["Inter", "system-ui", "sans-serif"],
        hebrew: ["SBL Hebrew", "Ezra SIL", "serif"],
      },
      backgroundImage: {
        "star-pattern": "radial-gradient(circle, rgba(242,200,74,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        "star-lg": "40px 40px",
      },
    },
  },
  plugins: [],
};
export default config;
