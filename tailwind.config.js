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
        // Warm sun-baked beach sand & cream accents
        cream: {
          50: '#FFFDF9',
          100: '#FDF6E2',
          200: '#F7E7C4',
          300: '#EAD5A0',
          400: '#D6BA7A',
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
        // Legacy aliases
        ocean: { 950: '#061B24', 900: '#0F3440', 800: '#1F4E5B', 700: '#00695C' },
        seafoam: { 300: '#80DEEA', 400: '#4DD0E1', 500: '#00ACC1', 600: '#00897B' },
        sand: { 100: '#FDF6E2', 200: '#F7E7C4', 300: '#EAD5A0' },
        coral: { 400: '#F8B4C4', 500: '#E88C9E' },

        // Watercolor hero-illustration palette (sampled from portada.png) —
        // softer & lower-contrast than the `bluey` set above. Basis for the
        // wider site remake, see design_sessions/ocean-otter-theme-notes.md.
        lagoon: {
          50: '#F7FBFE',
          100: '#E9F4FC',
          200: '#C5E3F8',
          300: '#B7DDF9',
          400: '#9AC9EE',
          500: '#6FA8D6',
          600: '#5D93AE',
          700: '#4A7690',
          800: '#365667',
          900: '#243A45',
          950: '#16262E',
        },
        blush: { 100: '#FEF8F7', 200: '#FCE7E9', 300: '#F6D2D6' },
        dune: { 100: '#FBEAD3', 200: '#F0C896', 300: '#E7BE8D', 400: '#D9A76A', 500: '#C7B699' },
        otterfur: { 100: '#F0D2B4', 200: '#D9AE86', 300: '#B3896E', 400: '#AF6C4E', 500: '#8B5A3C' },
        foliage: { 300: '#C6BE95', 400: '#A89B6E', 500: '#7E7B51', 600: '#5E6139' },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Manrope', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        bookPageLeft: {
          '0%': { transform: 'perspective(1500px) rotateY(90deg)', opacity: '0' },
          '100%': { transform: 'perspective(1500px) rotateY(0deg)', opacity: '1' },
        },
        bookPageRight: {
          '0%': { transform: 'perspective(1500px) rotateY(-90deg)', opacity: '0' },
          '100%': { transform: 'perspective(1500px) rotateY(0deg)', opacity: '1' },
        },
      },
      animation: {
        'book-page-left': 'bookPageLeft 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        'book-page-right': 'bookPageRight 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
      }
    },
  },
  plugins: [],
}
