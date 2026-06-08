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
        'jakarta': ['var(--font-jakarta)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'medical': '0 4px 20px rgba(0,0,0,0.03)',
        'teal-glow': '0 4px 14px rgba(15,118,110,0.25)',
        'teal-glow-hover': '0 8px 20px rgba(15,118,110,0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
