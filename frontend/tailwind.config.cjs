/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fff0f3',
          100: '#ffe0e7',
          200: '#ffc6d3',
          300: '#ff9db3',
          400: '#ff6487',
          500: '#FF3F6C',
          600: '#ed1d53',
          700: '#c81245',
          800: '#a8133f',
          900: '#8e143c',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffeed5',
          200: '#ffd9aa',
          300: '#ffbe73',
          400: '#ff9736',
          500: '#FF7B1C',
          600: '#f06006',
          700: '#c74807',
          800: '#9e390e',
          900: '#7f300f',
        },
        dark: {
          50: '#f5f6f8',
          100: '#e4e6ea',
          200: '#ccd0d8',
          300: '#a8aeb9',
          400: '#7d8595',
          500: '#626b7a',
          600: '#535a68',
          700: '#282c33',
          800: '#1e2228',
          900: '#191c21',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideIn: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
