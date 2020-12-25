import { register } from 'ts-node';

register({ transpileOnly: true });

import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import css from 'rollup-plugin-css-only';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';

// 使用
// import { staticRenderPlugin } from './plugins';
// 报错
// ! `[!] Error: Could not resolve './plugins' from rollup.config.js`
// 可能是 yarn pnp 引起，改用 require

const { staticRenderPlugin, serve } = require('./plugins');

const production = !process.env.ROLLUP_WATCH;

function getPlugins({ ssr }) {
  return [
    svelte({
      preprocess: sveltePreprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
        hydratable: ssr ? false : true,
        generate: ssr ? 'ssr' : 'dom',
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance
    css({ output: ssr ? false : 'bundle.css' }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    resolve({
      browser: !ssr,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      tsconfig: 'tsconfig.json',
      sourceMap: !production,
      inlineSources: !production,
    }),

    alias({
      entries: [{ find: '@', replacement: 'src' }],
    }),

    // In dev mode, call `npm run start` once
    // the bundle has been generated
    !ssr && !production && serve(),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    !ssr && production && terser(),
    !ssr && staticRenderPlugin(),
    replace({
      __SERVER__: ssr,
    }),
  ];
}

export default [
  {
    input: 'src/main.ts',
    output: {
      sourcemap: false,
      format: 'cjs',
      name: 'server',
      file: 'public/ssr.js',
    },
    plugins: getPlugins({ ssr: true }),
    watch: {
      clearScreen: false,
    },
  },
  {
    input: 'src/main.ts',
    output: {
      sourcemap: true,
      format: 'iife',
      name: 'client',
      file: 'public/bundle.js',
    },
    plugins: getPlugins({ ssr: false }),
    watch: {
      clearScreen: false,
    },
  },
];
