// Records the tales with ElevenLabs: the narrator is Kira, every character has a voice of its own.
// Voices and model are fixed in scripts/elevenlabs-config.json (committed); only the key is secret,
// in kazky/.env.local (git-ignored):
//   ELEVENLABS_API_KEY=...
//
//   npm run voice:samples        each character's first line in each candidate voice →
//                                voice-samples/index.html (open http://localhost:5220/voice-samples/)
//   npm run voice:el             record every phrase not yet recorded in its character's current voice
//   npm run voice:el -- --status what's done / left, spending nothing
//
// Progress is kept in scripts/elevenlabs-progress.json (committed): which voice recorded which phrase.
// Changing a character's voice in the config re-records only that character's lines. When the quota
// runs out the script stops cleanly; run it again later to continue — meanwhile the phrases not
// recorded yet keep their Lesya recording (npm run voice).
//
// Files go where the Lesya ones are (public/voice/<key>.m4a, same keys), and src/voice-manifest.json
// is refreshed, so browsers fetch the re-recorded phrases anew.
// Note: the key includes the Lesya pitch/rate from the tale's YAML; changing those means recording anew.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';
import { parseStory, spokenPhrases, type Story } from '../src/story.ts';
import { voiceKey } from '../src/voiceKey.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.elevenlabs.io/v1';
const progressFile = join(root, 'scripts', 'elevenlabs-progress.json');

function loadEnv() {
  const file = join(root, '.env.local');
  if (!existsSync(file)) return;
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
}
loadEnv();

interface Config {
  model: string;
  outputFormat: string;
  voices: Record<string, { id: string; name: string }>;
  candidates: Record<string, [string, string][]>;
}
const config = JSON.parse(readFileSync(join(root, 'scripts', 'elevenlabs-config.json'), 'utf8')) as Config;

interface Progress {
  model: string;
  /** voice key → who recorded it and the characters it cost */
  done: Record<string, { voice: string; chars: number }>;
  charsSpent: number;
}

const stories: Story[] = readdirSync(join(root, 'stories'))
  .filter((f) => f.endsWith('.yaml'))
  .map((f) => parseStory(f.replace(/\.yaml$/, ''), YAML.parse(readFileSync(join(root, 'stories', f), 'utf8'))));

/** every phrase once: key, who says it, text */
function allPhrases() {
  const out = new Map<string, { key: string; who: string; text: string }>();
  for (const s of stories)
    for (const p of spokenPhrases(s)) {
      const key = voiceKey(s.voices[p.who], p.text);
      if (!out.has(key)) out.set(key, { key, who: p.who, text: p.text });
    }
  return [...out.values()];
}

class QuotaError extends Error {}

