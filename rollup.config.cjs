const typescript = require('@rollup/plugin-typescript');
const {nodeResolve} = require('@rollup/plugin-node-resolve');
const json = require('@rollup/plugin-json');
const terser = require('@rollup/plugin-terser');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

const iifeGlobals = {
  '@hebcal/hdate': 'hebcal',
  '@hebcal/core': 'hebcal',
  '@hebcal/core/dist/esm/locale': 'hebcal',
  '@hebcal/core/dist/esm/holidays': 'hebcal',
  '@hebcal/core/dist/esm/sedra': 'hebcal',
  '@hebcal/core/dist/esm/event': 'hebcal',
  '@hebcal/core/dist/esm/ParshaEvent': 'hebcal',
  '@hebcal/core/dist/esm/parshaYear': 'hebcal',
  '@hebcal/leyning': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/leyning': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/csv': 'hebcal__leyning_csv',
  '@hebcal/leyning/dist/esm/summary': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/clone': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/getLeyningKeyForEvent': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/specialReadings': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/common': 'hebcal__leyning',
  '@hebcal/leyning/dist/esm/getLeyningForHoliday': 'hebcal__leyning',
};

const tsOptions = {rootDir: './src'};
module.exports = defineConfig([
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
      name: pkg.name,
      banner,
    },
    external: [/@hebcal\//, 'quick-lru'],
    plugins: [
      typescript({...tsOptions, outDir: 'dist/esm'}),
      json({compact: true, preferConst: true})],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/bundle.js',
        format: 'iife',
        name: 'hebcal__triennial',
        globals: iifeGlobals,
        indent: false,
        banner,
      },
      {
        file: 'dist/bundle.min.js',
        format: 'iife',
        name: 'hebcal__triennial',
        globals: iifeGlobals,
        plugins: [terser()],
        banner,
      },
    ],
    external: [/@hebcal\//],
    plugins: [
      typescript(),
      json({compact: true, preferConst: true}),
      nodeResolve(),
    ],
  },
]);
