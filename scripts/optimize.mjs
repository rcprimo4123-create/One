import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = 'vibe_images';
const out = 'public/images';
await mkdir(path.join(out, 'scenes'), { recursive: true });
await mkdir(path.join(out, 'characters'), { recursive: true });

const jobs = [
  ['character-master-reference_1793683055722_5a35a1b3.png', 'characters/master.webp', 1400],
  ['character-boy-sheet_1793683105242_87fe22c6.png', 'characters/boy-sheet.webp', 1400],
  ['character-girl-sheet_1793683138865_588cd024.png', 'characters/girl-sheet.webp', 1400],
  ['scene1-peek_1793683189554_d67b29c3.png', 'scenes/01-peek.webp', 1800],
  ['scene1-wave_1793683236882_9c869a74.png', 'scenes/01-wave.webp', 1800],
  ['scene2-flowers_1793683294120_c1ebc619.png', 'scenes/02-flowers.webp', 1200],
  ['scene3-game-world_1793683338684_754b33b6.png', 'scenes/03-world.webp', 1800],
  ['scene3-movie-night_1793683392255_96bdfc2e.png', 'scenes/03-movie.webp', 1400],
  ['scene3-late-night-call_1793683459352_b767d7c3.png', 'scenes/03-call.webp', 1400],
  ['scene3-future-empty_1793683607471_b0a1dc83.png', 'scenes/03-future.webp', 1400],
  ['scene3-future-scrapbook_1793683510899_7942959e.png', 'scenes/03-scrapbook.webp', 1400],
  ['scene4-sunset_1793683562033_1f7f9b52.png', 'scenes/04-dusk.webp', 1800],
  ['scene4-together_1793683658411_c837528c.png', 'scenes/04-together.webp', 1800],
  ['scene5-envelope_1793683690428_c02b9bd7.png', 'scenes/05-envelope.webp', 1200],
  ['finale-boy-wave_1793683719594_1a7aa36b.png', 'scenes/finale.webp', 1200],
];

for (const [file, dest, width] of jobs) {
  await sharp(path.join(src, file))
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toFile(path.join(out, dest));
  console.log('wrote', dest);
}
