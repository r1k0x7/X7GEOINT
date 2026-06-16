/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'x7-black': '#050505',
        'x7-dark': '#0a0a0f',
        'x7-military': '#4a7c59',
        'x7-military-dark': '#2d4a35',
        'x7-military-light': '#6b9b7a',
        'x7-blue': '#00d4ff',
        'x7-blue-dark': '#0099cc',
        'x7-blue-glow': '#00d4ff33',
        'x7-orange': '#ff6b35',
        'x7-orange-alert': '#ff8c42',
        'x7-red': '#e63946',
        'x7-red-critical': '#d62828',
        'x7-gray': '#1a1a2e',
        'x7-gray-light': '#2a2a3e',
        'x7-border': '#333344',
        'x7-text': '#e0e0e0',
        'x7-text-muted': '#8899aa',
      },
      fontFamily: {
        'mono': ['"JetBrains Mono"', 'monospace'],
        'sans': ['"Inter"', 'system-ui', 'sans-serif'],
        'display': ['"Orbitron"', 'sans-serif'],
      },
      animation: {
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'pulse-threat': 'pulse-threat 2s ease-in-out infinite',
        'scan-line': 'scan-line 3s linear infinite',
        'data-stream': 'data-stream 1s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-threat': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        'scan-line': {
          '0%': { top: '0%' },
          '100%': { top: '100%' },
        },
        'data-stream': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00d4ff33' },
          '100%': { boxShadow: '0 0 20px #00d4ff66, 0 0 40px #00d4ff33' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};