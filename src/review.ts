// The review page (dev server only: http://localhost:5220/?review, or /review.html).
//
// Every tale, split into its scenes (episodes). A tap on a scene plays it on its own, with its
// animation and voice: the scenes before it run quickly and silently on the way (by the shortest
// route of choices), then it is told as usual and stops at its end — "Далі" goes on to the next one.
// Notes are written to a scene (with the line on screen at that moment) and kept in
// review/notes.json by the dev server: the to-do list for fixes. A note marked done carries what
// was done about it, and shows so when its scene is opened.

import type { TaleInfo } from './story';

interface Step {
  kind: string;
  who?: string;
  text?: string;
  scene?: string;
  question?: string;
  options?: { label: string; next: string }[];
  ending?: string;
}
interface FullStory {
  id: string;
  title: string;
  start: string;
  voices: Record<string, { name: string }>;
  scenes: Record<string, Step[]>;
  endings: Record<string, { title: string; icon: string }>;
}
interface Note {
  id: string;
  tale: string;
  scene: string;
  line?: string;
  text: string;
  created: string;
  status: 'open' | 'done';
  reply?: string;
  /** when it was marked done */
  doneAt?: string;
}
interface TaleApi {
  story(id: string): Promise<FullStory>;
  reviewScene(id: string, scene: string, route: Record<string, number>, after: (scene: string, next: string | null) => Promise<boolean>, started?: () => void): Promise<void>;
  setPaused(on: boolean): void;
  /** stop the tale, back to the shelf */
  home(): void;
  readonly paused: boolean;
}

const api = () => (window as unknown as { tale: TaleApi }).tale;

let tales: TaleInfo[] = [];
const stories = new Map<string, FullStory>();
let notes: Note[] = [];
/** the scene being shown */
let open: { tale: string; scene: string } | null = null;
/** the end of a scene, waiting for "Далі" / "Стоп" */
let waiting: ((go: boolean) => void) | null = null;
let nextScene: string | null = null;
let onlyNotes = false;
/** the tales unfolded in the list (by hand, or by opening one of their scenes) */
const unfolded = new Set<string>();
/** the list of what was done since last looked, instead of the tales */
let showNews = false;
/** the note being written: kept through every redraw of the panel (a scene ending redraws it) */
const drafts: Record<string, string> = {};


const h = <K extends keyof HTMLElementTagNameMap>(tag: K, props: Partial<HTMLElementTagNameMap[K]> & { cls?: string } = {}, ...kids: (Node | string)[]) => {
  const e = document.createElement(tag);
  const { cls, ...rest } = props;
  if (cls) e.className = cls;
  Object.assign(e, rest);
  for (const k of kids) e.append(k);
  return e;
};

// ---------- notes: the dev server keeps them ----------

async function loadNotes() {
  try {
    notes = (await (await fetch('/__review')).json()) as Note[];
  } catch {
    notes = [];
  }
}

async function saveNote(action: 'add' | 'update' | 'delete', note: Partial<Note>) {
  const r = await fetch('/__review', { method: 'POST', body: JSON.stringify({ action, note }) });
  notes = (await r.json()) as Note[];
  render();
}

// ---------- done since last looked ----------
// A note marked done is "new" until its scene has been opened once after that (kept in this
// browser). The first time, the ones done before this existed count as seen.

const SEEN_KEY = 'kazky:review-seen';
let seen: Record<string, string> = {};
function loadSeen() {
  try {
    const raw = localStorage.getItem(SEEN_KEY);
    if (raw) seen = JSON.parse(raw) as Record<string, string>;
    else {
      for (const n of notes) if (n.status === 'done' && !n.doneAt) seen[n.id] = 'before';
      saveSeen();
    }
  } catch {
    seen = {};
  }
}
function saveSeen() {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // private window: new ones stay new
  }
}
/** done, and not looked at since */
const fresh = (n: Note) => n.status === 'done' && seen[n.id] !== (n.doneAt || 'before') && seen[n.id] !== 'before';
/** the notes of a scene are being looked at: their news is seen (shown as new this time still) */
function markSeen(tale: string, scene: string) {
  let changed = false;
  for (const n of notes)
    if (n.tale === tale && n.scene === scene && fresh(n)) {
      seen[n.id] = n.doneAt || 'before';
      changed = true;
    }
  if (changed) saveSeen();
}
/** what this view showed as new: kept new on screen until the episode changes */
let shownFresh = new Set<string>();

