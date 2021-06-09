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
  svelte({
    compilerOptions: {
      dev: !production,
    },
    preprocess: {
      ...autoPreprocess(),
      style: sass(),
    },
  }),
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
    plugins: [...plugins, css({ output: 'content-script.css' })],
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
    plugins: [...plugins, css({ output: 'popup.css' })],
    watch: { clearScreen: false },
  },
];
