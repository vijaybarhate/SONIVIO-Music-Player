/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        stroke: 'var(--stroke)',
        'accent-start': 'var(--accent-start)',
        'accent-end': 'var(--accent-end)',
        'glass-bg': 'var(--glass-bg)',
        'glass-border': 'var(--glass-border)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Instrument Serif', 'serif'],
      },
      backgroundImage: {
        'accent-gradient': 'var(--accent-gradient)',
      },
      boxShadow: {
        glow: '0 8px 32px var(--glow)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate')
  ],
}
