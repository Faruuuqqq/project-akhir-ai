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
          // Theme colors mapped to Breast Cancer Ribbon colors
          'ribbon-pink': '#E64C7E',
          'ribbon-dark': '#C1124B',
          'calm-blue': '#3B82F6',
          'muted-rose': '#BE123C',
          'ribbon-orange': '#F9A029',
          'warning': '#F9A029',
          'warm-amber': '#F9A029',
          'light-silver': '#E2E8F0',
          'trust-teal': '#E64C7E', // Keep for backward compatibility
          'teal-dark': '#C1124B',  // Keep for backward compatibility
        },
      fontFamily: {
        'jakarta': ['var(--font-jakarta)', 'sans-serif'],
        'inter': ['var(--font-inter)', 'sans-serif'],
        'mono': ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        'medical': '0 4px 20px rgba(0,0,0,0.03)',
        'pink-glow': '0 4px 14px rgba(230,76,126,0.25)',
        'pink-glow-hover': '0 8px 20px rgba(230,76,126,0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
