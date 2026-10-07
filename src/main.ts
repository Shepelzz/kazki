// The app: a shelf of tales, and the tale itself (stage, subtitles, choices, the ending card).
// Debug: window.tale — tale.go('fox') starts from a scene, tale.fast(4) plays 4× quicker without
// the voice, tale.stage / tale.teller for poking around.

import './style.css';
import { makePuppet, el } from './characters';
import type { Teller, TellerUi } from './engine';
import { loadTale, pauseSpeech, releaseTale, resumeSpeech, say, speechProgress, setSpeechEnabled, speechEnabled, stopSpeech, unlockAudio } from './speech';
import type { Stage } from './stage';
import { aboutPhrase, COMMON, endingPhrase, parseStory, spokenPhrases, type Story, type TaleInfo } from './story';
import { progress } from './progress';
import { loadOutfits, outfitOf } from './closet';
import { dress } from './dress';
import { COIN, heroesOf } from './heroes';
import TALES from 'virtual:tales';

/** the shelf, in this order */
const SHELF = ['kolobok', 'ripka', 'rukavychka', 'koza-dereza', 'pan-kotskyi', 'sirko', 'lysychka', 'telesyk', 'kyrylo', 'kotyhoroshko', 'kotyhoroshko2', 'solomyanyi-bychok', 'kotyk-pivnyk', 'lysychka-zhuravel'];
/** what the shelf knows of each tale (a few kilobytes); the tale itself is fetched when its card opens */
const TALE_LIST: TaleInfo[] = SHELF.map((id) => TALES[id]);
/** each tale's scenes: a chunk of its own, fetched on demand */
const TALE_FILES = import.meta.glob<Record<string, any>>('../stories/*.yaml', { import: 'default' });

/** The tale's scenes (from the server the first time, then from the browser's cache). */
async function fetchStory(id: string): Promise<Story> {
  return parseStory(id, await TALE_FILES[`../stories/${id}.yaml`]());
}
/** tales still being written: shown on the shelf as "soon" */
const SOON: { title: string; icon: string }[] = [];

/** backdrops with no road: subtitles at the bottom there */
const HOME_SCENES = ['hata', 'hata-evening', 'hata-winter', 'hata-night', 'pich', 'pich-evening'];

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ---------- endings found, per tale (kept by progress.ts) ----------
function found(story: Pick<TaleInfo, 'id' | 'endings'>): string[] {
  return progress.endings(story.id).filter((e) => e in story.endings);
}

// ---------- the shelf ----------
/** the part of each cover puppet to show on its card */
const COVER_VIEW: Record<string, string> = {
  kolobok: '-90 -130 180 150',
  rukavychka: '-150 -320 300 350',
  koza: '-130 -270 250 290',
  kit: '-110 -250 230 270',
  sirko: '-140 -180 260 190',
  lysytsia: '-120 -300 280 310',
  telesyk: '-90 -240 180 250',
  kyrylo: '-150 -420 300 430',
  kotyhoroshko: '-130 -390 260 400',
  solombychok: '-130 -210 250 220',
  pivnyk: '-100 -210 220 220',
  zhuravel: '-160 -370 270 380',
  hryfon: '-240 -340 560 350',
  ripka: '-190 -450 380 470',
};

function cover(story: Pick<TaleInfo, 'cover'>) {
  const svgEl = el('svg', { viewBox: COVER_VIEW[story.cover] || '-200 -400 400 420', class: 'cover-art' });
  const g = makePuppet(story.cover);
  svgEl.appendChild(g);
  return svgEl;
}

/**
 * A dressed cover hero's hat may stick out of its picture: the picture grows to take it in (once
 * the covers are on the page, where they can be measured), keeping its middle.
 */
