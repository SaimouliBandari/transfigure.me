/** @type {import('tailwindcss').Config} */
export default {
  content: ['*.html', 
    './src/**/*.{html,tsx}',],
  theme: {
    extend: {
      colors: {
        'primary': '#1D4ED8'
      }
    },
  },
  plugins: [],
}

