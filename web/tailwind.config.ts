import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          950: "#011c15",
          900: "#01281e",
          800: "#013326",
          700: "#0a4636",
          600: "#0f5d49",
          500: "#167960",
        },
        mint: {
          50: "#eafaf4",
          100: "#cbf5e4",
          200: "#9cf0ce",
          400: "#2ee5a8",
          500: "#15c089",
          600: "#10a374",
          700: "#0c835c",
        },
        surface: {
          50: "#f6faf8",
          100: "#eff5f2",
          200: "#e2eae5",
          300: "#cad6cf",
        },
      },
      boxShadow: {
        card: "0 1px 3px rgba(1, 51, 38, 0.05), 0 1px 2px rgba(1, 51, 38, 0.03)",
        hover: "0 12px 32px -8px rgba(1, 51, 38, 0.12), 0 4px 12px -2px rgba(1, 51, 38, 0.06)",
        elegant: "0 10px 40px -10px rgba(1, 51, 38, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
