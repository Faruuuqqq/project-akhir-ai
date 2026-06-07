/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'clinical-pearl': '#FAFAFA',
        'mri-black': '#121417',
        'charcoal': '#1F2937',
        'slate': '#64748B',
        'trust-teal': '#0F766E',
        'teal-dark': '#0F5F59',
        'calm-blue': '#3B82F6',
        'muted-rose': '#BE123C',
        'warm-amber': '#D97706',
        'light-silver': '#E2E8F0',
      },
      fontFamily: {
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
