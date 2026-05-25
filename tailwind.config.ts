import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-dark': 'var(--color-primary-dark)',
        gold: 'var(--color-gold)',
        'gold-light': 'var(--color-gold-light)',
        cream: 'var(--color-cream)',
        'gray-100': 'var(--color-gray-100)',
        'gray-400': 'var(--color-gray-400)',
        'gray-700': 'var(--color-gray-700)',
        'gray-900': 'var(--color-gray-900)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        thai: ['var(--font-thai)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(26,74,46,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
