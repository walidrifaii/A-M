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
          50: '#f6f7f2',
          100: '#eceee5',
          200: '#d9ddcb',
          300: '#c6ccb1',
          400: '#b3bb97',
          500: '#2f3020',
          600: '#2a2b1d',
          700: '#25261a',
          800: '#1f2015',
          900: '#1a1a11',
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
