/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    colors:{
      lightGray: '#292841',
      darkGray: '#1C1B29',
      passiveFontColor: '#B9BBBE',
      activeFontColor: '#FFFFFF',
      black: '#000000',
      tpurple: '#8C38F6',
      tpurpleActive: '#7D9FF7'
    },
    fontFamily: {
      'roboto': ['Roboto', 'sans-serif'],
      'merriweather': ['Merriweather', 'sans-serif'],
      'playfair': ['Playfair', 'sans-serif']
    }
  },
  plugins: [],
}