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
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#1B365D",
          600: "#132742",
          700: "#0C1B2E",
        },
        khmer: {
          red: "#D62828",
          blue: "#003049",
          gold: "#F77F00",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
