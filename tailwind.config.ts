import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // FIFA 2026 World Cup brand palette.
        pl: {
          purple: '#0D1428', // dark navy — FOIL badge text
          green: '#3CAC3B',  // WC green
          pink: '#E61D25',   // WC red — attack stat, danger button
          cyan: '#7AAEF7',   // light WC blue — defence stat, FOIL badge bg
        },
        // `pitch` = dark navy surfaces (panels, nav, modals, pitch).
        pitch: {
          DEFAULT: '#0B1530',
          dark: '#060D1E',
          light: '#12213F',
        },
        // `emerald` overridden to WC green scale. Dark shades = near-black
        // navy used for button text and card backs.
        emerald: {
          300: '#72CB71',
          400: '#3CAC3B',
          500: '#349934',
          700: '#1C6B1C',
          900: '#0B1530',
          950: '#060D1E',
        },
        tier: {
          rising: '#cd7f32', // bronze
          star: '#c0c0c0', // silver
          legend: '#ffd700', // gold
        },
      },
      boxShadow: {
        'glow-rising': '0 0 18px 2px rgba(205, 127, 50, 0.65)',
        'glow-star': '0 0 20px 3px rgba(192, 192, 192, 0.7)',
        'glow-legend': '0 0 26px 4px rgba(255, 215, 0, 0.8)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'coin-pop': {
          '0%': { transform: 'scale(0.6)', opacity: '0' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        'coin-pop': 'coin-pop 0.4s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
