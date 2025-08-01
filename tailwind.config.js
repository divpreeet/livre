/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.svelte",
    "./src/**/*.html",
    "./src/**/*.js",
    "./src/**/*.ts"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Noto Sans'", "sans-serif"]
      },
      borderRadius: {
        "xl-2": "1.5rem"
      },
      colors: {
        gutter: "#1f1f1f"
      }
    }
  },
  plugins: []
};
