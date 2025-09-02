/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ld-green': {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce4bc',
          300: '#8dd08d',
          400: '#5bb35b',
          500: '#2E7D32', // Verde florestal - cor principal
          600: '#4CAF50', // Verde claro - elementos secundários
          700: '#1B5E20', // Verde escuro - destaques e botões
          800: '#1a4d1a',
          900: '#1a3f1a',
        },
        'ld-gray': {
          50: '#fafafa',
          100: '#f5f5f5', // Cinza claro - fundos secundários
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242', // Cinza escuro - textos secundários
          900: '#212121',
        },
        'ld-gold': '#FFD700', // Dourado - elementos de destaque
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ld': '0 4px 6px -1px rgba(46, 125, 50, 0.1), 0 2px 4px -1px rgba(46, 125, 50, 0.06)',
        'ld-lg': '0 10px 15px -3px rgba(46, 125, 50, 0.1), 0 4px 6px -2px rgba(46, 125, 50, 0.05)',
      }
    },
  },
  plugins: [],
}
