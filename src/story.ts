// A tale is a graph of scenes (stories/<tale>.yaml): each scene is a list of steps played one after
// another — someone speaks, an actor moves, the background changes — and ends with a choice, a jump
// to another scene, or an ending. The comment at the top of kolobok.yaml describes every step.

import type { Voice } from './voiceKey';

export type Point = [number, number];

/**
 * along: true — the step starts and the next one goes on at once (an action during a line);
 * delay: ms — such a step starts that much later (rolling off near the end of the line)
 */
export type Step = { along?: boolean; delay?: number } & (
  /** speak: what the voice is given, when it is spelled otherwise than shown (see spelled()) */
  | { kind: 'say'; who: string; text: string; speak?: string; sing?: boolean }
  | { kind: 'scene'; scene: string }
  | { kind: 'show'; actor: string; at: Point; flip?: boolean; eyes?: 'open' | 'closed'; raw?: boolean; look?: string; size?: number }
  | { kind: 'resize'; actor: string; to: number; ms: number }
  | { kind: 'enter'; actor: string; into: string }
  | { kind: 'hide'; actor: string }
  | { kind: 'move'; actor: string; to: Point; ms: number; hop?: boolean; roll?: boolean; flip?: boolean; wait?: boolean }
  | { kind: 'carry'; actor: string; by: string }
  | { kind: 'put'; actor: string; to: Point; ms: number }
  | { kind: 'roll'; on: boolean; fast?: boolean }
  | { kind: 'eyes'; actor: string; open: boolean }
  | { kind: 'fx'; fx: string; on?: string; at?: Point; who?: string[]; word?: string }
  | { kind: 'pause'; ms: number }
  | { kind: 'choice'; question: string; options: ChoiceOption[] }
  | { kind: 'next'; scene: string }
  | { kind: 'ending'; ending: string }
);

export interface ChoiceOption {
  label: string;
  icon: string;
  next: string;
}

export interface Ending {
  title: string;
  icon: string;
}

export interface Story {
  id: string;
  title: string;
  cover: string;
  /** what it is about, in a sentence or two: shown and said on the tale's card */
  about: string;
  /** the title as said aloud, when written differently ("Частина 2") */
  sayTitle?: string;
  voices: Record<string, Voice>;
  endings: Record<string, Ending>;
  start: string;
  scenes: Record<string, Step[]>;
}

/** What the shelf knows of a tale before it is fetched (virtual:tales). */
export type TaleInfo = Pick<Story, 'id' | 'title' | 'cover' | 'about' | 'sayTitle' | 'voices' | 'endings'> & {
  /** scene → who comes on in it */
  shows: Record<string, string[]>;
};

type Raw = Record<string, any>;

/** Turns the YAML form (`- kolobok: "…"`, `- move: zayets`) into typed steps, checking links. */
/**
 * A line may spell a word for the voice otherwise than for the eyes: {мишку|мышку} — the
 * subtitle shows «мишку», the voice is given «мышку» (ElevenLabs reads the Ukrainian «и» as «і»
 * in some words).
 */
export function spelled(line: string): { text: string; speak?: string } {
  const text = line.replace(/\{([^|{}]*)\|([^{}]*)\}/g, '$1');
  const speak = line.replace(/\{([^|{}]*)\|([^{}]*)\}/g, '$2');
  return speak === text ? { text } : { text, speak };
}

