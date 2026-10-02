// Tells a tale: plays the steps of a scene one after another on the stage, speaks the lines with
// subtitles, offers the choices (reading the question and every option aloud — a five-year-old
// can't read the buttons yet) and finishes on an ending. Leaving the tale midway cancels it.

import { preload, say, stopSpeech } from './speech';
import type { Stage } from './stage';
import { optionPhrase, type ChoiceOption, type Step, type Story } from './story';

export interface TellerUi {
  caption(who: string, name: string, text: string): void;
  hideCaption(): void;
  /** show the buttons; `reading` marks the option being read aloud (-1: none) */
  showChoices(question: string, options: ChoiceOption[], pick: (i: number) => void): void;
  highlightChoice(i: number): void;
  hideChoices(): void;
  curtain(closed: boolean): Promise<void>;
  /** the backdrop changed (the subtitles' place depends on it) */
  scene(name: string): void;
}

class Cancelled extends Error {}

export class Teller {
  /** for tests: lines are not spoken, just shown briefly */
  fast = false;
  private run = 0;
  private abortChoice: (() => void) | null = null;

  constructor(
    private story: Story,
    private stage: Stage,
    private ui: TellerUi,
  ) {}

  /** Tell from this scene on; resolves with the ending reached (null if left midway). */
  async tell(from = this.story.start): Promise<string | null> {
    let run = ++this.run;
    let scene = from;
    let skipTo = -1;
    try {
      for (;;) {
        try {
          this.preloadAround(scene);
          const next = await this.playScene(scene, run, skipTo);
          skipTo = -1;
          if (next.ending) return next.ending;
          this.trail.push(scene);
          scene = next.scene!;
        } catch (e) {
          // the debug buttons: start this (or the previous) scene over, quickly up to a line
          if (e instanceof Cancelled && this.jumpTo) {
            ({ scene, skipTo } = this.jumpTo);
            this.jumpTo = null;
            run = this.run;
            continue;
          }
          throw e;
        }
      }
    } catch (e) {
      if (e instanceof Cancelled) return null;
      throw e;
    } finally {
      this.stage.rush = 1;
      if (run === this.run) {
        this.ui.hideCaption();
        this.ui.hideChoices();
        this.stage.setTalking(null);
      }
    }
  }

  // ---------- debug: to the next / previous line ----------

  /** scenes told before the current one */
  private trail: string[] = [];
  /** the step being played */
  private at = { scene: '', step: 0 };
  private jumpTo: { scene: string; skipTo: number } | null = null;

  /** Skip to the next line: the current one stops, whatever happens before the next runs fast. */
  forward() {
    const s = this.story.scenes[this.at.scene]?.[this.at.step];
    if (!s || s.kind === 'choice') return;
    this.stage.rush = 25;
    stopSpeech();
  }

  /** Back to the previous line: the scene starts over and runs quickly up to it. */
  back() {
    const steps = this.story.scenes[this.at.scene];
    if (!steps) return;
    const lines = (n: string) => this.story.scenes[n].map((s, i) => (s.kind === 'say' ? i : -1)).filter((i) => i >= 0);
    const before = lines(this.at.scene).filter((i) => i < this.at.step);
    if (before.length) return this.jump(this.at.scene, before[before.length - 1]);
    const prev = this.trail.pop();
    if (prev) {
      const l = lines(prev);
      return this.jump(prev, l.length ? l[l.length - 1] : 0);
    }
    this.jump(this.at.scene, -1);
  }

  private jump(scene: string, skipTo: number) {
    this.jumpTo = { scene, skipTo };
    this.run++;
    this.stage.rush = 40;
    stopSpeech();
    this.abortChoice?.();
    this.ui.hideChoices();
  }

  stop() {
    this.jumpTo = null;
    this.run++;
    stopSpeech();
    this.abortChoice?.();
    this.ui.hideCaption();
    this.ui.hideChoices();
    this.stage.setTalking(null);
  }

  private check(run: number) {
    if (run !== this.run) throw new Cancelled();
  }

