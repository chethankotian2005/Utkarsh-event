import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-dm-sans)", "DM Sans", "sans-serif"],
        mono: ["var(--font-space-mono)", "Space Mono", "monospace"],
      },
      colors: {
        gold: "#C9A84C",
        "gold-light": "#FFD700",
        "gold-dark": "#B8860B",
        black: "#000000",
        "card-black": "#0a0a0a",
      },
    },
  },
  plugins: [],
};
export default config;