/** The heroes of the covers in what she bought them (fetched first), the pictures grown to fit it. */
function dressCovers(root: HTMLElement) {
  const covers = Array.from(root.querySelectorAll<SVGGElement>('svg.cover-art > [data-actor]'));
  void loadOutfits(covers.map((g) => g.getAttribute('data-actor')!)).then(() => {
    for (const g of covers) dress(g, g.getAttribute('data-actor')!, outfitOf(g.getAttribute('data-actor')!));
    // measured on the next frame: the shelf may be shown only just after this
    requestAnimationFrame(() => fitCovers(root));
  });
}

function fitCovers(root: HTMLElement) {
  for (const s of Array.from(root.querySelectorAll<SVGSVGElement>('svg.cover-art'))) {
    const things = Array.from(s.querySelectorAll<SVGGraphicsElement>('[data-part="outfit"], [data-part="outfit-body"]'));
    if (!things.length) continue;
    const [x, y, w, h] = (s.getAttribute('viewBox') || '').split(' ').map(Number);
    let x0 = x;
    let y0 = y;
    let x1 = x + w;
    let y1 = y + h;
    for (const t of things) {
      try {
        const b = t.getBBox();
        if (!b.width) continue;
        x0 = Math.min(x0, b.x);
        y0 = Math.min(y0, b.y);
        x1 = Math.max(x1, b.x + b.width);
        y1 = Math.max(y1, b.y + b.height);
      } catch {
        // not measurable: the picture as it was
      }
    }
    // grow evenly round the middle so the hero stays in the middle
    const cx = x + w / 2;
    const half = Math.max(cx - x0, x1 - cx);
    s.setAttribute('viewBox', `${(cx - half).toFixed(0)} ${y0.toFixed(0)} ${(half * 2).toFixed(0)} ${(y1 - y0).toFixed(0)}`);
  }
}

function renderShelf() {
  const shelf = $('shelf');
  shelf.innerHTML = '';
  for (const story of TALE_LIST) {
    const card = document.createElement('button');
    card.className = 'book';
    const art = document.createElement('div');
    art.className = 'book-art book-art-' + story.id;
    art.appendChild(cover(story));
    const title = document.createElement('div');
    // a long name gets smaller letters: two lines at most, like the short ones
    title.className = story.title.length > 18 ? 'book-title long' : 'book-title';
    title.textContent = story.title;
    const got = found(story);
    const keys = Object.keys(story.endings);
    const stars = document.createElement('div');
    stars.className = 'book-endings';
    fillPips(stars, story);
    if (got.length >= keys.length) card.className += ' complete';
    card.setAttribute('aria-label', `${story.title}: знайдено ${got.length} з ${keys.length} кінцівок`);
    card.append(art, title, stars);
    card.addEventListener('click', () => openCard(story, card));
    shelf.appendChild(card);
  }
  for (const s of SOON) {
    const card = document.createElement('div');
    card.className = 'book soon';
    card.innerHTML = `<div class="book-art"><span class="soon-icon">${s.icon}</span></div><div class="book-title">${s.title}</div>`;
    shelf.appendChild(card);
  }
  dressCovers(shelf);
}

/** a round slot per ending: the found ones show their picture */
function fillPips(box: HTMLElement, story: Pick<TaleInfo, 'id' | 'endings'>) {
  box.innerHTML = '';
  const got = found(story);
  for (const k of Object.keys(story.endings)) {
    const pip = document.createElement('span');
    const has = got.indexOf(k) >= 0;
    pip.className = has ? 'pip got' : 'pip';
    if (has) pip.textContent = story.endings[k].icon;
    box.appendChild(pip);
  }
}

// ---------- a tale's card: the picture, what it is about (said aloud), play ----------
let carded: TaleInfo | null = null;
/** the shelf card it was opened from: focus goes back there */
let cardFrom: HTMLElement | null = null;