  private async playScene(name: string, run: number, skipTo = -1): Promise<{ scene?: string; ending?: string }> {
    const steps = this.story.scenes[name];
    for (let i = 0; i < steps.length; i++) {
      const s = steps[i];
      this.check(run);
      this.at = { scene: name, step: i };
      // jumping back: the lines before the target are skipped, the rest runs fast
      if (i < skipTo) {
        this.stage.rush = 40;
        if (s.kind === 'say') continue;
      } else if (i === skipTo) this.stage.rush = 1;
      const out = await this.step(s, run);
      this.check(run);
      if (out) return out;
    }
    throw new Error(`scene "${name}" ends without next, choice or ending`);
  }

  private async step(s: Step, run: number): Promise<{ scene?: string; ending?: string } | void> {
    const stage = this.stage;
    switch (s.kind) {
      case 'say':
        return this.speak(s.who, s.text, s.sing);
      case 'scene':
        if (stage.scene) await this.ui.curtain(true);
        this.check(run);
        stage.setScene(s.scene);
        this.ui.scene(s.scene);
        void this.ui.curtain(false);
        return;
      case 'show':
        stage.show(s.actor, s.at, !!s.flip, s.eyes !== 'closed', !!s.raw, s.look, s.size);
        return;
      case 'resize':
        return stage.resize(s.actor, s.to, s.ms);
      case 'enter':
        await stage.enter(s.actor, s.into);
        return;
      case 'hide':
        stage.hide(s.actor);
        return;
      case 'move': {
        const p = stage.moveTo(s.actor, s.to, s.ms, { hop: s.hop, roll: s.roll, flip: s.flip });
        if (s.wait) await p;
        return;
      }
      case 'carry':
        stage.carry(s.actor, s.by);
        return;
      case 'put':
        return stage.moveTo(s.actor, s.to, s.ms, { hop: true });
      case 'roll':
        stage.setRolling(s.on);
        return;
      case 'eyes':
        stage.setEyes(s.actor, s.open);
        return;
      case 'fx':
        return stage.fx(s.fx, s.on, s.at, s.who);
      case 'pause':
        return stage.wait(s.ms);
      case 'choice':
        return { scene: s.options[await this.choose(s.question, s.options, run)].next };
      case 'next':
        return { scene: s.scene };
      case 'ending':
        return { ending: s.ending };
    }
  }

  private async speak(who: string, text: string, sing = false) {
    // a skip forward ends here, at the next line
    this.stage.rush = 1;
    const voice = this.story.voices[who];
    this.ui.caption(who, voice.name, text);
    this.stage.setTalking(who === 'narrator' ? null : who, sing);
    if (this.fast) await this.stage.wait(250);
    else await say(voice, text);
    this.stage.setTalking(null);
  }

  /** Offer a choice; resolves with the option picked. */
  private choose(question: string, options: ChoiceOption[], run: number): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      let picked = false;
      this.abortChoice = () => {
        picked = true;
        reject(new Cancelled());
      };
      this.ui.showChoices(question, options, (i) => {
        if (picked) return;
        picked = true;
        this.abortChoice = null;
        stopSpeech();
        this.ui.hideChoices();
        this.ui.hideCaption();
        resolve(i);
      });
      // read the question and each option, lighting up its button
      const narrator = this.story.voices.narrator;
      const read = async () => {
        this.ui.caption('narrator', '', question);
        if (this.fast) return;
        await say(narrator, question);
        for (let i = 0; i < options.length && !picked && run === this.run; i++) {
          this.ui.highlightChoice(i);
          await say(narrator, optionPhrase(options[i]));
        }
        if (!picked) this.ui.highlightChoice(-1);
      };
      void read();
    });
  }

  /** Phrases of this scene and of the ones it can lead to, fetched ahead (the voice starts at once). */
  private preloadAround(name: string) {
    const v = this.story.voices;
    const lines = (scene: string) => {
      const out: { voice: (typeof v)[string]; text: string }[] = [];
      for (const s of this.story.scenes[scene]) {
        if (s.kind === 'say') out.push({ voice: v[s.who], text: s.text });
        if (s.kind === 'choice') {
          out.push({ voice: v.narrator, text: s.question });
          for (const o of s.options) out.push({ voice: v.narrator, text: optionPhrase(o) });
        }
      }
      return out;
    };
    const steps = this.story.scenes[name];
    const next = steps.flatMap((s) => (s.kind === 'next' ? [s.scene] : s.kind === 'choice' ? s.options.map((o) => o.next) : []));
    preload([...lines(name), ...next.flatMap((n) => lines(n).slice(0, 4))]);
  }
}
