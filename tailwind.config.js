/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        // Cold Technical Core — ENZO's primary identity (60-70% of the site)
        'obsidian':     '#0B0F14',  // primary dark anchor: footer, calculator bg, premium sections
        'arctic-navy':  '#1E2A39',  // primary brand color: buttons, nav accents, hero, wholesale
        'steel-blue':   '#5C7386',
        'glacier-blue': '#9DB4C6',
        'silver-mist':  '#D6DEE6',
        'ice-white':    '#F5F8FA',
        // Coffee / Chocolate Material Accent — warmth + craftsmanship, used sparingly (5-10%)
        'espresso':        '#241510',  // darkest warm tone — premium full-bleed sections
        'dark-chocolate':  '#3A2118',  // main chocolate accent — premium CTAs, cards
        'coffee-brown':    '#5A3828',  // secondary accent, borders on chocolate surfaces
        'warm-mocha':      '#80604C',  // micro-details, thin lines, small labels only
        'textile-cream':   '#E8DED2',  // text/highlights on chocolate — prevents heaviness
      },
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono:  ['"JetBrains Mono"', 'monospace'],
        fraunces: ['Fraunces', 'serif'],
        plexsans: ['"IBM Plex Sans"', '-apple-system', 'sans-serif'],
        plexmono: ['"IBM Plex Mono"', 'monospace'],
      },
      maxWidth: {
        '6xl': '72rem',
      },
    },
  },
  plugins: [],
}
