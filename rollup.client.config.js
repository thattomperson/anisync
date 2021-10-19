import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json'
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';

const config = ({ development, production }) => ({
  input: 'src/client/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'anisync',
    file: 'build/public/client.js',
  },
  plugins: [
    json(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: development,
      },
      preprocess: sveltePreprocess({
        typescript: true,
        postcss: {
          plugins: [
            require('tailwindcss')({
              ...require('./tailwind.config'),
              purge: ['./src/client/**/*.svelte'],
            }),
            require('autoprefixer')
          ]
        }, // And tells it to specifically run postcss!
      }),
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: 'client.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: development,
      inlineSources: development,
    }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
});

export default config;