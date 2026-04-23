/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#e9d234',
        'primary-light': '#f1e874',
        brand: '#221407',
        muted: '#837870',
        surface: '#f3eae8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(34,20,7,0.06), 0 4px 16px 0 rgba(34,20,7,0.04)',
        modal: '0 20px 60px -10px rgba(34,20,7,0.25)',
      },
    },
  },
  plugins: [],
}
