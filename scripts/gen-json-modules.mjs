// Generates a `<name>.json.ts` ES module beside each `src/*.json` data file so
// the JSON gets inlined into the compiled output by `tsc` (the same effect the
// old rollup `@rollup/plugin-json` had). The generated files are git-ignored.
import {readFileSync, writeFileSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

for (const file of readdirSync(srcDir)) {
  if (!file.endsWith('.json')) continue;
  const json = JSON.parse(readFileSync(join(srcDir, file), 'utf8'));
  const out =
    '/* eslint-disable */\n' +
    `// Generated from ${file} by scripts/gen-json-modules.mjs. Do not edit.\n` +
    `export default ${JSON.stringify(json)};\n`;
  writeFileSync(join(srcDir, `${file}.ts`), out);
}
