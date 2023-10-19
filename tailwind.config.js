/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Roboto", "ui-sans-serif", "sans-serif"] },
      screens: {
        xs: "400px",
      },
    },
  },
  plugins: [],
};
