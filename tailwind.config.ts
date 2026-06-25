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
          purple: '#38003C', // PL deep purple — primary background
          green:  '#00FF85', // PL bright green — highlights, selected
          pink:   '#E90052', // PL pink/magenta — accents, CTAs
        },
        // `pitch` = purple surfaces (panels, nav, modals).
        pitch: {
          DEFAULT: '#4a0050',
          dark:    '#38003C',
          light:   '#5c0064',
        },
        emerald: {
          300: '#66ffb2',
          400: '#00FF85',
          500: '#00e876',
          700: '#00a856',
          900: '#38003C',
          950: '#2d0032',
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