function openCard(story: TaleInfo, from: HTMLElement) {
  unlockAudio();
  carded = story;
  cardFrom = from;
  const art = $('tc-art');
  art.className = 'book-art tc-art book-art-' + story.id;
  art.innerHTML = '';
  art.appendChild(cover(story));
  $('tc-title').textContent = story.title;
  dressCovers(art);
  $('tc-about').textContent = story.about;
  fillPips($('tc-endings'), story);
  const box = $('tale-card');
  box.classList.remove('told');
  box.hidden = false;
  // the shelf under the card stays still
  $('library').classList.add('locked');
  // focus inside the dialog (for the keyboard), without a ring on the button for a tap
  $('tale-card').querySelector<HTMLElement>('.tale-card-box')!.focus();
  const told = story;
  aboutTalking = true;
  about = say(story.voices.narrator, aboutPhrase(story)).then(() => {
    aboutTalking = false;
    // told: the play button calls a little
    if (carded === told) box.classList.add('told');
  });
  void prepare(story);
}

/**
 * The tale on the card is fetched in the background from the moment the card opens: its scenes,
 * the stage, what its heroes wear, then every recording of it, into memory (the voice starts at
 * once, and an iPad that loses Wi-Fi in the middle still tells it to the end). The play button
 * works all along: pressed before it's all in, the tale's screen shows how far it is.
 * Closing the card lets it all go.
 */
let prep: { info: TaleInfo; story: Promise<Story | null>; part: number; done: boolean } | null = null;
/** what the narrator says on the card; still going on the loading screen (she listens meanwhile) */
let about: Promise<void> = Promise.resolve();
let aboutTalking = false;

function prepare(info: TaleInfo): Promise<Story | null> {
  if (prep && prep.info === info) return prep.story;
  const p = { info, part: 0, done: false, story: Promise.resolve<Story | null>(null) };
  prep = p;
  const live = () => prep === p;
  p.story = (async () => {
    try {
      const cast = ([] as string[]).concat(...Object.values(info.shows)).filter((a) => heroIds.indexOf(a) >= 0);
      const [story] = await Promise.all([fetchStory(info.id), player(), loadOutfits(cast)]);
      if (!live()) return null;
      // a recording that didn't come (Wi-Fi) is fetched again when it is said
      await loadTale(spokenPhrases(story).map((ph) => ({ voice: story.voices[ph.who], text: ph.text })), (done, all) => {
        if (!live()) return;
        p.part = done / all;
        showPart();
      });
      p.done = true;
      return live() ? story : null;
    } catch {
      // the tale itself didn't come: the next try starts over
      if (live()) prep = null;
      return null;
    }
  })();
  return p.story;
}

/** the tale fetched no more: its recordings let go */
function dropPrep() {
  prep = null;
  waitingFor = null;
  releaseTale();
}

// ---------- the tale's screen while it is still coming ----------
/** the tale the screen waits for */
let waitingFor: TaleInfo | null = null;

function showPart() {
  if (prep) $('loading-pct').textContent = `${Math.round(prep.part * 100)}%`;
}

async function startTale(info: TaleInfo) {
  const story = prepare(info);
  waitingFor = info;
  show('play');
  $('ending').hidden = true;
  for (const id of ['btn-pause', 'btn-back', 'btn-next']) $(id).hidden = true;
  $('loading-title').textContent = info.title;
  $('loading-retry').hidden = true;
  $('loading-wait').hidden = false;
  showPart();
  $('loading').hidden = false;
  const s = await story;
  // gone home meanwhile
  if (waitingFor !== info) return;
  // the narrator finishes telling what it is about first
  if (s && aboutTalking) {
    $('loading-pct').textContent = '100%';
    await about;
    if (waitingFor !== info) return;
  }
  if (!s) {
    $('loading-wait').hidden = true;
    $('loading-retry').hidden = false;
    return;
  }
  waitingFor = null;
  $('loading').hidden = true;
  void openTale(s);
}

$('loading-retry').addEventListener('click', () => {
  unlockAudio();
  if (waitingFor) void startTale(waitingFor);
});