const notesOf = (tale: string, scene?: string) => notes.filter((n) => n.tale === tale && (scene === undefined || n.scene === scene));
const count = (list: Note[]) => ({ open: list.filter((n) => n.status === 'open').length, done: list.filter((n) => n.status === 'done').length });
const badges = (list: Note[]) => {
  const c = count(list);
  const nw = list.filter(fresh).length;
  return h(
    'span',
    { cls: 'rv-badges' },
    c.open ? h('span', { cls: 'rv-b open', textContent: `💬 ${c.open}` }) : '',
    nw ? h('span', { cls: 'rv-b new', textContent: `✓ ${nw} нов.` }) : '',
    c.done - nw ? h('span', { cls: 'rv-b done', textContent: `✓ ${c.done - nw}` }) : '',
  );
};

// ---------- the scenes of a tale ----------

async function storyOf(id: string) {
  let s = stories.get(id);
  if (!s) {
    s = await api().story(id);
    stories.set(id, s);
  }
  return s;
}

/** the shortest way from the start to a scene: scene → the option picked there */
function routeTo(s: FullStory, target: string): Record<string, number> {
  const from = new Map<string, { scene: string; option: number }>();
  const seen = new Set([s.start]);
  const queue = [s.start];
  while (queue.length) {
    const sc = queue.shift()!;
    if (sc === target) break;
    for (const st of s.scenes[sc] || []) {
      const go = (to: string, option: number) => {
        if (seen.has(to) || !s.scenes[to]) return;
        seen.add(to);
        from.set(to, { scene: sc, option });
        queue.push(to);
      };
      if (st.kind === 'next' && st.scene) go(st.scene, 0);
      if (st.kind === 'choice') (st.options || []).forEach((o, i) => go(o.next, i));
    }
  }
  const route: Record<string, number> = {};
  for (let sc = target; from.has(sc); sc = from.get(sc)!.scene) route[from.get(sc)!.scene] = from.get(sc)!.option;
  return route;
}

/** what a scene is about, in a few words: its first line */
function gist(s: FullStory, scene: string) {
  const say = (s.scenes[scene] || []).find((st) => st.kind === 'say' || st.kind === 'choice');
  const text = say ? say.text || say.question || '' : '';
  return text.length > 70 ? text.slice(0, 68) + '…' : text;
}

/** where a scene leads: the choice's options, the next scene, the ending */
function leads(s: FullStory, scene: string) {
  const out: string[] = [];
  for (const st of s.scenes[scene] || []) {
    if (st.kind === 'choice') out.push(...(st.options || []).map((o) => `${o.label} → ${o.next}`));
    if (st.kind === 'next') out.push(`→ ${st.scene}`);
    if (st.kind === 'ending' && st.ending) out.push(`кінцівка: ${s.endings[st.ending]?.icon || ''} ${s.endings[st.ending]?.title || st.ending}`);
  }
  return out;
}

// ---------- playing a scene ----------

function status(text: string) {
  const el = document.getElementById('rv-status');
  if (el) el.textContent = text;
}

async function play(tale: string, scene: string) {
  shownFresh = new Set(notes.filter((n) => n.tale === tale && n.scene === scene && fresh(n)).map((n) => n.id));
  markSeen(tale, scene);
  // the scene shown before, if it was waiting at its end, is let go
  waiting?.(false);
  waiting = null;
  nextScene = null;
  open = { tale, scene };
  unfolded.add(tale);
  render();
  const s = await storyOf(tale);
  status(scene === s.start ? '▶ грає' : '⏩ перемотую до епізоду…');
  const after = (_done: string, next: string | null) =>
    new Promise<boolean>((resolve) => {
      nextScene = next;
      waiting = (go) => {
        waiting = null;
        if (go && next) {
          open = { tale, scene: next };
          // the teller goes on to it, telling it as usual
          const t = (window as unknown as { tale: { teller: { review: { target: string } | null } | null } }).tale.teller;
          if (t && t.review) t.review.target = next;
        }
        resolve(go && !!next);
        render();
      };
      render();
    });
  await api().reviewScene(tale, scene, routeTo(s, scene), after, () => status('▶ грає'));
}

