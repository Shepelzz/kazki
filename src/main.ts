// The app: a shelf of tales, and the tale itself (stage, subtitles, choices, the ending card).
// Debug: window.tale — tale.go('fox') starts from a scene, tale.fast(4) plays 4× quicker without
// the voice, tale.stage / tale.teller for poking around.

import './style.css';
import { makePuppet, el } from './characters';
import { Teller, type TellerUi } from './engine';
import { pauseSpeech, resumeSpeech, say, speechProgress, setSpeechEnabled, speechEnabled, stopSpeech, unlockAudio } from './speech';
import { Stage } from './stage';
import { aboutPhrase, COMMON, endingPhrase, parseStory, type Story } from './story';
import { progress } from './progress';
import { COIN, heroesOf, initHeroes, outfitOf, renderHeroes, sayHeroesIntro, wireHeroes } from './heroes-page';
import { dress } from './wardrobe';
import kolobokRaw from '../stories/kolobok.yaml';
import rukavychkaRaw from '../stories/rukavychka.yaml';
import kozaRaw from '../stories/koza-dereza.yaml';
import kotskyiRaw from '../stories/pan-kotskyi.yaml';
import sirkoRaw from '../stories/sirko.yaml';
import lysychkaRaw from '../stories/lysychka.yaml';
import telesykRaw from '../stories/telesyk.yaml';
import kyryloRaw from '../stories/kyrylo.yaml';
import kotyhoroshkoRaw from '../stories/kotyhoroshko.yaml';
import bychokRaw from '../stories/solomyanyi-bychok.yaml';
import pivnykRaw from '../stories/kotyk-pivnyk.yaml';
import zhuravelRaw from '../stories/lysychka-zhuravel.yaml';
import kotyhoroshko2Raw from '../stories/kotyhoroshko2.yaml';
import ripkaRaw from '../stories/ripka.yaml';

const STORIES: Story[] = [parseStory('kolobok', kolobokRaw), parseStory('ripka', ripkaRaw), parseStory('rukavychka', rukavychkaRaw), parseStory('koza-dereza', kozaRaw), parseStory('pan-kotskyi', kotskyiRaw), parseStory('sirko', sirkoRaw), parseStory('lysychka', lysychkaRaw), parseStory('telesyk', telesykRaw), parseStory('kyrylo', kyryloRaw), parseStory('kotyhoroshko', kotyhoroshkoRaw),
  parseStory('kotyhoroshko2', kotyhoroshko2Raw), parseStory('solomyanyi-bychok', bychokRaw), parseStory('kotyk-pivnyk', pivnykRaw), parseStory('lysychka-zhuravel', zhuravelRaw)];
/** tales still being written: shown on the shelf as "soon" */
const SOON: { title: string; icon: string }[] = [];

/** backdrops with no road: subtitles at the bottom there */
const HOME_SCENES = ['hata', 'hata-evening', 'hata-winter', 'hata-night', 'pich', 'pich-evening'];

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

// ---------- endings found, per tale (kept by progress.ts) ----------
function found(story: Story): string[] {
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
}

/** a round slot per ending: the found ones show their picture */
function fillPips(box: HTMLElement, story: Story) {
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
let carded: Story | null = null;
/** the shelf card it was opened from: focus goes back there */
let cardFrom: HTMLElement | null = null;

function openCard(story: Story, from: HTMLElement) {
  unlockAudio();
  carded = story;
  cardFrom = from;
  const art = $('tc-art');
  art.className = 'book-art tc-art book-art-' + story.id;
  art.innerHTML = '';
  art.appendChild(cover(story));
  $('tc-title').textContent = story.title;
  $('tc-about').textContent = story.about;
  fillPips($('tc-endings'), story);
  const box = $('tale-card');
  box.classList.remove('told');
  box.hidden = false;
  // focus inside the dialog (for the keyboard), without a ring on the button for a tap
  $('tale-card').querySelector<HTMLElement>('.tale-card-box')!.focus();
  const told = story;
  void say(story.voices.narrator, aboutPhrase(story)).then(() => {
    // told: the play button calls a little
    if (carded === told) box.classList.add('told');
  });
}

function closeCard() {
  if (!carded) return;
  carded = null;
  stopSpeech();
  $('tale-card').hidden = true;
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
  const story = carded;
  if (!story) return;
  carded = null;
  stopSpeech();
  $('tale-card').hidden = true;
  void openTale(story);
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
initHeroes(STORIES);
wireHeroes();
const heroIds = heroesOf(STORIES).map((h) => h.id);
// saves from before the heroes' page: who was met isn't known, so it's worked out from the tales
// heard — the heroes of the scenes heard (or of the whole tale, if only its endings were kept)
for (const story of STORIES) {
  if (!found(story).length) continue;
  const heard = progress.heard(story.id);
  for (const [name, steps] of Object.entries(story.scenes)) {
    if (heard.length && heard.indexOf(name) < 0) continue;
    for (const st of steps) if (st.kind === 'show' && heroIds.indexOf(st.actor) >= 0) progress.meet(st.actor);
  }
}
// a hero met in a tale goes on the heroes' shelves; a dressed one wears its things there too
stage.onShow = (actor, g) => {
  if (heroIds.indexOf(actor) < 0) return;
  progress.meet(actor);
  dress(g, actor, outfitOf(actor));
};
let heroesIntroSaid = false;
$('btn-heroes').addEventListener('click', () => {
  unlockAudio();
  stopSpeech();
  show('heroes');
  renderHeroes();
  if (!heroesIntroSaid) {
    heroesIntroSaid = true;
    sayHeroesIntro(STORIES[0].voices.narrator);
  }
});
$('heroes-back').addEventListener('click', () => {
  stopSpeech();
  renderShelf();
  show('library');
});

// ---------- the pause ----------
function setPaused(on: boolean) {
  stage.paused = on;
  $('paused').hidden = !on;
  $('btn-pause').textContent = on ? '▶' : '⏸';
  if (on) pauseSpeech();
  else resumeSpeech();
}

$('btn-pause').addEventListener('click', () => setPaused(!stage.paused));

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
  const t = new Teller(story, stage, ui);
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
drawPurses();
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
    progress.forget();
    renderShelf();
  },
  /** coins to try the shop with */
  coins(n = 100) {
    progress.addCoins(n);
  },
};
