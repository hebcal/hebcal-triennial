const typescript = require('@rollup/plugin-typescript');
const json = require('@rollup/plugin-json');
const pkg = require('./package.json');
const {defineConfig} = require('rollup');

const banner = '/*! ' + pkg.name + ' v' + pkg.version + ' */';

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
      json({compact: true, preferConst: true}),
    ],
  },
]);
