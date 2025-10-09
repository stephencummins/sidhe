/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sidhe-navy': '#1a2f4a',
        'sidhe-deep-blue': '#0d1b2a',
        'sidhe-gold': '#d4af37',
        'sidhe-bright-gold': '#f4c542',
        'sidhe-orange': '#d35f3a',
        'sidhe-coral': '#e07856',
        'sidhe-teal': '#4a7c7e',
        'sidhe-sage': '#6b8e8f',
        'sidhe-cream': '#f5f1e8',
        'sidhe-moon': '#e8e4d9',
      },
    },
  },
  plugins: [],
};
