/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        // Cold Technical Core — wholesale/B2B chrome and pages
        'dark-navy':    '#0E1825',
        'arctic-navy':  '#1E2A39',
        'steel-blue':   '#5C7386',
        'glacier-blue': '#9DB4C6',
        'silver-mist':  '#D6DEE6',
        'ice-white':    '#F5F8FA',
        // Warm Material Accent — retail/B2C page content (ex-RAQI palette)
        'warm-chocolate':      '#2B1B17',
        'warm-ash':            '#F2F0EB',
        'warm-gold':           '#C5A059',
        'warm-chocolate-line': '#4A372E',
        'warm-ash-line':       '#DEDACF',
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
