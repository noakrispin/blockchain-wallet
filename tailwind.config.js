/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        purple: {
          400: '#9333EA',  // Adjusted to match the design
        },
        blue: {
          400: '#60A5FA',  // Adjusted to match the design
        }
      }
    },
  },
  plugins: [],
}