function closeCard() {
  if (!carded) return;
  carded = null;
  stopSpeech();
  dropPrep();
  $('tale-card').hidden = true;
  $('library').classList.remove('locked');
  cardFrom?.focus();
}

$('tc-close').addEventListener('click', closeCard);
// a tap outside the card closes it
$('tale-card').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeCard();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCard();
});
$('tc-play').addEventListener('click', () => {
  const info = carded;
  if (!info) return;
  carded = null;
  // still coming: the narrator goes on telling what it is about on the loading screen
  if (prep && prep.info === info && prep.done) stopSpeech();
  $('tale-card').hidden = true;
  $('library').classList.remove('locked');
  void startTale(info);
});

// ---------- subtitles of long lines: in pages, turned as the voice goes on ----------

/** the most lines a subtitle shows at once; a longer line is shown in parts, one after another */
const MAX_LINES = 3;
let pages: string[] = [];
let pageAt: number[] = [];
let page = -1;
let pageTimer: ReturnType<typeof setInterval> | undefined;
/** for a line with no known progress (muted, fast tests): time it has been shown, pauses excluded */
let shownFor = 0;

/** how many lines this text takes in the subtitle box (measured in a hidden copy of it) */
function linesOf(text: string): number {
  const el = $('caption-text');
  const probe = el.cloneNode(false) as HTMLElement;
  probe.style.cssText = `position:absolute;visibility:hidden;left:-9999px;top:0;width:${el.clientWidth}px`;
  probe.textContent = text;
  el.parentElement!.appendChild(probe);
  const lh = parseFloat(getComputedStyle(probe).lineHeight) || 30;
  // a line and a bit is two lines
  const n = Math.ceil(probe.offsetHeight / lh - 0.15);
  probe.remove();
  return n;
}

