/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          950: '#0B132B',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
        },
        seafoam: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        sand: {
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
        },
        coral: {
          400: '#FB7185',
          500: '#F43F5E',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
