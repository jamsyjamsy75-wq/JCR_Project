import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        night: "#050505",
        obsidian: "#111111",
        neon: {
          pink: "#ff2d95",
          glow: "#ff6ec7",
        },
        slate: {
          850: "#1d1d1f",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "Bebas Neue", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "Inter var", "system-ui"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(255, 45, 149, 0.45)",
      },
      backgroundImage: {
        grid: "linear-gradient(135deg, rgba(255,45,149,0.05) 25%, transparent 25%), linear-gradient(225deg, rgba(255,45,149,0.05) 25%, transparent 25%), linear-gradient(45deg, rgba(255,45,149,0.05) 25%, transparent 25%), linear-gradient(315deg, rgba(255,45,149,0.05) 25%, rgba(0,0,0,0) 25%)",
      },
    },
  },
  plugins: [typography],
};

export default config;

