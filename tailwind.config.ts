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
        pitch: {
          DEFAULT: '#0a3d1f',
          dark: '#062813',
          light: '#11592e',
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
