import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#fdfbf7",
        pencil: "#2d2d2d",
        accent: "#ff4d4d",
        ink: "#2d5da1",
        muted: "#e5e0d8",
        postit: "#fff9c4",
      },
      fontFamily: {
        heading: ["Kalam", "cursive"],
        body: ["Patrick Hand", "cursive"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #2d2d2d",
        "hard-sm": "3px 3px 0px 0px rgba(45, 45, 45, 0.1)",
        "hard-hover": "2px 2px 0px 0px #2d2d2d",
        "hard-lg": "8px 8px 0px 0px #2d2d2d",
      },
    },
  },
  plugins: [],
};
export default config;
