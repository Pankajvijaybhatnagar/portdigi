/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: "#F5A623",
        "orange-dk": "#D4881A",
        "orange-lt": "rgba(245,166,35,0.1)",
        navy: "#1A1A5C",
        ink: "#111118",
        cloud: "#F6F6F8",
        silver: "#E4E4EE",
        muted: "#7A7A90",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        display: ["var(--font-jakarta)", "sans-serif"],
      },
      borderRadius: {
        lg2: "20px",
        md2: "14px",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.4", transform: "scale(1.5)" },
        },
        mscroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        spin2: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        blink: "blink 1.8s ease-in-out infinite",
        mscroll: "mscroll 26s linear infinite",
      },
    },
  },
  plugins: [],
};
