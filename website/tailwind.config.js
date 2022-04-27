/* eslint-disable */

module.exports = {
  content: [
    './layouts/**/*.vue',
    './components/**/*.vue',
    './pages/**/*.vue',
    './renderer/**/*.vue',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '5%',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        primary: '#0079F7',
        'primary-lighter': '#EEF6FF',
        'primary-light': '#3697FC',
        'primary-dark': '#0056B0',
        'primary-darker': '#012B53',
        secondary: '#FFA600',
        'secondary-light': '#FFC864',
        'secondary-dark': '#dc6b05',
        text: '#333333',
        light: '#F5F5F5',
      },
    },
  },
  plugins: [],
};