function lineOnScreen() {
  const cap = document.getElementById('caption');
  if (!cap || cap.hidden) return '';
  const who = document.getElementById('caption-who');
  const text = document.getElementById('caption-text')?.textContent || '';
  return (who && !who.hidden && who.textContent ? `${who.textContent}: ` : '') + text;
}

// ---------- the panel ----------

const when = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getDate()}.${String(d.getMonth() + 1).padStart(2, '0')} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

function noteView(n: Note) {
  const isNew = n.status === 'done' && shownFresh.has(n.id);
  const box = h('div', { cls: `rv-note ${n.status}${isNew ? ' fresh' : ''}` });
  if (isNew) box.append(h('div', { cls: 'rv-newtag', textContent: '🆕 щойно виконано' }));
  if (n.line) box.append(h('div', { cls: 'rv-line', textContent: `«${n.line}»` }));
  box.append(h('div', { cls: 'rv-text', textContent: n.text }));
  if (n.status === 'done') box.append(h('div', { cls: 'rv-reply', textContent: `✓ Виконано${n.doneAt ? ' ' + when(n.doneAt) : ''}${n.reply ? ': ' + n.reply : ''}` }));
  const tools = h('div', { cls: 'rv-tools' });
  if (n.status === 'done') tools.append(h('button', { textContent: '↺ відкрити знову', onclick: () => void saveNote('update', { id: n.id, status: 'open' }) }));
  tools.append(
    h('button', {
      textContent: '✎',
      title: 'змінити',
      onclick: () => {
        const t = prompt('Коментар', n.text);
        if (t !== null && t.trim()) void saveNote('update', { id: n.id, text: t.trim() });
      },
    }),
    h('button', {
      textContent: '🗑',
      title: 'видалити',
      onclick: () => {
        if (confirm('Видалити коментар?')) void saveNote('delete', { id: n.id });
      },
    }),
  );
  box.append(tools);
  return box;
}

