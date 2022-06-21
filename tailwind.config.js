/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
  },
  plugins: [require('daisyui')],
};
