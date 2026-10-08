import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { defineConfig, loadEnv, runnerImport, type Plugin, type ViteDevServer } from 'vite';
import YAML from 'yaml';
import { parseStory, type TaleInfo } from './src/story.ts';

// stories/*.yaml are imported as their data
function yaml(): Plugin {
  return {
    name: 'yaml',
    transform(code, id) {
      if (!id.endsWith('.yaml')) return null;
      return { code: `export default ${JSON.stringify(YAML.parse(code))};`, map: null };
    },
  };
}

// virtual:tales — what the shelf needs of every tale (title, cover, what it is about, endings,
// voices, which heroes come on in which scene), a few kilobytes. The tale itself (its scenes) is
// a chunk of its own, fetched when its card is opened.
function taleIndex(): Plugin {
  const dir = resolve(__dirname, 'stories');
  const ID = 'virtual:tales';
  return {
    name: 'tale-index',
    resolveId: (id) => (id === ID ? '\0' + ID : null),
    load(id) {
      if (id !== '\0' + ID) return null;
      const out: Record<string, TaleInfo> = {};
      for (const f of readdirSync(dir).filter((f) => f.endsWith('.yaml'))) {
        this.addWatchFile(resolve(dir, f));
        const s = parseStory(f.replace(/\.yaml$/, ''), YAML.parse(readFileSync(resolve(dir, f), 'utf8')));
        const shows: Record<string, string[]> = {};
        for (const [name, steps] of Object.entries(s.scenes)) {
          const who = [...new Set(steps.flatMap((st) => (st.kind === 'show' ? [st.actor] : [])))];
          if (who.length) shows[name] = who;
        }
        out[s.id] = { id: s.id, title: s.title, cover: s.cover, about: s.about, sayTitle: s.sayTitle, voices: s.voices, endings: s.endings, shows };
      }
      return `export default ${JSON.stringify(out)};`;
    },
  };
}

// The wardrobe: src/wardrobe.ts (and src/items/) is run here, when the app is built, and every
// thing drawn into a little module of its own — the app fetches only the things worn (or shown on
// the heroes' page), never the ~500 drawings at once.
//   virtual:wardrobe-art      thing → () => import(its module); in the main script (a line a thing)
//   virtual:item/<id>         { id, slot, beard, svg }: the drawing
//   virtual:wardrobe-catalog  names, prices, each hero's set: for the heroes' page only
function wardrobeArt(): Plugin {
  type W = typeof import('./src/wardrobe');
  let w: Promise<W> | null = null;
  let server: ViteDevServer | null = null;
  const get = () =>
    (w ||= runnerImport<W>('/src/wardrobe.ts', { root: __dirname, configFile: false, logLevel: 'error' }).then((r) => {
      for (const it of r.module.ITEMS) if (!/^[a-z0-9_-]+$/.test(it.id)) throw new Error(`wardrobe: a thing's id "${it.id}" can't be a file name`);
      return r.module;
    }));
  const ART = 'virtual:wardrobe-art';
  const CAT = 'virtual:wardrobe-catalog';
  const ITEM = 'virtual:item/';
  return {
    name: 'wardrobe-art',
    configureServer(s) {
      server = s;
    },
    resolveId: (id) => (id === ART || id === CAT || id.startsWith(ITEM) ? '\0' + id : null),
    async load(id) {
      if (!id.startsWith('\0virtual:')) return null;
      const key = id.slice(1);
      if (key !== ART && key !== CAT && !key.startsWith(ITEM)) return null;
      const wr = await get();
      if (key === ART) return `export default {${wr.ITEMS.map((i) => `${JSON.stringify(i.id)}: () => import(${JSON.stringify(ITEM + i.id)})`).join(',\n')}};`;
      if (key === CAT) {
        const items: Record<string, { slot: string; name: string; price: number }> = {};
        for (const i of wr.ITEMS) items[i.id] = { slot: i.slot, name: i.name, price: i.price };
        const sets: Record<string, string[]> = {};
        for (const h of [...wr.FITTED_HEROES, ...Object.keys(wr.BODY)]) sets[h] = wr.itemsFor(h).map((i) => i.id);
        // a hero with no set of its own may wear anything (itemsFor)
        const any = wr.itemsFor('-').map((i) => i.id);
        return `export default ${JSON.stringify({ items, sets, any })};`;
      }
      const it = wr.ITEMS.find((i) => i.id === key.slice(ITEM.length));
      if (!it) throw new Error(`no thing ${key}`);
      return `export default ${JSON.stringify({ id: it.id, slot: it.slot, beard: !!it.beard, svg: it.draw() })};`;
    },
    // a thing drawn anew (dev): run the wardrobe again
    watchChange(file) {
      if (!/src\/(items\/|wardrobe\.ts|wardrobe-edits\.json|characters\.ts|dress\.ts)/.test(file)) return;
      w = null;
      const graph = server?.environments.client.moduleGraph;
      if (graph) for (const m of graph.idToModuleMap.values()) if (m.id && m.id.startsWith('\0virtual:') && !m.id.includes('tales')) graph.invalidateModule(m);
    },
  };
}

/** a note on a scene, from the review page */
interface Note {
  id: string;
  tale: string;
  scene: string;
  /** the line on screen when it was written: who and what */
  line?: string;
  text: string;
  created: string;
  status: 'open' | 'done';
  /** what was done about it */
  reply?: string;
  /** when it was marked done */
  doneAt?: string;
}