function episodeBox() {
  if (!open) return h('div', { cls: 'rv-episode empty', textContent: 'Обери епізод зліва — він зіграє з анімацією та озвучкою.' });
  const { tale, scene } = open;
  const s = stories.get(tale);
  const info = tales.find((x) => x.id === tale);
  const box = h('div', { cls: 'rv-episode' });
  box.append(h('div', { cls: 'rv-ep-title' }, h('b', { textContent: info?.title || tale }), ' › ', h('code', { textContent: scene })));
  box.append(h('div', { cls: 'rv-status', id: 'rv-status', textContent: waiting ? (nextScene ? `■ кінець епізоду. Далі: ${nextScene}` : '■ кінець епізоду (кінцівка)') : '' }));
  const ctl = h('div', { cls: 'rv-ctl' });
  // the card's ✕: the scene stops, back to the shelf and the list of tales
  box.append(
    h('button', {
      cls: 'rv-close',
      textContent: '✕',
      title: 'Закрити епізод',
      onclick: () => {
        waiting?.(false);
        waiting = null;
        nextScene = null;
        unfolded.delete(tale);
        open = null;
        api().home();
        render();
      },
    }),
  );
  ctl.append(
    h('button', {
      textContent: '⏯ пауза',
      onclick: () => api().setPaused(!api().paused),
    }),
    h('button', { textContent: '↺ заново', onclick: () => void play(tale, scene) }),
  );
  if (waiting && nextScene) ctl.append(h('button', { cls: 'go', textContent: `▶ далі: ${nextScene}`, onclick: () => waiting?.(true) }));
  box.append(ctl);
  if (s) {
    const l = leads(s, scene);
    if (l.length) box.append(h('div', { cls: 'rv-leads', textContent: l.join(' · ') }));
  }
  const list = notesOf(tale, scene);
  // open first, then the ones just done (newest first), the older done ones folded away
  const notesBox = h('div', { cls: 'rv-notes' });
  for (const n of list.filter((x) => x.status === 'open')) notesBox.append(noteView(n));
  const done = list.filter((x) => x.status === 'done').sort((a, b) => (b.doneAt || '').localeCompare(a.doneAt || ''));
  for (const n of done.filter((x) => shownFresh.has(x.id))) notesBox.append(noteView(n));
  const older = done.filter((x) => !shownFresh.has(x.id));
  if (older.length) {
    const det = h('details', { cls: 'rv-older' });
    det.append(h('summary', { textContent: `Виконані раніше (${older.length})` }));
    for (const n of older) det.append(noteView(n));
    notesBox.append(det);
  }
  box.append(notesBox);
  const ta = h('textarea', { placeholder: 'Коментар до епізоду (озвучка, модель, рух, текст…)', rows: 3, value: drafts[`${tale}/${scene}`] || '' });
  ta.addEventListener('input', () => (drafts[`${tale}/${scene}`] = ta.value));
  const lineHint = h('div', { cls: 'rv-hint', textContent: 'Реплика на екрані збережеться разом із коментарем.' });
  const add = h('button', {
    cls: 'go',
    textContent: '💬 Додати коментар',
    onclick: () => {
      const text = ta.value.trim();
      if (!text) return;
      ta.value = '';
      delete drafts[`${tale}/${scene}`];
      void saveNote('add', { tale, scene, text, line: lineOnScreen() || undefined });
    },
  });
  box.append(ta, lineHint, add);
  return box;
}

/** what was done since last looked, by tale and scene: a tap opens the scene */
function newsList(news: Note[]) {
  const wrap = h('div', { cls: 'rv-tales' });
  wrap.append(h('div', { cls: 'rv-hint', textContent: 'Нові виконані. Тап — відкрити епізод (там вони стануть переглянутими).' }));
  for (const t of tales) {
    const mine = news.filter((n) => n.tale === t.id);
    if (!mine.length) continue;
    const det = h('details', { cls: 'rv-tale' });
    det.open = true;
    det.append(h('summary', {}, h('span', { textContent: t.title }), h('span', { cls: 'rv-badges' }, h('span', { cls: 'rv-b new', textContent: `✓ ${mine.length}` }))));
    for (const scene of [...new Set(mine.map((n) => n.scene))]) {
      const row = h('button', { cls: 'rv-scene' });
      const first = mine.find((n) => n.scene === scene)!;
      row.append(h('span', { cls: 'rv-sc' }, h('code', { textContent: scene }), h('small', { textContent: first.text.slice(0, 70) })), h('span', { cls: 'rv-badges' }, h('span', { cls: 'rv-b new', textContent: `✓ ${mine.filter((n) => n.scene === scene).length}` })));
      row.addEventListener('click', () => {
        showNews = false;
        void storyOf(t.id).then(() => play(t.id, scene));
      });
      det.append(row);
    }
    wrap.append(det);
  }
  return wrap;
}

function taleList() {
  const wrap = h('div', { cls: 'rv-tales' });
  for (const t of tales) {
    const s = stories.get(t.id);
    const all = notesOf(t.id);
    if (onlyNotes && !all.length) continue;
    const det = h('details', { cls: 'rv-tale' });
    det.open = unfolded.has(t.id);
    det.append(h('summary', {}, h('span', { textContent: t.title }), badges(all)));
    det.addEventListener('toggle', () => {
      if (det.open) unfolded.add(t.id);
      else unfolded.delete(t.id);
      if (det.open && !stories.has(t.id)) void storyOf(t.id).then(render);
    });
    if (s) {
      Object.keys(s.scenes).forEach((scene, i) => {
        const list = notesOf(t.id, scene);
        if (onlyNotes && !list.length) return;
        const row = h('button', { cls: 'rv-scene' + (open && open.tale === t.id && open.scene === scene ? ' on' : '') });
        row.append(h('span', { cls: 'rv-n', textContent: String(i + 1) }), h('span', { cls: 'rv-sc' }, h('code', { textContent: scene }), h('small', { textContent: gist(s, scene) })), badges(list));
        row.addEventListener('click', () => void play(t.id, scene));
        det.append(row);
      });
    } else det.append(h('div', { cls: 'rv-hint', textContent: 'завантажую…' }));
    wrap.append(det);
  }
  return wrap;
}

