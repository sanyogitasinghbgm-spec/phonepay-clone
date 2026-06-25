/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5F259F',
          dark: '#3D1766',
          light: '#7B3FB5',
          accent: '#FFC300',
        },
        ink: '#1A1A2E',
        surface: '#F7F5FB',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 8px 24px -8px rgba(95, 37, 159, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