// fit.html (dev only): where a thing sits on a hero, dragged into place by hand, is saved into
// src/fit-overrides.json — without reloading the page that is busy editing
function fitEditor(): Plugin {
  const file = resolve(__dirname, 'src/fit-overrides.json');
  const edits = resolve(__dirname, 'src/wardrobe-edits.json');
  const notes = resolve(__dirname, 'review/notes.json');
  return {
    name: 'fit-editor',
    configureServer(server) {
      server.middlewares.use('/__fit', (req, res) => {
        if (req.method !== 'POST') return res.end();
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const { hero, item, place } = JSON.parse(body) as { hero: string; item: string; place: { dx: number; dy: number; k: number } | null };
            const all = JSON.parse(readFileSync(file, 'utf8') || '{}') as Record<string, Record<string, unknown>>;
            const h = all[hero] || (all[hero] = {});
            if (place) h[item] = { dx: +place.dx.toFixed(3), dy: +place.dy.toFixed(3), k: +place.k.toFixed(3) };
            else delete h[item];
            if (!Object.keys(h).length) delete all[hero];
            const sorted = Object.fromEntries(Object.keys(all).sort().map((k) => [k, all[k]]));
            writeFileSync(file, JSON.stringify(sorted, null, 2) + '\n');
            res.end('ok');
          } catch (e) {
            res.statusCode = 400;
            res.end(String(e));
          }
        });
      });
      // the review page (/?review): notes on the scenes of the tales, kept in review/notes.json
      // (committed: the notes are the to-do list, and what was done about each)
      server.middlewares.use('/__review', (req, res) => {
        const read = (): Note[] => (existsSync(notes) ? (JSON.parse(readFileSync(notes, 'utf8') || '[]') as Note[]) : []);
        res.setHeader('Content-Type', 'application/json');
        if (req.method === 'GET') return res.end(JSON.stringify(read()));
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const { action, note } = JSON.parse(body) as { action: 'add' | 'update' | 'delete'; note: Note };
            let all = read();
            if (action === 'add') all.push({ ...note, id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, created: new Date().toISOString(), status: 'open' });
            // opened again: no longer done
            if (action === 'update') all = all.map((n) => (n.id === note.id ? { ...n, ...note, ...(note.status === 'open' ? { doneAt: undefined } : {}) } : n));
            if (action === 'delete') all = all.filter((n) => n.id !== note.id);
            mkdirSync(dirname(notes), { recursive: true });
            writeFileSync(notes, JSON.stringify(all, null, 2) + '\n');
            res.end(JSON.stringify(all));
          } catch (e) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
      });
      // a thing taken away for good, given back, or moved to another slot: src/wardrobe-edits.json
      server.middlewares.use('/__wardrobe', (req, res) => {
        if (req.method !== 'POST') return res.end();
        let body = '';
        req.on('data', (c) => (body += c));
        req.on('end', () => {
          try {
            const { item, action, slot } = JSON.parse(body) as { item: string; action: 'remove' | 'restore' | 'slot' | 'unslot'; slot?: string };
            const ed = JSON.parse(readFileSync(edits, 'utf8') || '{}') as { removed: string[]; slot: Record<string, string> };
            ed.removed = (ed.removed || []).filter((i) => i !== item);
            ed.slot = ed.slot || {};
            if (action === 'remove') ed.removed.push(item);
            if (action === 'slot' && slot) ed.slot[item] = slot;
            // moved back where it was drawn for
            if (action === 'unslot') delete ed.slot[item];
            ed.removed.sort();
            writeFileSync(edits, JSON.stringify({ removed: ed.removed, slot: Object.fromEntries(Object.keys(ed.slot).sort().map((k) => [k, ed.slot[k]])) }, null, 2) + '\n');
            // its places set by hand were for the old slot (or for nothing now)
            if (action !== 'restore') {
              const all = JSON.parse(readFileSync(file, 'utf8') || '{}') as Record<string, Record<string, unknown>>;
              for (const h of Object.keys(all)) {
                delete all[h][item];
                if (!Object.keys(all[h]).length) delete all[h];
              }
              writeFileSync(file, JSON.stringify(all, null, 2) + '\n');
            }
            res.end('ok');
          } catch (e) {
            res.statusCode = 400;
            res.end(String(e));
          }
        });
      });
    },
    handleHotUpdate(ctx) {
      if (ctx.file === file || ctx.file === edits || ctx.file === notes) return [];
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [yaml(), taleIndex(), wardrobeArt(), fitEditor()],
  // DEBUG=TRUE (in .env.local, or the host's environment, e.g. on Render) shows the buttons that
  // skip to the next / previous line
  define: {
    __DEBUG__: JSON.stringify(String(process.env.DEBUG || loadEnv(mode, process.cwd(), '').DEBUG || '').toLowerCase() === 'true'),
  },
  // host: open it from the iPad over Wi-Fi
  server: { port: 5220, strictPort: true, host: true },
  build: {
    // old iPads stay on iOS 12 (Safari 12): lower modern JS syntax and CSS for them
    target: ['es2017', 'safari12'],
    cssTarget: ['safari12'],
  },
}));