function render() {
  const panel = document.getElementById('rv-panel')!;
  const scroll = panel.querySelector('.rv-list')?.scrollTop || 0;
  // the note being written keeps its focus and cursor
  const old = panel.querySelector('textarea');
  const focus = old && document.activeElement === old ? { start: old.selectionStart, end: old.selectionEnd } : null;
  panel.innerHTML = '';
  const c = count(notes);
  const news = notes.filter(fresh);
  const head = h(
    'div',
    { cls: 'rv-head' },
    h('b', { textContent: 'Огляд казок' }),
    // back to the app as it is, without the panel
    h('a', { cls: 'rv-exit', href: location.pathname, textContent: '✕ Вийти', title: 'Вийти з огляду' }),
    h(
      'span',
      { cls: 'rv-badges' },
      h('span', { cls: 'rv-b open', textContent: `💬 ${c.open}` }),
      news.length ? h('button', { cls: 'rv-b new rv-newsbtn', textContent: `✓ ${news.length} нових`, onclick: () => ((showNews = !showNews), render()) }) : '',
      h('span', { cls: 'rv-b done', textContent: `✓ ${c.done}` }),
    ),
  );
  const filter = h('label', { cls: 'rv-filter' });
  const cb = h('input', { type: 'checkbox', checked: onlyNotes });
  cb.addEventListener('change', () => {
    onlyNotes = cb.checked;
    // the tales with notes: their scenes are needed to show which
    if (onlyNotes) void Promise.all([...new Set(notes.map((n) => n.tale))].map(storyOf)).then(render);
    else render();
  });
  filter.append(cb, ' лише з коментарями');
  const list = h('div', { cls: 'rv-list' }, showNews && news.length ? newsList(news) : taleList());
  panel.append(head, filter, episodeBox(), list);
  list.scrollTop = scroll;
  const ta = panel.querySelector('textarea');
  if (ta && focus) {
    ta.focus();
    ta.setSelectionRange(focus.start, focus.end);
  }
}

