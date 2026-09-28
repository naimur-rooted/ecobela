import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#faecd8",
          200: "#f5d5ac",
          300: "#edb878",
          400: "#e49444",
          500: "#dc7a22",
          600: "#cd6018",
          700: "#aa4716",
          800: "#883919",
          900: "#6e3019",
          950: "#3c160a",
        },
        maroon: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d2da",
          300: "#f4adbf",
          400: "#ec7f9b",
          500: "#e05279",
          600: "#cc3060",
          700: "#ac2151",
          800: "#8b1d41",
          900: "#781939",
          950: "#440a1f",
        },
        clay: {
          50: "#faf7f2",
          100: "#f3ece1",
          200: "#e6d8c3",
          300: "#d5bd9b",
          400: "#c19b70",
          500: "#b08355",
          600: "#9a6c46",
          700: "#7f563b",
          800: "#684734",
          900: "#573c2e",
        },
        ink: {
          50: "#f6f7f7",
          100: "#e3e6e6",
          200: "#c6cccc",
          300: "#a1aaa9",
          400: "#7b8685",
          500: "#606b6a",
          600: "#4b5554",
          700: "#3e4645",
          800: "#343a39",
          900: "#1e2322",
          950: "#121615",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,22,21,0.04), 0 8px 24px -12px rgba(18,22,21,0.18)",
        "card-hover": "0 4px 6px rgba(18,22,21,0.06), 0 16px 32px -8px rgba(18,22,21,0.22)",
        glow: "0 0 0 3px rgba(220,122,34,0.2)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
        "fade-in": "fade-in 0.3s ease-out both",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 1.5s infinite",
      },
      backgroundImage: {
        "shimmer-gradient": "linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.4) 50%, transparent 75%)",
      },
    },
  },
  plugins: [],
};

export default config;
