/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Nunito"', 'sans-serif'],
      },
      colors: {
        med: {
          50:  '#f0fdf9',
          100: '#ccfbef',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        },
        ink: {
          900: '#080d14',
          800: '#0d1420',
          700: '#131d2e',
          600: '#1a2740',
          500: '#243352',
          400: '#3d5070',
          300: '#7a8fa8',
        }
      }
    }
  },
  plugins: []
}