async function tts(voiceId: string, text: string, attempt = 0): Promise<{ mp3: Buffer; cost: number }> {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error('ELEVENLABS_API_KEY is missing: add it to kazky/.env.local');
  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=${config.outputFormat}`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: config.model }),
  });
  if (!res.ok) {
    const body = await res.text();
    if ((res.status === 429 || res.status === 503) && /concurren|busy|rate/i.test(body) && attempt < 6) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      return tts(voiceId, text, attempt + 1);
    }
    if (res.status === 429 || /quota|credits/i.test(body)) throw new QuotaError(body.slice(0, 300));
    throw new Error(`${res.status} (voice ${voiceId}): ${body.slice(0, 300)}`);
  }
  return { mp3: Buffer.from(await res.arrayBuffer()), cost: Number(res.headers.get('character-cost')) || text.length };
}

/** mp3 → AAC .m4a (plays in Safari 12, like the Lesya recordings) */
function toM4a(mp3: Buffer, out: string) {
  const tmp = out.replace(/\.m4a$/, '.mp3');
  writeFileSync(tmp, mp3);
  execFileSync('afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', tmp, out]);
  rmSync(tmp);
}

function writeManifest() {
  const dir = join(root, 'public', 'voice');
  const manifest: Record<string, string> = {};
  for (const { key } of allPhrases().sort((a, b) => (a.key < b.key ? -1 : 1))) {
    const f = join(dir, `${key}.m4a`);
    if (existsSync(f)) manifest[key] = createHash('sha1').update(readFileSync(f)).digest('hex').slice(0, 8);
  }
  writeFileSync(join(root, 'src', 'voice-manifest.json'), JSON.stringify(manifest) + '\n');
}

const args = process.argv.slice(2);

if (args[0] === '--samples') {
  const dir = join(root, 'voice-samples');
  mkdirSync(dir, { recursive: true });
  const phrases = allPhrases();
  const only = args[1];
  let spent = 0;
  let html = `<!doctype html><meta charset="utf-8"><title>Голоси</title>
<style>body{font:18px system-ui;margin:24px;background:#fbf3e0;color:#4a2e1c}h2{margin:28px 0 4px}p{margin:0 0 10px;opacity:.75}
.v{display:inline-block;margin:6px 12px 6px 0;padding:10px 14px;background:#fff;border-radius:14px}.v b{display:block;margin-bottom:6px}</style>
<h1>Голоси персонажів</h1><p>Обраний зараз — із зірочкою. Щоб змінити, напиши Claude, кого на кого.</p>`;
  for (const [who, list] of Object.entries(config.candidates)) {
    if (only && who !== only) continue;
    // a line that shows the character: its longest one, but not a song
    const lines = phrases.filter((p) => p.who === who && !/Я колобок, колобок/.test(p.text));
    const line = lines.sort((a, b) => b.text.length - a.text.length).find((p) => p.text.length < 140) || lines[0];
    const name = stories[0].voices[who]?.name || who;
    html += `<h2>${name}</h2><p>«${line.text}»</p>`;
    for (const [id, vname] of list) {
      const file = `${who}-${vname}.mp3`;
      if (!existsSync(join(dir, file))) {
        try {
          const { mp3, cost } = await tts(id, line.text);
          writeFileSync(join(dir, file), mp3);
          spent += cost;
        } catch (e) {
          console.log(`${who} / ${vname}: ${(e as Error).message}`);
          html += `<div class="v"><b>${vname}</b>не вдалося</div>`;
          continue;
        }
      }
      const star = config.voices[who]?.id === id ? ' ★' : '';
      html += `<div class="v"><b>${vname}${star}</b><audio controls preload="none" src="${file}"></audio></div>`;
      console.log(`sample: ${who} / ${vname}`);
    }
  }
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`${spent} characters spent → voice-samples/index.html`);
} else {
  const phrases = allPhrases();
  let progress: Progress = { model: config.model, done: {}, charsSpent: 0 };
  if (existsSync(progressFile)) {
    const p = JSON.parse(readFileSync(progressFile, 'utf8')) as Progress;
    if (p.model === config.model) progress = p;
    else console.log(`model changed (was ${p.model}): recording everything anew`);
  }
  const voiceOf = (who: string) => config.voices[who]?.id || config.voices.narrator.id;
  const isDone = (p: { key: string; who: string }) => progress.done[p.key]?.voice === voiceOf(p.who);
  const save = () => writeFileSync(progressFile, JSON.stringify(progress, null, 2) + '\n');
  const report = () => {
    const left = phrases.filter((p) => !isDone(p));
    const chars = left.reduce((n, p) => n + p.text.length, 0);
    console.log(`ElevenLabs (${config.model}): ${phrases.length - left.length}/${phrases.length} phrases done, ${progress.charsSpent} characters spent; ${left.length} left (~${chars} characters)`);
  };
  if (args[0] === '--status') {
    report();
    process.exit(0);
  }
  const todo = phrases.filter((p) => !isDone(p));
  const outDir = join(root, 'public', 'voice');
  let next = 0;
  let quota: QuotaError | null = null;
  let failed = 0;
  const worker = async () => {
    while (next < todo.length && !quota) {
      const p = todo[next++];
      try {
        const { mp3, cost } = await tts(voiceOf(p.who), p.text);
        toM4a(mp3, join(outDir, `${p.key}.m4a`));
        progress.done[p.key] = { voice: voiceOf(p.who), chars: cost };
        progress.charsSpent += cost;
        save();
        process.stdout.write(`\r${phrases.filter(isDone).length}/${phrases.length} recorded`);
      } catch (e) {
        if (e instanceof QuotaError) quota = e;
        else {
          failed++;
          console.log(`\n${p.who}: ${(e as Error).message}`);
        }
      }
    }
  };
  try {
    await Promise.all(Array.from({ length: Number(process.env.ELEVENLABS_CONCURRENCY) || 4 }, worker));
    if (quota) console.log(`\nquota used up, stopping here (${(quota as QuotaError).message})`);
    else console.log(failed ? `\n${failed} phrases failed (see above)` : '\nall phrases recorded');
  } finally {
    save();
    writeManifest();
    report();
  }
}
