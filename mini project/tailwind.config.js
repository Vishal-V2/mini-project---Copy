/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.{html,js}",
    "./**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        prison: {
          blue: "#1e3a8a",
          dark: "#0f172a",
          light: "#e2e8f0",
          accent: "#3b82f6",
        },
      },
    },
  },
  plugins: [],
} 