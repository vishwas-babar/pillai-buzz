/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/**/*.html', './public/css/*.css', './public/js/*.js'],
  theme: {
    extend: {
      colors: {
        'custom-gray': 'rgb(205, 205, 205)',
        'custom-primary': '#2563EB',
        'custom-primary-hover': '#1D4ED8',
        'custom-secondary': '',
      },
      boxShadow: {
        'custom-shadow-1': '0px 0px 2px 0px rgba(0,0,0,0.75)',
        'custom-shadow-2': 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
      },
      screens: {
        'smm': '440px'
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [],
}