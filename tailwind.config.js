/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Custom colors for chess board
      colors: {
        'board-dark': 'var(--board-dark)',
        'board-light': 'var(--board-light)',
        accent: 'var(--accent)',
      },
    },
  },
  plugins: [],
}
