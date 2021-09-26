module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.svelte'],
  darkMode: 'media',
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
  ],
};