/** Split a long line into pages of at most MAX_LINES: by sentences, a too long one at a comma or dash. */
function paginate(text: string): string[] {
  if (linesOf(text) <= MAX_LINES) return [text];
  const pieces: string[] = [];
  for (const sentence of text.match(/[^.!?…]+[.!?…]+[»”"]?\s*|[^.!?…]+$/g) || [text]) {
    if (linesOf(sentence) <= MAX_LINES) pieces.push(sentence);
    else pieces.push(...(sentence.match(/[^,—:;]+[,—:;]\s*|[^,—:;]+$/g) || [sentence]));
  }
  const out: string[] = [];
  for (const p of pieces) {
    const last = out[out.length - 1];
    if (last !== undefined && linesOf(last + p) <= MAX_LINES) out[out.length - 1] = last + p;
    else out.push(p);
  }
  return out.map((p) => p.trim());
}

function showPages(text: string) {
  clearInterval(pageTimer);
  pages = paginate(text);
  // each page starts when the voice has read the text before it (by the share of characters)
  pageAt = [];
  let sum = 0;
  for (const p of pages) {
    pageAt.push(sum / text.length);
    sum += p.length + 1;
  }
  page = -1;
  shownFor = 0;
  turnPage(0);
  if (pages.length < 2) return;
  const estimate = 1200 + text.length * 45;
  pageTimer = setInterval(() => {
    if (!stage?.paused) shownFor += 100 * (fastSpeed || 1);
    const progress = speechProgress();
    const k = progress !== null ? progress : Math.min(1, shownFor / estimate);
    let i = 0;
    while (i + 1 < pages.length && pageAt[i + 1] <= k + 0.02) i++;
    turnPage(i);
    if (i === pages.length - 1) clearInterval(pageTimer);
  }, 100);
}

function turnPage(i: number) {
  if (i === page) return;
  page = i;
  const el = $('caption-text');
  el.textContent = pages[i];
  el.classList.remove('turn');
  // restart the fade-in
  void el.offsetWidth;
  if (i > 0) el.classList.add('turn');
}

// ---------- the tale ----------
// the stage and the teller: a script of their own, fetched with the first tale opened
let stage: Stage | null = null;
let TellerOf: typeof Teller | null = null;
let teller: Teller | null = null;
let current: Story | null = null;
let fastSpeed = 0;

const ui: TellerUi = {
  caption(who, name, text) {
    const c = $('caption');
    c.hidden = false;
    c.setAttribute('data-who', who);
    $('caption-who').textContent = name;
    $('caption-who').hidden = !name;
    showPages(text);
  },
  hideCaption() {
    clearInterval(pageTimer);
    $('caption').hidden = true;
  },
  showChoices(_question, options, pick) {
    const box = $('choices');
    box.innerHTML = '';
    options.forEach((o, i) => {
      const b = document.createElement('button');
      b.className = 'choice';
      b.innerHTML = `<span class="choice-icon"></span><span class="choice-label"></span>`;
      (b.firstChild as HTMLElement).textContent = o.icon;
      (b.lastChild as HTMLElement).textContent = o.label;
      b.addEventListener('click', () => pick(i));
      box.appendChild(b);
    });
    box.hidden = false;
    $('play').classList.add('choosing');
  },
  highlightChoice(i) {
    const buttons = $('choices').children;
    for (let k = 0; k < buttons.length; k++) buttons[k].classList.toggle('reading', k === i);
  },
  hideChoices() {
    $('choices').hidden = true;
    $('play').classList.remove('choosing');
  },
  scene(name) {
    // at home (no road, the kolobok on a windowsill or a table) the sky is the characters', so the
    // subtitles go down onto the meadow / floor; on the road they stay up in the sky
    $('play').classList.toggle('captions-low', HOME_SCENES.indexOf(name) >= 0);
  },
  curtain(closed) {
    const c = $('curtain');
    c.classList.toggle('closed', closed);
    return stage!.wait(450);
  },
};

function show(screen: 'library' | 'play' | 'heroes') {
  $('library').hidden = screen !== 'library';
  $('play').hidden = screen !== 'play';
  $('heroes').hidden = screen !== 'heroes';
}

// ---------- the purse and the heroes ----------
function drawPurses() {
  for (const id of ['purse', 'heroes-purse']) $(id).innerHTML = `${COIN}<b>${progress.coins()}</b>`;
}
progress.onChange(drawPurses);
// DEBUG=TRUE builds: the purse topped up to 100 000 on every start, to try the whole wardrobe
if (__DEBUG__ && progress.coins() < 100000) progress.addCoins(100000 - progress.coins());
const heroIds = heroesOf(TALE_LIST).map((h) => h.id);
// saves from before the heroes' page: who was met isn't known, so it's worked out from the tales
// heard — the heroes of the scenes heard (or of the whole tale, if only its endings were kept)
for (const story of TALE_LIST) {
  if (!found(story).length) continue;
  const heard = progress.heard(story.id);
  for (const [name, who] of Object.entries(story.shows)) {
    if (heard.length && heard.indexOf(name) < 0) continue;
    for (const actor of who) if (heroIds.indexOf(actor) >= 0) progress.meet(actor);
  }
}
/** The stage and the teller (fetched once, with the first tale). */
async function player(): Promise<Stage> {
  if (stage) return stage;
  const [st, en] = await Promise.all([import('./stage'), import('./engine')]);
  if (stage) return stage;
  TellerOf = en.Teller;
  stage = new st.Stage($('stage-host'));
  stage.speed = fastSpeed || 1;
  // a hero met in a tale goes on the heroes' shelves; a dressed one wears its things there too
  // (fetched with the tale: prepare)
  stage.onShow = (actor, g) => {
    if (heroIds.indexOf(actor) < 0) return;
    progress.meet(actor);
    dress(g, actor, outfitOf(actor));
  };
  return stage;
}

/** the heroes' page: a script of its own, fetched when first opened */
let heroesPage: Promise<typeof import('./heroes-page')> | null = null;
function loadHeroesPage() {
  return (heroesPage ||= import('./heroes-page').then((hp) => {
    hp.initHeroes(TALE_LIST);
    hp.wireHeroes();
    return hp;
  }));
}
let heroesIntroSaid = false;
$('btn-heroes').addEventListener('click', () => {
  unlockAudio();
  stopSpeech();
  show('heroes');
  // the page's script still coming (the first time): a spinner meanwhile
  if (!$('hero-grid').children.length) $('hero-grid').innerHTML = '<div class="grid-wait"><span class="spinner"></span></div>';
  void loadHeroesPage().then((hp) => {
    hp.renderHeroes();
    if (!heroesIntroSaid) {
      heroesIntroSaid = true;
      hp.sayHeroesIntro(TALE_LIST[0].voices.narrator);
    }
  });
});
$('heroes-back').addEventListener('click', () => {
  stopSpeech();
  renderShelf();
  show('library');
  updateIfWaiting();
});

// ---------- the pause ----------
function setPaused(on: boolean) {
  if (stage) stage.paused = on;
  $('paused').hidden = !on;
  $('btn-pause').textContent = on ? '▶' : '⏸';
  if (on) pauseSpeech();
  else resumeSpeech();
}

$('btn-pause').addEventListener('click', () => setPaused(!stage?.paused));

// to the previous line: in a tale she has already heard to an ending (any one); to the next line:
// only in a scene she has heard on a way to an ending — a new branch is listened to, not skipped.
// DEBUG=TRUE builds: both, everywhere.
function showSkip(story: Story, scene?: string) {
  $('btn-back').hidden = !(__DEBUG__ || found(story).length > 0);
  $('btn-next').hidden = !(__DEBUG__ || (!!scene && progress.heard(story.id).indexOf(scene) >= 0));
}
$('btn-back').addEventListener('click', () => {
  setPaused(false);
  teller?.back();
});
$('btn-next').addEventListener('click', () => {
  setPaused(false);
  teller?.forward();
});
$('paused').addEventListener('click', () => {
  unlockAudio();
  setPaused(false);
});
// the iPad's screen locked, or another app opened: the tale waits for her
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' && teller && $('ending').hidden) setPaused(true);
});

