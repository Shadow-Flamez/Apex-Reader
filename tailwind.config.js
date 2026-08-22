/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0b0c10",
          surface: "#12141c",
          border: "#1f2330",
          hover: "#2a2e40",
        },
        accent: {
          DEFAULT: "#6366f1",
          glow: "#818cf8",
        },
      },
    },
  },
  plugins: [],
};