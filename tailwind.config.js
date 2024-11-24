/** @type {import('tailwindcss').Config} */
export default {
  content: ["*.html", "./src/**/*.{html,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': "var(--blue-1)",
        'background': 'var(--blue-1)',
        'background-2': 'var(--blue-2)',
        'interactive-1': 'var(--blue-3)',
        'interactive-2': 'var(--blue-4)',
        'interactive-3': 'var(--blue-5)',
        'border-1':'var(--blue-6)',
        'border-2':'var(--blue-7)' ,
        'border-3':'var(--blue-8)' ,
        'border-g1':'var(--gray-6)',
        'border-g2':'var(--gray-7)' ,
        'border-g3':'var(--gray-8)' ,
        'solid-1': 'var(--blue-9)',
        'solid-2': 'var(--blue-10)',
        'text-1': 'var(--blue-11)',
        'text-2': 'var(--blue-12)',
        'text-g1': 'var(--grey-11)',
        'text-g2': 'var(--grey-12)',
        'surface': 'var(--blue-surface)',
        'indicator': 'var(--blue-indicator)',
        'track':'var(--blue-track)',
        'contrast': 'var(--blue-contrast)'

      },
      backgroundColor: {
        "primary-1": "var(--blue-1)",
        "primary-2": "var(--blue-2)",
        "secondary-1": "var(--gray-a1)",
        "secondary-2": "var(--gray-a2)",
      },
    },
  },
  plugins: [],
};
