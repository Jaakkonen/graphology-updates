import pkg from './package.json';
import resolve from '@rollup/plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {terser} from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';

const INPUTS = {
  es: 'src/endpoint.esm.js',
  cjs: 'src/endpoint.cjs.js',
  umd: 'src/endpoint.cjs.js'
};

const bundle = (format, filename, options = {}) => ({
  input: INPUTS[format],
  output: {
    file: filename,
    format: format,
    name: 'graphology',
    sourcemap: true,
  },
  external: [
    ...(!options.resolve ? [
      ...Object.keys(pkg.dependencies),
      'obliterator/iterator',
      'obliterator/take',
      'obliterator/chain'
    ] : []),
  ],
  plugins: [
    ...(options.resolve ? [
      resolve({preferBuiltins: true}),
      builtins(),
      commonjs()
    ] : []),
    ...(options.babel ? [
      babel({exclude: 'node_modules/**'})
    ] : []),
    ...(options.minimize ? [
      terser()
    ] : []),
    ...(options.stats ? [
      visualizer({filename: filename.replace('.js', '') + '.stats.html'})
    ] : []),
  ],
});

export default [
  bundle('cjs', pkg.main, {babel: true}),
  bundle('es', pkg.module),
  bundle('umd', pkg.browser.replace('.min', ''), {resolve: true, babel: true, stats: true}),
  bundle('umd', pkg.browser, {resolve: true, babel: true, minimize: true}),
];
