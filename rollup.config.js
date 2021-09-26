import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import run from '@rollup/plugin-run';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json'
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import dotenv from 'dotenv'

import pkg from './package.json';

const isWatch = !!process.env.ROLLUP_WATCH;
const isHot = isWatch;
const isDev = isWatch;
const isProduction = !isDev;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) toExit();

      console.log('Starting server')
      server = require('child_process').spawn(
        'node', ['build/server.js'],
        {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true,
          env: dotenv.config().parsed
        }
      );

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

export default [
  {
    input: 'src/server/main.ts',
    output: {
      sourcemap: true,
      format: 'cjs',
      name: 'app',
      file: 'build/server.js',
    },
    external: Object.keys(pkg.dependencies),
    plugins: [
      json(),
      resolve({
        browser: false,
        dedupe: ['svelte'],
      }),
      commonjs(),
      typescript({
        sourceMap: isDev,
        inlineSources: isDev,
      }),
      run({
        options: {
          env: dotenv.config().parsed,
          stdio: 'inherit',
          shell: true
        }
      })
    ],
  },
  {
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
          dev: isDev,
        },
        preprocess: sveltePreprocess({
          typescript: true,
          postcss: true, // And tells it to specifically run postcss!
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
        sourceMap: isDev,
        inlineSources: isDev,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      isProduction && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
];
