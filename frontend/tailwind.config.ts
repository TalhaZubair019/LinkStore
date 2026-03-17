import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages*.{js,ts,jsx,tsx,mdx}",
    "./src/components*.{js,ts,jsx,tsx,mdx}",
    "./src/app*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#1E293B",
        accent: "#F59E0B",
        light: "#F8FAFC",
        brandPink: '#ff6b6b',
        brandPurple: '#6366f1',
        brandTeal: '#06b6d4',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1280px",
        },
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
