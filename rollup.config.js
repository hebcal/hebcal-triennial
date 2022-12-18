const {nodeResolve} = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
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
      json({compact: true}),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: '12.22.0',
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
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
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            targets: {
              node: '12.22.0',
            },
          }],
        ],
        exclude: ['node_modules/**'],
      }),
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
      json({compact: true}),
      nodeResolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: [
          ['@babel/preset-env', {
            modules: false,
            exclude: [
              'es.array.concat',
              'es.array.filter',
              'es.array.find',
              'es.array.join',
              'es.array.map',
              'es.array.sort',
              'es.array.splice',
              'es.function.name',
              'es.math.trunc',
              'es.number.to-fixed',
              'es.object.keys',
              'es.object.to-string',
              'es.parse-int',
              'es.regexp.exec',
              'es.regexp.to-string',
              'es.string.iterator',
              'es.string.match',
              'es.string.replace',
              'es.string.split',
              'es.string.trim',
              'web.dom-collections.for-each',
            ],
            targets: {
              chrome: '103',
              ie: '11',
              safari: '13.1',
            },
            useBuiltIns: 'usage',
            corejs: 3,
          }],
        ],
        exclude: ['node_modules/core-js/**'],
      }),
    ],
  },
];
