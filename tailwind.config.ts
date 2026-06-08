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
        // Premier League brand palette.
        pl: {
          purple: '#37003c',
          green: '#00ff85',
          pink: '#e90052',
          cyan: '#04f5ff',
        },
        // `pitch` = branded purple surfaces (panels, nav, modals, pitch).
        pitch: {
          DEFAULT: '#37003c',
          dark: '#25002a',
          light: '#4a0d52',
        },
        // `emerald` is overridden to the PL neon-green accent scale so all
        // existing accent classes recolour at once. Dark shades double as the
        // near-black purple used for button text and card backs.
        emerald: {
          300: '#5cffb0',
          400: '#00ff85',
          500: '#00ff87',
          700: '#1f9d63',
          900: '#2a0030',
          950: '#16001a',
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
