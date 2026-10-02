# Казкова стежка

Українські народні казки, у яких дитина сама вибирає, що буде далі. Поки що — «Колобок» (4 кінцівки).
Працює на iPad і в браузері, зокрема на старих iPad з iOS 12.

```bash
npm install
npm run dev          # http://localhost:5220 (і з iPad у тій самій Wi‑Fi)
npm run check        # типи + збірка + синтаксис Safari 12
```

## Як влаштовано

- `stories/<казка>.yaml` — сама казка: сцени, репліки, вибори, кінцівки (усі кроки описані в шапці `kolobok.yaml`).
- `src/characters.ts` — персонажі (SVG-ляльки), `src/stage.ts` — фони, анімація, ефекти, `src/engine.ts` — оповідач.
- Налагодження в консолі: `tale.go('fox')` — почати зі сцени, `tale.fast(4)` — швидко й без голосу, `tale.forget()` — забути знайдені кінцівки.

## Озвучка

Усі фрази записані заздалегідь у `public/voice/` (на iOS 12 немає українського голосу).

- `npm run voice` — чернетка голосом Lesya з macOS (кожен персонаж — своя висота й швидкість).
- `npm run voice:el` — ElevenLabs: оповідачка Кіра, у персонажів свої голоси (`scripts/elevenlabs-config.json`).
  Ключ — у `.env.local` (`ELEVENLABS_API_KEY=…`, у git не потрапляє). Прогрес — `scripts/elevenlabs-progress.json`.
- `npm run voice:samples` — проба голосів-кандидатів → http://localhost:5220/voice-samples/
- Після зміни текстів: `npm run voice:all`.

## Викладка

Render, static site за `render.yaml`.
