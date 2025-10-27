/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}" // This line is crucial
  ],
  darkMode: 'class', // <--- THIS IS THE MOST IMPORTANT LINE
  theme: {
    extend: {},
  },
  plugins: [],
}