/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light & inviting beachy coastal aqua & teal palette
        bluey: {
          50: '#F0FAFA',
          100: '#E0F7F5',
          200: '#B2EBF2',
          300: '#80DEEA',
          400: '#4DD0E1',
          500: '#00ACC1',
          600: '#00897B',
          700: '#00695C',
          800: '#1F4E5B',
          900: '#0F3440',
          950: '#061B24',
        },
        seafoam: {
          400: '#2ea394ff',
          500: '#14B8A6',
          600: '#0D9488',
        },
        // Pastel pink seashell palette
        seashell: {
          50: '#FFF5F7',
          100: '#FFF0F3',
          200: '#FFE4E8',
          300: '#F8B4C4',
          400: '#E88C9E',
          500: '#D45B73',
        },
        // Darker brown otter fur colors
        otter: {
          light: '#E2C4A8',
          main: '#653B22',
          dark: '#4A2511',
          shadow: '#261105',
        },
        // Legacy aliases — existing components use these names directly
        ocean: { 950: '#061B24', 900: '#0F3440', 800: '#1F4E5B', 700: '#00695C' },
        seafoam: { 300: '#80DEEA', 400: '#4DD0E1', 500: '#00ACC1', 600: '#00897B' },
        sand: { 100: '#FDF6E2', 200: '#F7E7C4', 300: '#EAD5A0' },
        coral: { 400: '#F8B4C4', 500: '#E88C9E' }
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