async function openTale(story: Story, from?: string) {
  unlockAudio();
  setPaused(false);
  teller?.stop();
  current = story;
  showSkip(story);
  $('ending').hidden = true;
  $('btn-pause').hidden = false;
  show('play');
  const t = new TellerOf!(story, await player(), ui);
  t.fast = fastSpeed > 0;
  t.onScene = (scene) => showSkip(story, scene);
  teller = t;
  const ending = await t.tell(from);
  if (ending) progress.rememberHeard(story.id, t.played);
  if (ending && teller === t) await showEnding(story, ending);
}

async function showEnding(story: Story, ending: string) {
  const before = found(story);
  const coins = progress.reachEnding(story.id, ending, Object.keys(story.endings));
  const got = found(story);
  // the coins for it fly in on the card
  const reward = $('ending-reward');
  reward.innerHTML = `+${coins} ${COIN}`;
  reward.hidden = false;
  reward.classList.remove('pop');
  void reward.offsetWidth;
  reward.classList.add('pop');
  const e = story.endings[ending];
  $('ending-icon').textContent = e.icon;
  $('ending-title').textContent = e.title;
  const keys = Object.keys(story.endings);
  $('ending-found').innerHTML = '';
  for (const k of keys) {
    const slot = document.createElement('span');
    slot.className = 'slot' + (got.indexOf(k) >= 0 ? ' got' : '') + (k === ending ? ' now' : '');
    slot.textContent = got.indexOf(k) >= 0 ? story.endings[k].icon : '?';
    $('ending-found').appendChild(slot);
  }
  $('ending-note').textContent = `Знайдено ${got.length} з ${keys.length}`;
  $('ending').hidden = false;
  $('btn-pause').hidden = true;
  if (fastSpeed) return;
  const narrator = story.voices.narrator;
  await say(narrator, endingPhrase(e));
  if (!$('ending').hidden)
    await say(narrator, got.length === keys.length && before.length < keys.length ? COMMON.allFound : COMMON.outro);
}

