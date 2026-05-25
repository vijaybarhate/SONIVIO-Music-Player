/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#EEFF00',
        'brand-hover': '#D4E600',
        bg: '#0A0A0A',
        'bg-light': '#141414',
        'bg-lighter': '#1A1A1A',
        text: '#FFFFFF',
        'text-sub': '#888888',
        surface: '#141414',
        'surface-light': '#1A1A1A',
        'border-hard': '#333333',
        'accent': '#EEFF00',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        circular: ['JetBrains Mono', 'monospace'], // Fallback to keep compatibility
      },
      borderRadius: {
        sm: '0px',
        DEFAULT: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      },
      borderWidth: {
        DEFAULT: '1px',
      }
    },
  },
  plugins: [],
}