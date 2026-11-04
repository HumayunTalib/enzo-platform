/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html', './journal/*.html', './js/*.js'],
  theme: {
    extend: {
      colors: {
        // Navy is the identity; warm white is the ground; stone gives structure.
        // Copper is an accent only — never a second brand color.
        'navy':       '#1E3585',
        'deep-navy':  '#0E1640',
        'warm-white': '#FFFFFF',
        'stone':      '#EEF1FB',
        'charcoal':   '#0A0A0A',
        'slate':      '#4A5578',
        'copper':     '#4F6BD8',
      },
      fontFamily: {
        sans:  ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono:  ['ui-monospace', '"SF Mono"', '"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      spacing: {
        // Mirrors the --s1..--s8 scale in css/input.css. Keep in sync.
        's1': '8px',  's2': '16px', 's3': '24px', 's4': '32px',
        's5': '48px', 's6': '64px', 's7': '96px', 's8': '128px',
      },
      borderRadius: {
        'r1': '2px', 'r2': '4px', 'r3': '6px',
      },
      maxWidth: {
        container: '1280px',
      },
    },
  },
  plugins: [],
}
