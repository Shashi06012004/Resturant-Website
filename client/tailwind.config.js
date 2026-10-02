/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0D0B0A',
          card: '#161210',
          cardHover: '#1E1815',
          border: '#2E241F',
          gold: '#F59E0B',
          goldHover: '#D97706',
          goldLight: '#FBBF24',
          ivory: '#FFFBEB',
          muted: '#A8A29E',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 4px 20px -2px rgba(245, 158, 11, 0.25)',
        goldGlow: '0 0 25px rgba(245, 158, 11, 0.4)',
      },
    },
  },
  plugins: [],
};
