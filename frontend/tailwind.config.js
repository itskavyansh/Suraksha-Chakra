/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand greens
        'brand-900': '#0B3D2A',
        'brand-700': '#0F5C3A',
        'brand-500': '#2E9E6B',
        'brand-100': '#E3F4EA',
        // Danger reds
        'danger-700': '#C62828',
        'danger-100': '#FDECEA',
        // Warning amber
        'warn-500': '#F2A93B',
        // Info blues
        'info-600': '#1E6FD9',
        'info-100': '#E6F0FD',
        // Purple
        'purple-600': '#6B4FD8',
        'purple-100': '#EEEAFB',
        // Orange
        'orange-500': '#F08A4B',
        'orange-100': '#FDEEE3',
        // Ink (text/neutral)
        'ink-900': '#1A2420',
        'ink-500': '#5C6B64',
        'ink-100': '#EEF1EF',
        // Surface
        'surface': '#F7FAF8',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 4px 0 rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)',
      },
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInDown: 'fadeInDown 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
