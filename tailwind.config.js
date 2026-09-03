/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4f4fe',
          100: '#eceefe',
          200: '#dcdffc',
          300: '#c0c5fa',
          400: '#9ea3f6',
          500: '#7e7ff0',
          600: '#5e6cf5',
          700: '#4c4ce0',
          800: '#3e3db8',
          900: '#353592',
          950: '#202055',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
