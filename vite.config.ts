import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import YAML from 'yaml';

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

// fit.html (dev only): where a thing sits on a hero, dragged into place by hand, is saved into
// src/fit-overrides.json — without reloading the page that is busy editing
function fitEditor(): Plugin {
  const file = resolve(__dirname, 'src/fit-overrides.json');
  const edits = resolve(__dirname, 'src/wardrobe-edits.json');
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
      if (ctx.file === file || ctx.file === edits) return [];
    },
  };
}

export default defineConfig(({ mode }) => ({
  base: '/',
  plugins: [yaml(), fitEditor()],
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
