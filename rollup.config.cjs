const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

module.exports = [
  {
    input: 'src/index.js',
    output: [
      {file: pkg.main, format: 'cjs', name: pkg.name, banner},
    ],
    external: ['@hebcal/leyning', '@hebcal/core'],
    plugins: [
      json({compact: true, preferConst: true}),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {file: pkg.module, format: 'es', name: pkg.name, banner},
    ],
    external: ['@hebcal/leyning', '@hebcal/core'],
    plugins: [
      json({compact: true, preferConst: true}),
    ],
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal__triennial',
        globals: {
          '@hebcal/core': 'hebcal',
          '@hebcal/leyning': 'hebcal__leyning',
        },
        indent: false,
        banner,
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__triennial',
        globals: {
          '@hebcal/core': 'hebcal',
          '@hebcal/leyning': 'hebcal__leyning',
        },
        plugins: [terser()],
        banner,
      },
    ],
    external: ['@hebcal/leyning', '@hebcal/core'],
    plugins: [
      json({compact: true, preferConst: true}),
      nodeResolve(),
      commonjs(),
    ],
  },
];
