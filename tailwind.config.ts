import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 奶油白／奶茶色主題
        "cream-bg": "#FBF3E7",
        "cream-bg-light": "#F3E4CC",
        "cream-card": "#FFFDF8",
        "cream-border": "#EAD9C0",
        milktea: "#B08968",
        "milktea-dark": "#8C6A4E",
        matcha: "#7C9473",
        // 首頁強調色
        "warm-bg": "#FFFBEB",
        "brand-orange": "#FB923C",
        "brand-orange-dark": "#EA7C1C",
        "brand-green": "#10B981",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
