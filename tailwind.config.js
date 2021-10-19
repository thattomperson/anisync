module.exports = {
  mode: 'jit',
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        funimation: '#410099'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
}