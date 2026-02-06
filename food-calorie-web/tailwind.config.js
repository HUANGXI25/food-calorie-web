/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        brand: {
          50: '#edfdf7',
          100: '#d5f8ea',
          200: '#aeeed3',
          300: '#7fe1ba',
          400: '#4bcc9a',
          500: '#1da97b',
          600: '#148663',
          700: '#116b50',
          800: '#0f5541',
          900: '#0d4636'
        },
        sunrise: {
          50: '#fff7eb',
          100: '#ffe9c9',
          200: '#ffcf8a',
          300: '#ffb452',
          400: '#ff9827',
          500: '#f97316',
          600: '#d85c0b',
          700: '#b34605',
          800: '#8f3605',
          900: '#742e08'
        }
      },
      boxShadow: {
        soft: '0 18px 50px rgba(15, 23, 42, 0.12)',
        card: '0 10px 30px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};
