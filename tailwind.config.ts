import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta "hotel elegante": noche profunda + dorado + arena
        night: {
          50: "#f4f6fb",
          100: "#e7ebf5",
          200: "#c9d3e8",
          300: "#9aaccf",
          400: "#647db2",
          500: "#425d97",
          600: "#33487c",
          700: "#2a3b65",
          800: "#1f2b4a",
          900: "#16203a",
          950: "#0d1426",
        },
        gold: {
          50: "#fbf7ed",
          100: "#f5ecd0",
          200: "#ecd9a3",
          300: "#e1c06f",
          400: "#d8aa49",
          500: "#c8902f",
          600: "#ad7126",
          700: "#8c5422",
          800: "#744422",
          900: "#623a20",
        },
        sand: {
          50: "#faf8f4",
          100: "#f3efe6",
          200: "#e6dccb",
          300: "#d4c3a6",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(13, 20, 38, 0.08), 0 6px 24px -8px rgba(13, 20, 38, 0.12)",
        lift: "0 8px 30px -6px rgba(13, 20, 38, 0.18)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