export function parseStory(id: string, raw: Raw): Story {
  const voices = raw.voices as Record<string, Voice>;
  const scenes: Record<string, Step[]> = {};
  const fail = (scene: string, i: number, msg: string): never => {
    throw new Error(`${id}.yaml, scene "${scene}", step ${i + 1}: ${msg}`);
  };
  for (const [name, steps] of Object.entries(raw.scenes as Record<string, Raw[]>)) {
    scenes[name] = steps.map((s, i): Step => ({ ...parseStep(s, i), ...(s.along ? { along: true, delay: s.delay || 0 } : {}) }) as Step);
    function parseStep(s: Raw, i: number): Step {
      const who = Object.keys(s).find((k) => k in voices);
      if (who) return { kind: 'say', who, ...spelled(String(s[who])), sing: !!s.sing };
      if ('scene' in s) return { kind: 'scene', scene: s.scene };
      if ('show' in s) return { kind: 'show', actor: s.show, at: s.at ?? fail(name, i, 'show needs at'), flip: s.flip, eyes: s.eyes, raw: s.raw, look: s.look, size: s.size };
      if ('resize' in s) return { kind: 'resize', actor: s.resize, to: s.to ?? fail(name, i, 'resize needs to'), ms: s.ms ?? 800 };
      if ('enter' in s) return { kind: 'enter', actor: s.enter, into: s.into ?? fail(name, i, 'enter needs into') };
      if ('hide' in s) return { kind: 'hide', actor: s.hide };
      if ('move' in s)
        return { kind: 'move', actor: s.move, to: s.to ?? fail(name, i, 'move needs to'), ms: s.ms ?? 1500, hop: s.hop, roll: s.roll, flip: s.flip, wait: s.wait };
      if ('carry' in s) return { kind: 'carry', actor: s.carry, by: s.by ?? fail(name, i, 'carry needs by') };
      if ('put' in s) return { kind: 'put', actor: s.put, to: s.to ?? fail(name, i, 'put needs to'), ms: s.ms ?? 700 };
      if ('roll' in s) return { kind: 'roll', on: !!s.roll, fast: s.roll === 'fast' };
      if ('eyes' in s) return { kind: 'eyes', actor: s.eyes, open: s.state !== 'closed' };
      if ('fx' in s) return { kind: 'fx', fx: s.fx, on: s.on, at: s.at, who: s.who, word: s.word };
      if ('pause' in s) return { kind: 'pause', ms: s.pause };
      if ('choice' in s) return { kind: 'choice', question: s.choice, options: s.options };
      if ('next' in s) return { kind: 'next', scene: s.next };
      if ('ending' in s) return { kind: 'ending', ending: s.ending };
      return fail(name, i, `unknown step ${JSON.stringify(s)}`);
    }
  }
  const story: Story = { id, title: raw.title, cover: raw.cover, about: raw.about || '', sayTitle: raw.sayTitle, voices, endings: raw.endings, start: raw.start, scenes };
  // every link must lead somewhere: a typo would strand the child mid-tale
  for (const [name, steps] of Object.entries(scenes))
    steps.forEach((s, i) => {
      const targets = s.kind === 'next' ? [s.scene] : s.kind === 'choice' ? s.options.map((o) => o.next) : [];
      for (const t of targets) if (!scenes[t]) fail(name, i, `no scene "${t}"`);
      if (s.kind === 'ending' && !story.endings[s.ending]) fail(name, i, `no ending "${s.ending}"`);
    });
  if (!scenes[story.start]) throw new Error(`${id}.yaml: no start scene "${story.start}"`);
  return story;
}

/** A phrase the app says aloud: who says it and what. */
export interface Phrase {
  who: string;
  text: string;
}

/** Words said between scenes, the same for every tale. */
export const COMMON = {
  outro: 'Ось і казочці кінець! Хочеш послухати ще раз і вибрати по-іншому?',
  allFound: 'Ого! Ти знайшла всі кінцівки цієї казки! Молодчинка!',
  heroes: 'Це твої герої! Натисни на героя — і він із тобою привітається.',
  hidden: 'Цей герой ще ховається в казці. Послухай казки — і ти його знайдеш!',
  bought: 'Ось так краса!',
  notEnough: 'Ще треба монеток. Шукай нові кінцівки в казках!',
};

/** Everything a tale says aloud: lines, choice questions and options (read for a child who can't read yet). */
export function spokenPhrases(story: Story): Phrase[] {
  const out: Phrase[] = [];
  for (const steps of Object.values(story.scenes))
    for (const s of steps) {
      if (s.kind === 'say') out.push({ who: s.who, text: s.speak || s.text });
      if (s.kind === 'choice') {
        out.push({ who: 'narrator', text: s.question });
        for (const o of s.options) out.push({ who: 'narrator', text: optionPhrase(o) });
      }
    }
  for (const e of Object.values(story.endings)) out.push({ who: 'narrator', text: endingPhrase(e) });
  for (const t of Object.values(COMMON)) out.push({ who: 'narrator', text: t });
  if (story.about) out.push({ who: 'narrator', text: aboutPhrase(story) });
  for (const [who, v] of Object.entries(story.voices)) if (v.hello) out.push({ who, text: v.hello });
  return out;
}

export const optionPhrase = (o: ChoiceOption) => `${o.label.replace(/[!.]+$/, '')}?`;
export const endingPhrase = (e: Ending) => `Кінцівка «${e.title}».`;
/** said when the tale's card opens: its name, then what it is about */
export const aboutPhrase = (s: Pick<Story, 'title' | 'sayTitle' | 'about'>) => `${s.sayTitle || s.title}. ${s.about}`;
