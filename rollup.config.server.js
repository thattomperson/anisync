import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import run from '@rollup/plugin-run';
import dotenv from 'dotenv'

const config = ({ pkg, development }) => ({
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
      sourceMap: development,
      inlineSources: development,
    }),
    development && run({
      options: {
        env: dotenv.config().parsed,
        stdio: 'inherit',
        shell: true
      }
    })
  ],
});

export default config;