const CSS = `
body.review .screen { left: 380px; }
#rv-panel { position: fixed; top: 0; left: 0; bottom: 0; width: 380px; z-index: 50; display: flex; flex-direction: column;
  background: #fdf8ef; color: #3a2a1e; font: 14px/1.35 Nunito, system-ui, sans-serif; border-right: 2px solid #e2d6c2; }
#rv-panel button { font: inherit; cursor: pointer; border: 1px solid #d8c9b0; background: #fff; border-radius: 8px; padding: 5px 9px; color: inherit; }
#rv-panel button.go { background: #3fa34d; border-color: #2a7a36; color: #fff; font-weight: 800; }
.rv-head { display: flex; justify-content: space-between; align-items: center; padding: 10px 12px 4px; font-size: 17px; }
.rv-filter { padding: 0 12px 8px; font-size: 13px; }
.rv-exit { margin-left: 8px; font-size: 13px; font-weight: 800; color: #8a5a2b; text-decoration: none; border: 1px solid #d8c9b0; border-radius: 8px; padding: 2px 8px; background: #fff; }
.rv-badges { display: inline-flex; gap: 4px; margin-left: auto; }
.rv-b { font-size: 12px; font-weight: 800; border-radius: 999px; padding: 1px 7px; }
.rv-b.open { background: #ffe0b2; color: #a14a00; }
.rv-b.done { background: #d7f0d9; color: #2a7a36; }
.rv-b.new { background: #2e9d43; color: #fff; }
#rv-panel button.rv-newsbtn { border: 0; padding: 1px 8px; border-radius: 999px; font-size: 12px; background: #2e9d43; color: #fff; font-weight: 800; }
.rv-note.fresh { border: 2px solid #2e9d43; box-shadow: 0 0 0 3px #d7f0d9; }
.rv-newtag { font-size: 11px; font-weight: 800; color: #2e9d43; margin-bottom: 2px; }
.rv-older { margin-top: 6px; }
.rv-older summary { cursor: pointer; font-size: 12px; color: #6b8a6e; font-weight: 700; }
.rv-episode { margin: 0 10px 8px; padding: 10px; border-radius: 12px; background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,.1); max-height: 55vh; overflow-y: auto; }
.rv-episode.empty { color: #8a7a68; }
.rv-episode { position: relative; }
#rv-panel button.rv-close { position: absolute; top: 8px; right: 8px; width: 34px; height: 34px; padding: 0; border-radius: 50%; font-size: 18px; line-height: 1; font-weight: 800; color: #6b5a48; }
.rv-ep-title { padding-right: 40px; }
.rv-ep-title { font-size: 15px; margin-bottom: 4px; }
.rv-status { font-size: 13px; color: #6b5a48; min-height: 18px; }
.rv-ctl { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0; }
.rv-leads { font-size: 12px; color: #6b5a48; margin-bottom: 6px; }
.rv-note { border-radius: 10px; padding: 7px 9px; margin: 6px 0; background: #fff4e5; border: 1px solid #ffd59a; }
.rv-note.done { background: #eef8ef; border-color: #b9e0bd; }
.rv-note.done .rv-text { text-decoration: line-through; color: #6b8a6e; }
.rv-line { font-size: 12px; color: #7a6a58; font-style: italic; margin-bottom: 3px; }
.rv-reply { font-size: 13px; color: #2a7a36; font-weight: 700; margin-top: 4px; }
.rv-tools { display: flex; gap: 4px; justify-content: flex-end; margin-top: 4px; }
.rv-tools button { padding: 1px 6px !important; font-size: 12px !important; }
.rv-episode textarea { width: 100%; box-sizing: border-box; font: inherit; border-radius: 8px; border: 1px solid #d8c9b0; padding: 6px; margin-top: 6px; }
.rv-hint { font-size: 11px; color: #8a7a68; margin: 2px 0 6px; }
.rv-list { flex: 1; overflow-y: auto; padding: 0 10px 20px; }
.rv-tale { margin: 4px 0; border-radius: 10px; background: #fff; border: 1px solid #ecdfca; }
.rv-tale summary { display: flex; align-items: center; gap: 6px; padding: 8px 10px; font-weight: 800; cursor: pointer; }
.rv-scene { display: flex !important; align-items: center; gap: 8px; width: 100%; text-align: left; border: 0 !important; border-top: 1px solid #f1e7d6 !important; border-radius: 0 !important; padding: 6px 10px !important; background: transparent !important; }
.rv-scene.on { background: #fff1c9 !important; }
.rv-n { width: 22px; text-align: right; color: #a8957c; font-size: 12px; }
.rv-sc { display: flex; flex-direction: column; min-width: 0; flex: 1; }
.rv-sc small { color: #8a7a68; font-size: 11px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
@media (max-width: 900px) { body.review .screen { left: 300px; } #rv-panel { width: 300px; } }
`;

export async function startReview(list: TaleInfo[]) {
  tales = list;
  document.body.classList.add('review');
  document.head.append(h('style', { textContent: CSS }));
  document.body.append(h('aside', { id: 'rv-panel' }));
  document.title = 'Огляд казок';
  await loadNotes();
  loadSeen();
  // the tales with notes: their scenes at hand
  await Promise.all([...new Set(notes.map((n) => n.tale))].filter((id) => list.some((t) => t.id === id)).map(storyOf));
  render();
  // the stage resizes to the narrower window
  window.dispatchEvent(new Event('resize'));
}
