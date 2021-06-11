import svelte from 'rollup-plugin-svelte';
import { sass } from 'svelte-preprocess-sass';
import commonjs from '@rollup/plugin-commonjs';
import autoPreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

const production = !process.env.ROLLUP_WATCH;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
        stdio: ['ignore', 'inherit', 'inherit'],
        shell: true,
      });

      process.on('SIGTERM', toExit);
      process.on('exit', toExit);
    },
  };
}

const plugins = [
  typescript({
    sourceMap: !production,
    inlineSources: !production,
  }),
  resolve({
    browser: true,
    dedupe: ['svelte'],
  }),
  commonjs(),

  !production && serve(),
  !production && livereload('public'),
  production && terser(),
];

export default [
  {
    input: 'src/content-script.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/content-script.js',
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
        },
        preprocess: {
          ...autoPreprocess(),
          style: sass(),
        },
        emitCss: false,
      }),
      ...plugins,
    ],
    watch: { clearScreen: false },
  },
  {
    input: 'src/popup.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/popup.js',
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
        },
        preprocess: {
          ...autoPreprocess(),
          style: sass(),
        },
      }),
      css({ output: 'popup.css' }),
      ...plugins,
    ],
    watch: { clearScreen: false },
  },
  {
    input: 'src/options-page.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'app',
      file: 'public/build/options-page.js',
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: !production,
        },
        preprocess: {
          ...autoPreprocess(),
          style: sass(),
        },
      }),
      css({ output: 'options-page.css' }),
      ...plugins,
    ],
    watch: { clearScreen: false },
  },
];
