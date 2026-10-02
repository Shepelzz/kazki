// The app: a shelf of tales, and the tale itself (stage, subtitles, choices, the ending card).
// Debug: window.tale — tale.go('fox') starts from a scene, tale.fast(4) plays 4× quicker without
// the voice, tale.stage / tale.teller for poking around.

import './style.css';
import { makePuppet, el } from './characters';
import { Teller, type TellerUi } from './engine';
import { pauseSpeech, resumeSpeech, say, speechProgress, setSpeechEnabled, speechEnabled, stopSpeech, unlockAudio } from './speech';
import { Stage } from './stage';
import { COMMON, endingPhrase, parseStory, type Story } from './story';
import kolobokRaw from '../stories/kolobok.yaml';
import rukavychkaRaw from '../stories/rukavychka.yaml';
import kozaRaw from '../stories/koza-dereza.yaml';
import kotskyiRaw from '../stories/pan-kotskyi.yaml';

const STORIES: Story[] = [parseStory('kolobok', kolobokRaw), parseStory('rukavychka', rukavychkaRaw), parseStory('koza-dereza', kozaRaw), parseStory('pan-kotskyi', kotskyiRaw)];
/** tales still being written: shown on the shelf as "soon" */
const SOON = [
  { title: 'Котик і Півник', icon: '🐓' },
  { title: 'Солом’яний бичок', icon: '🐂' },
  { title: 'Лисичка і Журавель', icon: '🐦' },
  { title: 'Котигорошко', icon: '💪' },
  { title: 'Івасик-Телесик', icon: '🛶' },
  { title: 'Сірко', icon: '🐕' },
  { title: 'Кирило Кожум’яка', icon: '🐉' },
  { title: 'Лисичка-сестричка і вовк-панібрат', icon: '🐺' },
];

/** backdrops with no road: subtitles at the bottom there */
const HOME_SCENES = ['hata', 'hata-evening', 'hata-winter', 'pich', 'pich-evening'];

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ---------- endings found, per tale (only this browser remembers them) ----------
function found(story: Story): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(`kazky:endings:${story.id}`) || '[]');
    return Array.isArray(v) ? v.filter((e) => e in story.endings) : [];
  } catch {
    return [];
  }
}
function remember(story: Story, ending: string) {
  const all = found(story);
  if (all.indexOf(ending) < 0) all.push(ending);
  try {
    localStorage.setItem(`kazky:endings:${story.id}`, JSON.stringify(all));
  } catch {
    // private mode: forgotten next time, that's all
  }
}

// ---------- the shelf ----------
/** the part of each cover puppet to show on its card */
const COVER_VIEW: Record<string, string> = {
  kolobok: '-90 -130 180 150',
  rukavychka: '-150 -320 300 350',
  koza: '-130 -270 250 290',
  kit: '-110 -250 230 270',
};

function cover(story: Story) {
  const svgEl = el('svg', { viewBox: COVER_VIEW[story.cover] || '-200 -400 400 420', class: 'cover-art' });
  svgEl.appendChild(makePuppet(story.cover));
  return svgEl;
}

function renderShelf() {
  const shelf = $('shelf');
  shelf.innerHTML = '';
  for (const story of STORIES) {
    const card = document.createElement('button');
    card.className = 'book';
    const art = document.createElement('div');
    art.className = 'book-art book-art-' + story.id;
    art.appendChild(cover(story));
    const title = document.createElement('div');
    title.className = 'book-title';
    title.textContent = story.title;
    const got = found(story);
    const stars = document.createElement('div');
    stars.className = 'book-endings';
    stars.textContent = Object.keys(story.endings)
      .map((k) => (got.indexOf(k) >= 0 ? story.endings[k].icon : '•'))
      .join(' ');
    card.append(art, title, stars);
    card.addEventListener('click', () => openTale(story));
    shelf.appendChild(card);
  }
  for (const s of SOON) {
    const card = document.createElement('div');
    card.className = 'book soon';
    card.innerHTML = `<div class="book-art"><span class="soon-icon">${s.icon}</span></div><div class="book-title">${s.title}</div><div class="book-endings">скоро</div>`;
    shelf.appendChild(card);
  }
}

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
    if (!stage.paused) shownFor += 100 * (fastSpeed || 1);
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
const stage = new Stage($('stage-host'));
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
    return stage.wait(450);
  },
};

function show(screen: 'library' | 'play') {
  $('library').hidden = screen !== 'library';
  $('play').hidden = screen !== 'play';
}

// ---------- the pause ----------
function setPaused(on: boolean) {
  stage.paused = on;
  $('paused').hidden = !on;
  $('btn-pause').textContent = on ? '▶' : '⏸';
  if (on) pauseSpeech();
  else resumeSpeech();
}

$('btn-pause').addEventListener('click', () => setPaused(!stage.paused));

// DEBUG=TRUE builds: to the previous / next line
if (__DEBUG__) {
  $('btn-back').hidden = false;
  $('btn-next').hidden = false;
  $('btn-back').addEventListener('click', () => {
    setPaused(false);
    teller?.back();
  });
  $('btn-next').addEventListener('click', () => {
    setPaused(false);
    teller?.forward();
  });
}
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
  $('ending').hidden = true;
  $('btn-pause').hidden = false;
  show('play');
  const t = new Teller(story, stage, ui);
  t.fast = fastSpeed > 0;
  teller = t;
  const ending = await t.tell(from);
  if (ending && teller === t) await showEnding(story, ending);
}

async function showEnding(story: Story, ending: string) {
  const before = found(story);
  remember(story, ending);
  const got = found(story);
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
  stopSpeech();
  $('ending').hidden = true;
  renderShelf();
  show('library');
}

$('btn-home').addEventListener('click', toLibrary);
$('btn-library').addEventListener('click', toLibrary);
$('btn-again').addEventListener('click', () => current && openTale(current));
$('btn-sound').addEventListener('click', () => {
  setSpeechEnabled(!speechEnabled());
  $('btn-sound').textContent = speechEnabled() ? '🔊' : '🔇';
});

renderShelf();
show('library');

// ---------- debugging ----------
(window as unknown as { tale: unknown }).tale = {
  stage,
  get teller() {
    return teller;
  },
  stories: STORIES,
  /** start a tale (default: the first) from a scene; for a scene that doesn't set its backdrop, give one (the kolobok waits there) */
  go(scene?: string, backdrop?: string, id = STORIES[0].id) {
    const s = STORIES.find((x) => x.id === id)!;
    if (backdrop) {
      stage.setScene(backdrop);
      ui.scene(backdrop);
      stage.show('kolobok', [560, 770]);
    }
    return openTale(s, scene);
  },
  /** n× faster, no voice (0: back to normal) */
  fast(n = 4) {
    fastSpeed = n;
    stage.speed = n || 1;
    if (teller) teller.fast = n > 0;
  },
  /** how a line would be split into subtitle pages */
  pages: (text: string) => paginate(text),
  forget() {
    for (const s of STORIES) localStorage.removeItem(`kazky:endings:${s.id}`);
    renderShelf();
  },
};
