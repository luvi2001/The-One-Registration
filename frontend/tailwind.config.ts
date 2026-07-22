import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        pine: {
          950: '#122A21',
          900: '#1B3A2F',
          800: '#234A3A',
          700: '#2F5D46',
          600: '#3D7257',
        },
        canvas: {
          50: '#FBF7EC',
          100: '#F6EFDC',
          200: '#EEE2C4',
        },
        ember: {
          500: '#E8743B',
          600: '#D4602A',
          400: '#F0925F',
        },
        sun: {
          400: '#F4B942',
          300: '#F7CA6E',
        },
        ink: {
          900: '#17241C',
          700: '#33473C',
        },
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      boxShadow: {
        canvas: '0 30px 60px -20px rgba(18, 42, 33, 0.55)',
      },
    },
  },
  plugins: [],
};
export default config;
