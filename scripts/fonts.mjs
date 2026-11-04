import { readFile, writeFile } from 'node:fs/promises';

const css = await readFile('scripts/fonts-source.css', 'utf8');
const chunks = css.split('/*').slice(1);
const faces = [];
for (const chunk of chunks) {
  const subset = chunk.slice(0, chunk.indexOf('*/')).trim();
  if (subset !== 'latin') continue;
  const block = chunk.slice(chunk.indexOf('*/') + 2);
  const family = block.match(/font-family: '([^']+)'/)?.[1];
  const style = block.match(/font-style: (\w+)/)?.[1];
  const weight = block.match(/font-weight: (\d+)/)?.[1];
  const url = block.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const range = block.match(/unicode-range: ([^;]+);/)?.[1];
  if (!family || !url || !weight || !range) continue;
  const slug = family.toLowerCase().replace(/\s+/g, '-');
  const dest = `${slug}-${weight}${style === 'italic' ? '-italic' : ''}.woff2`;
  const res = await fetch(url);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(`public/fonts/${dest}`, buf);
  faces.push({ family, style, weight, dest, range });
  console.log('wrote', dest, buf.length);
}
let out = '/* Self-hosted, latin subset */\n';
for (const f of faces) {
  out += `@font-face {\n  font-family: '${f.family}';\n  font-style: ${f.style};\n  font-weight: ${f.weight};\n  font-display: swap;\n  src: url('/fonts/${f.dest}') format('woff2');\n  unicode-range: ${f.range};\n}\n`;
}
await writeFile('public/fonts/fonts.css', out);
console.log('wrote fonts.css with', faces.length, 'faces');
