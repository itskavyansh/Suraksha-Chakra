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
          900: '#0B3D2A',
          700: '#0F5C3A',
          500: '#2E9E6B',
          100: '#E3F4EA',
        },
        danger: {
          700: '#C62828',
          100: '#FDECEA',
        },
        warn: {
          500: '#F2A93B',
        },
        info: {
          600: '#1E6FD9',
          100: '#E6F0FD',
        },
        purple: {
          600: '#6B4FD8',
          100: '#EEEAFB',
        },
        orange: {
          500: '#F08A4B',
          100: '#FDEEE3',
        },
        ink: {
          900: '#1A2420',
          500: '#5C6B64',
          100: '#EEF1EF',
        },
        surface: '#F7FAF8',
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        'xl': '0.75rem',
      },
      boxShadow: {
        'card': '0 2px 8px -2px rgba(11, 61, 42, 0.08), 0 1px 4px -1px rgba(11, 61, 42, 0.04)',
        'phone': '0 0 25px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
