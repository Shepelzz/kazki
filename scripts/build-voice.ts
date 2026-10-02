// Pre-records every phrase of every tale with the macOS Ukrainian voice (Lesya), each character with
// its own pitch and speed (voices: in the tale's YAML). Old iPads on iOS 12 have no Ukrainian voice of
// their own, and a recording sounds the same everywhere.
//
//   npm run voice        (macOS only; re-run after changing stories/*.yaml)
//
// Output: public/voice/<key>.m4a (AAC, plays in Safari 12) and src/voice-manifest.json (key →
// fingerprint of the file: the app asks for voice/<key>.m4a?v=<fingerprint>).

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { parseStory, spokenPhrases } from '../src/story.ts';
import { voiceKey } from '../src/voiceKey.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'voice');
const tmp = join(root, 'node_modules', '.cache', 'voice');
mkdirSync(outDir, { recursive: true });
mkdirSync(tmp, { recursive: true });

const BASE_WPM = 165; // Lesya's comfortable pace for a five-year-old

const wanted = new Map<string, { text: string; pitch: number; rate: number }>();
for (const f of readdirSync(join(root, 'stories')).filter((f) => f.endsWith('.yaml'))) {
  const story = parseStory(f.replace(/\.yaml$/, ''), YAML.parse(readFileSync(join(root, 'stories', f), 'utf8')));
  for (const p of spokenPhrases(story)) {
    const voice = story.voices[p.who];
    wanted.set(voiceKey(voice, p.text), { text: p.text, pitch: voice.pitch, rate: voice.rate });
  }
}

let made = 0;
for (const [key, { text, pitch, rate }] of wanted) {
  const out = join(outDir, `${key}.m4a`);
  if (existsSync(out)) continue;
  const aiff = join(tmp, `${key}.aiff`);
  // Nuance control sequence: pitch in percent of normal
  const tag = `\x1b\\pitch=${Math.round(pitch * 100)}\\`;
  execFileSync('say', ['-v', 'Lesya', '-r', String(Math.round(BASE_WPM * rate)), '-o', aiff, tag + text]);
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '48000', '-c', '1', aiff, out]);
  rmSync(aiff);
  made++;
}

// drop recordings nobody says any more
let removed = 0;
for (const f of readdirSync(outDir))
  if (!wanted.has(f.replace(/\.m4a$/, ''))) {
    rmSync(join(outDir, f));
    removed++;
  }

const manifest: Record<string, string> = {};
for (const key of [...wanted.keys()].sort())
  manifest[key] = createHash('sha1').update(readFileSync(join(outDir, `${key}.m4a`))).digest('hex').slice(0, 8);
writeFileSync(join(root, 'src', 'voice-manifest.json'), JSON.stringify(manifest) + '\n');

console.log(`${wanted.size} phrases: ${made} recorded, ${wanted.size - made} unchanged, ${removed} removed`);