function toLibrary() {
  setPaused(false);
  teller?.stop();
  teller = null;
  current = null;
  stopSpeech();
  // the tale and its recordings are let go
  dropPrep();
  $('loading').hidden = true;
  $('ending').hidden = true;
  renderShelf();
  show('library');
  updateIfWaiting();
}

$('btn-home').addEventListener('click', toLibrary);
$('btn-library').addEventListener('click', toLibrary);
$('btn-again').addEventListener('click', () => current && openTale(current));
$('btn-sound').addEventListener('click', () => {
  setSpeechEnabled(!speechEnabled());
  $('btn-sound').textContent = speechEnabled() ? '🔊' : '🔇';
});

// ---------- a new version on the server ----------
// Opened from the iPad's home screen, the app is kept asleep for days and woken up as it was: a
// new version never comes. So when it comes back to the screen (and every so often), it asks the
// server for the page and compares the script the page loads (its name changes with every build).
// A new one: the page reloads — at once on the shelf, else as soon as she is back on it (never in
// the middle of a tale). Progress is in localStorage: a reload keeps it.
let newVersion = false;
const ourScript = (() => {
  const s = document.querySelector<HTMLScriptElement>('script[type="module"][src*="/assets/"]');
  return s ? new URL(s.src, location.href).pathname : '';
})();

/** on the shelf (or the heroes' page), with nothing open: a reload loses nothing */
const atRest = () =>
  ($('library').hidden === false || $('heroes').hidden === false) && $('tale-card').hidden && $('hero-card').hidden;

function updateIfWaiting() {
  if (newVersion && atRest()) location.reload();
}

async function checkVersion() {
  // the dev server has no built script: nothing to compare
  if (newVersion) return updateIfWaiting();
  if (!ourScript || !navigator.onLine) return;
  try {
    const r = await fetch(`${location.pathname}?fresh=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) return;
    const m = /<script[^>]+type="module"[^>]+src="([^"]+)"/.exec(await r.text());
    if (!m) return;
    if (new URL(m[1], location.href).pathname !== ourScript) {
      newVersion = true;
      updateIfWaiting();
    }
  } catch {
    // offline or the server asleep: next time
  }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') void checkVersion();
});
window.addEventListener('pageshow', () => void checkVersion());
setInterval(() => void checkVersion(), 10 * 60 * 1000);
void checkVersion();

// the moon on the shelf: a tap reloads the page (a fresh start, the newest version)
$('moon').addEventListener('click', () => location.reload());

renderShelf();
drawPurses();
show('library');

// ---------- debugging ----------
(window as unknown as { tale: unknown }).tale = {
  get stage() {
    return stage;
  },
  get teller() {
    return teller;
  },
  stories: TALE_LIST,
  /** start a tale (default: the first) from a scene; for a scene that doesn't set its backdrop, give one (the kolobok waits there) */
  async go(scene?: string, backdrop?: string, id = SHELF[0]) {
    const s = await fetchStory(id);
    const st = await player();
    if (backdrop) {
      st.setScene(backdrop);
      ui.scene(backdrop);
      st.show('kolobok', [560, 770]);
    }
    return openTale(s, scene);
  },
  /** n× faster, no voice (0: back to normal) */
  fast(n = 4) {
    fastSpeed = n;
    if (stage) stage.speed = n || 1;
    if (teller) teller.fast = n > 0;
  },
  /** how a line would be split into subtitle pages */
  pages: (text: string) => paginate(text),
  forget() {
    progress.forget();
    renderShelf();
  },
  /** coins to try the shop with */
  coins(n = 100) {
    progress.addCoins(n);
  },
};
