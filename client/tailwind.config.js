/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
  extend: {
    colors: {
      primary: "#6366F1",       // indigo-500 refined
      primarySoft: "#EEF2FF",   // indigo-50
      lavender: "#EDE9FE",      // violet-100
      surface: "#FFFFFF",
      surfaceSoft: "#F8FAFF",
      textMain: "#1E293B",      // slate-800
      textMuted: "#64748B",     // slate-500
    },
    boxShadow: {
      soft: "0 20px 40px rgba(99,102,241,0.15)",
      card: "0 10px 30px rgba(15,23,42,0.08)",
      glow: "0 0 0 4px rgba(99,102,241,0.15)",
    },
    borderRadius: {
      xl: "1.25rem",
      "2xl": "1.75rem",
      "3xl": "2.25rem",
    },
  },
},

  plugins: [require("daisyui")],
};
