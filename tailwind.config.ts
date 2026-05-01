// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8f0",
          100: "#e8eedd",
          200: "#d1ddbf",
          300: "#b4ca96",
          400: "#7d9654",
          500: "#445f21",
          600: "#385119",
          700: "#2d4215",
          800: "#243611",
          900: "#1a280d",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
