// The characters, drawn as flat SVG "paper puppets". Every puppet is built around its feet at (0, 0)
// (y grows downwards, so the body is at negative y), animals face left — towards the kolobok, who
// meets them coming from the right. Live parts are marked for the stage to animate:
//   data-part="body"     the whole figure (bobs when walking, breathes when idle)
//   data-part="eyes"     squashed for a blink (data-cx/cy: where to squash towards)
//   data-part="mouth-open" / "mouth-closed"   swapped while the character speaks
//   data-part="crust"    the kolobok's crust: turns when it rolls, while the face stays upright
//   data-part="ears"     the hare's ears, they twitch
//   data-part="raw"      pale dough over the kolobok's crust, fades as he bakes

import { bochka, hnizdo, hryfon, krutyvus, muzhychok, skarb, vernydub, vernyhora, yama } from './puppets-kotyhoroshko2';
import { hlechyk, pyrih, tarilka, zhuravel } from './puppets-zhuravel';
import { husli, pivnyk, torba, vyazanka } from './puppets-pivnyk';
import { kurka, kuzhil, lokh, ovechka, solombychok } from './puppets-bychok';
import { braty, horoshyna, kamin, kotyhoroshko, motuzky, zalizo, zemlia } from './puppets-kotyhoroshko';
import { bulava, dity, holub, knyaz, kozhi, kyrylo, kyrylo_konopli, zmiy } from './puppets-kyrylo';
import { chovnyk, gusenia, gusy, koval, kovadlo, kolyska, lopata, olenka, pyrohy, telesyk, yavir, zmiyuchka } from './puppets-telesyk';
import { bychok, drova, lunka, lysytsia_tisto, pastushok, pyrizhok, sanky, sanky_lamani, viz, vudka } from './puppets-lysychka';
import { dytyna, halushky, knyazivna, nevista, sirko, snip, stil, vnuchka } from './puppets-sirko';
import { hriadka, ripka } from './puppets-ripka';
import { hryby, kasha, khata_vedmedya, korob, mariyka, penok, podruzhky, soroka, yahidky } from './puppets-mariyka';
import { kareta, kit_chobotar, kit_chobotar_bosyi, korol, kosari, krolyk, kulka, kuropatky, lakhmittia, lev, lyudozher, markiz, myshenia, osel, pryntsesa, restoran, starshi, syn, voda, zhentsi } from './puppets-kit';
import { dveri, lizhko_male, lizhko_serednie, lizhko_velyke, lozhka, masha, mishko, miska_mala, miska_mala_porozhnia, miska_serednia, miska_velyka, stil_vedmediv, stilets_lamanyi, stilets_malyi, stilets_serednii, stilets_velykyi, vedmedytsia, vikno } from './puppets-vedmedi';
import { kubelko, kurcha, ryaba, shkarlupa, shokolad, yaieshnia, yaiechko, zolote } from './puppets-ryaba';
import { charivnytsia, duimovochka, duimovochka_cover, duimovochka_koroleva, elf, kovdrochka, krit, kvitka_bila, kvitochka, lastivka, latattia, lopukh, metelyk_bilyi, norka, norka_zyma, pelustka, promin, romashka, rybky, shkarlupka, steblo, synok, tarilka_vody, tulpan, tulpan_vidkrytyi, vazon, zernia, zhinka, zhuk, zhuky } from './puppets-duimovochka';
import { dub, kit, koloda, koshyk, malyna, med, ryba, skatertyna } from './puppets-kotskyi';
import { kapusta, khatynka, koza, rak, yizhachok } from './puppets-koza';
import { hata_khmyzova, hata_podushkova, hata_solomiana, hata_tsehlyana, kazan, kazan_kryshka, kelma, khmyz, nafnaf, nifnif, nufnuf, opudalo, soloma, troie_porosiat, tsehla, vovk_kaska, vovk_pirya } from './puppets-porosiata';
import { baba_chepets, chervona_shapochka, chervona_shapochka_bez, chervona_shapochka_bez_koshyka, chervona_shapochka_cover, chervona_shapochka_kvity, drovorub, kaminnia, khatynka_babusi, khvist, koshyk_pyrizhky, kovdra, kvity, kvity2, lizhko_babusi, mama, metelyky, myslyvets, vovk_babusia } from './puppets-shapochka';
import { did_winter, kaban, myshka, rukavychka, rukavychka_rvana, snizhna_khatka, sobaka, zhabka } from './puppets-winter';

const NS = 'http://www.w3.org/2000/svg';
export const INK = '#5a3a22';

export function el<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, children: (SVGElement | string)[] = []): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  for (const c of children) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

/** SVG markup → a <g> with those elements (parsed as SVG, so it works in old Safari too) */
export function svg(markup: string): SVGGElement {
  const g = el('g');
  const tmp = new DOMParser().parseFromString(`<svg xmlns="${NS}">${markup}</svg>`, 'image/svg+xml');
  const root = tmp.documentElement;
  const err = root.getElementsByTagName('parsererror')[0];
  if (err) throw new Error(`bad SVG markup: ${err.textContent}`);
  const nodes = root.childNodes;
  for (let i = 0; i < nodes.length; i++) g.appendChild(document.importNode(nodes[i], true));
  return g;
}

/** the ink outline; width given separately when it differs (XML allows an attribute only once) */
export const st = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
export const stroke = st();

/** two eyes with highlights; cx is the gap's middle */
export function eyes(cx: number, cy: number, gap: number, r = 8, white = false) {
  const one = (x: number) =>
    (white ? `<ellipse cx="${x}" cy="${cy}" rx="${r * 1.5}" ry="${r * 1.7}" fill="#fff" ${st(3)}/>` : '') +
    `<circle cx="${x}" cy="${cy}" r="${r}" fill="#2b1a10"/><circle cx="${x + r * 0.35}" cy="${cy - r * 0.4}" r="${r * 0.35}" fill="#fff"/>`;
  return `<g data-part="eyes" data-cx="${cx}" data-cy="${cy}">${one(cx - gap / 2)}${one(cx + gap / 2)}</g>`;
}

/** closed eyes (sleeping, or playing a stone): two happy arcs */
export function closedEyes(cx: number, cy: number, gap: number, r = 8) {
  const arc = (x: number) => `<path d="M${x - r * 1.2} ${cy} q${r * 1.2} ${r * 1.1} ${r * 2.4} 0" fill="none" ${st(4)}/>`;
  return `<g data-part="eyes-closed" style="display:none">${arc(cx - gap / 2)}${arc(cx + gap / 2)}</g>`;
}

export function mouth(closed: string, open: string) {
  return `<g data-part="mouth-closed">${closed}</g><g data-part="mouth-open" style="display:none">${open}</g>`;
}

/** a red-and-black cross-stitch band, as on a vyshyvanka */
export function stitch(x: number, y: number, w: number, h = 14, vertical = false) {
  let s = '';
  const step = 14;
  const n = Math.floor((vertical ? h : w) / step);
  for (let i = 0; i < n; i++) {
    const px = vertical ? x : x + i * step;
    const py = vertical ? y + i * step : y;
    s += `<path d="M${px + 7} ${py + 1} l6 6 -6 6 -6 -6z" fill="${i % 2 ? '#1f1a17' : '#c62828'}"/>`;
  }
  return s;
}

const did = () => `
<g data-part="body">
  <!-- boots and trousers -->
  <path d="M-38 -120 L-40 -12 L-6 -12 L-4 -120 Z" fill="#2f4a6b" ${stroke}/>
  <path d="M4 -120 L6 -12 L40 -12 L38 -120 Z" fill="#2f4a6b" ${stroke}/>
  <path d="M-52 0 q2 -18 14 -18 h30 v18 z" fill="#3b2416" ${stroke}/>
  <path d="M52 0 q-2 -18 -14 -18 h-30 v18 z" fill="#3b2416" ${stroke}/>
  <g data-dress="legs"></g>
  <!-- long shirt with a belt -->
  <path d="M-62 -255 Q-80 -180 -74 -112 L74 -112 Q80 -180 62 -255 Q0 -275 -62 -255 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-70, -128, 140)}
  <rect x="-6" y="-252" width="12" height="80" fill="none"/>
  ${stitch(-7, -250, 14, 70, true)}
  <rect x="-74" y="-170" width="148" height="16" rx="5" fill="#b71c1c" ${st(4)}/>
  <path d="M40 -156 l10 34 M52 -156 l14 30" fill="none" stroke="#b71c1c" stroke-width="5" stroke-linecap="round"/>
  <!-- arms -->
  <path d="M-60 -250 Q-98 -200 -92 -140" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>
  <path d="M-60 -250 Q-98 -200 -92 -140" fill="none" stroke="#fbf7ee" stroke-width="24" stroke-linecap="round"/>
  <path d="M60 -250 Q98 -200 92 -140" fill="none" stroke="${INK}" stroke-width="34" stroke-linecap="round"/>
  <path d="M60 -250 Q98 -200 92 -140" fill="none" stroke="#fbf7ee" stroke-width="24" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <circle cx="-92" cy="-130" r="14" fill="#f2c4a0" ${st(4)}/>
  <circle cx="92" cy="-130" r="14" fill="#f2c4a0" ${st(4)}/>
  <!-- head -->
  <ellipse cx="0" cy="-310" rx="44" ry="48" fill="#f2c4a0" ${stroke}/>
  <circle cx="-44" cy="-305" r="10" fill="#f2c4a0" ${st(4)}/>
  <circle cx="44" cy="-305" r="10" fill="#f2c4a0" ${st(4)}/>
  <!-- beard -->
  <path data-part="beard" d="M-42 -300 Q-50 -230 0 -205 Q50 -230 42 -300 Q30 -272 0 -272 Q-30 -272 -42 -300 Z" fill="#f4f1ea" ${stroke}/>
  ${mouth(
    '',
    '<ellipse cx="0" cy="-266" rx="10" ry="8" fill="#7a2a1a"/>',
  )}
  <path data-part="beard" d="M-30 -276 Q-14 -290 0 -278 Q14 -290 30 -276 Q16 -266 0 -272 Q-16 -266 -30 -276 Z" fill="#fff" ${st(3)}/>
  <ellipse cx="0" cy="-292" rx="9" ry="8" fill="#e8a383"/>
  ${eyes(0, -318, 32, 6)}
  ${closedEyes(0, -318, 32, 6)}
  <path d="M-28 -334 q12 -8 22 -2 M28 -334 q-12 -8 -22 -2" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  <ellipse cx="-24" cy="-298" rx="8" ry="5" fill="#f19a8e" opacity=".6"/>
  <ellipse cx="24" cy="-298" rx="8" ry="5" fill="#f19a8e" opacity=".6"/>
  <!-- straw hat (bryl) -->
<g data-part="hat">
  <ellipse cx="0" cy="-345" rx="80" ry="16" fill="#e9c46a" ${stroke}/>
  <path d="M-42 -347 Q-40 -392 0 -394 Q40 -392 42 -347 Z" fill="#f2d27a" ${stroke}/>
  <path d="M-42 -356 Q0 -364 42 -356" fill="none" stroke="#b71c1c" stroke-width="8"/>
  </g>
</g>`;

export const baba = () => `
<g data-part="body">
  <!-- skirt (plakhta) with bands -->
  <path d="M-58 -170 L-86 -6 L86 -6 L58 -170 Z" fill="#8e1b1b" ${stroke}/>
  <path d="M-80 -40 L80 -40" stroke="#f5c542" stroke-width="10"/>
  <path d="M-75 -70 L75 -70" stroke="#2e5e3e" stroke-width="7"/>
  <path d="M-58 -2 q-4 6 -18 4 M58 -2 q4 6 18 4" ${stroke} fill="none"/>
  <!-- apron -->
  <path d="M-36 -160 L-46 -30 L46 -30 L36 -160 Z" fill="#fbf7ee" ${st(4)}/>
  ${stitch(-42, -58, 84)}
  <g data-dress="legs"></g>
  <!-- blouse -->
  <path d="M-54 -238 Q-66 -200 -58 -165 L58 -165 Q66 -200 54 -238 Q0 -256 -54 -238 Z" fill="#fbf7ee" ${stroke}/>
  ${stitch(-7, -236, 14, 60, true)}
  <rect x="-60" y="-176" width="120" height="14" rx="5" fill="#2e5e3e" ${st(4)}/>
  <!-- arms (folded in front) -->
  <path d="M-52 -232 Q-86 -190 -40 -170" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/>
  <path d="M-52 -232 Q-86 -190 -40 -170" fill="none" stroke="#fbf7ee" stroke-width="22" stroke-linecap="round"/>
  <path d="M52 -232 Q86 -190 40 -170" fill="none" stroke="${INK}" stroke-width="32" stroke-linecap="round"/>
  <path d="M52 -232 Q86 -190 40 -170" fill="none" stroke="#fbf7ee" stroke-width="22" stroke-linecap="round"/>
  ${stitch(-80, -200, 28)}
  ${stitch(52, -200, 28)}
  <g data-dress="torso"></g>
  <circle cx="-30" cy="-172" r="13" fill="#f2c4a0" ${st(4)}/>
  <circle cx="30" cy="-172" r="13" fill="#f2c4a0" ${st(4)}/>
  <!-- head in a red headscarf tied under the chin -->
  <path d="M-58 -262 Q-64 -340 0 -350 Q64 -340 58 -262 Q50 -238 0 -232 Q-50 -238 -58 -262 Z" fill="#d32f2f" ${stroke}/>
  <ellipse cx="0" cy="-286" rx="40" ry="44" fill="#f2c4a0" ${stroke}/>
  <path d="M-44 -300 Q-40 -338 0 -338 Q40 -338 44 -300 Q30 -318 0 -320 Q-30 -318 -44 -300 Z" fill="#d32f2f" ${st(4)}/>
  <circle cx="-30" cy="-330" r="4" fill="#fff"/><circle cx="-6" cy="-340" r="4" fill="#fff"/><circle cx="20" cy="-336" r="4" fill="#fff"/>
  <circle cx="-50" cy="-286" r="4" fill="#fff"/><circle cx="50" cy="-280" r="4" fill="#fff"/><circle cx="42" cy="-316" r="4" fill="#fff"/>
  <path d="M-14 -240 l14 -6 l14 6 l-4 22 l-10 -10 l-10 10 z" fill="#d32f2f" ${st(4)}/>
  ${eyes(0, -292, 30, 6)}
  ${closedEyes(0, -292, 30, 6)}
  <ellipse cx="0" cy="-276" rx="7" ry="6" fill="#e8a383"/>
  <ellipse cx="-22" cy="-270" rx="9" ry="6" fill="#f19a8e" opacity=".7"/>
  <ellipse cx="22" cy="-270" rx="9" ry="6" fill="#f19a8e" opacity=".7"/>
  ${mouth(
    `<path d="M-12 -260 q12 10 24 0" fill="none" ${st(4)}/>`,
    `<path d="M-12 -262 q12 18 24 0 z" fill="#7a2a1a" ${st(3)}/>`,
  )}
</g>`;

// gradients need an id unique in the page: the shelf's cover is a kolobok too
let uid = 0;
const kolobok = () => {
  uid++;
  return `
<defs>
  <radialGradient id="kolobok-bun-${uid}" cx="40%" cy="35%" r="70%">
    <stop offset="0" stop-color="#ffe08a"/>
    <stop offset=".6" stop-color="#f4b23f"/>
    <stop offset="1" stop-color="#d98a1c"/>
  </radialGradient>
</defs>
<g data-part="body">
  <circle cx="0" cy="-50" r="50" fill="url(#kolobok-bun-${uid})" ${stroke}/>
  <g data-part="crust" data-cx="0" data-cy="-50">
    <path d="M-30 -80 q6 -4 12 0 M14 -88 q6 -3 11 1 M28 -40 q5 -3 10 1 M-38 -28 q5 -4 10 0 M-6 -14 q5 -3 10 0 M30 -70 q4 -3 8 1" fill="none" stroke="#c77a14" stroke-width="4" stroke-linecap="round"/>
    <circle cx="-14" cy="-90" r="3" fill="#fff3c4"/><circle cx="36" cy="-56" r="3" fill="#fff3c4"/><circle cx="-40" cy="-56" r="3" fill="#fff3c4"/><circle cx="8" cy="-8" r="2.5" fill="#fff3c4"/>
  </g>
  <circle data-part="raw" cx="0" cy="-50" r="47.5" fill="#f5e7c6" opacity="0"/>
  <g data-dress="torso"></g>
  <g data-dress="legs"></g>
  <g data-part="face">
    ${eyes(6, -62, 34, 7, true)}
    ${closedEyes(6, -62, 34, 7)}
    <ellipse cx="-22" cy="-40" rx="10" ry="6" fill="#f0786a" opacity=".55"/>
    <ellipse cx="36" cy="-40" rx="10" ry="6" fill="#f0786a" opacity=".55"/>
    ${mouth(
      `<path d="M-6 -36 q12 12 24 0" fill="none" ${st(4)}/>`,
      `<path d="M-6 -38 q12 22 24 0 z" fill="#8a2a1a" ${st(3)}/>`,
    )}
  </g>
</g>`;
};

const zayets = () => `
<g data-part="body">
  <ellipse cx="34" cy="-60" rx="18" ry="16" fill="#fff" ${st(4)}/>
  <ellipse cx="0" cy="-70" rx="46" ry="58" fill="#b9b4ad" ${stroke}/>
  <ellipse cx="-6" cy="-60" rx="26" ry="38" fill="#f1ede6"/>
  <ellipse cx="-34" cy="-8" rx="30" ry="11" fill="#b9b4ad" ${st(4)}/>
  <ellipse cx="16" cy="-8" rx="26" ry="10" fill="#b9b4ad" ${st(4)}/>
  <g data-dress="legs"></g>
  <path d="M-32 -104 q-20 26 -8 40" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
  <path d="M-32 -104 q-20 26 -8 40" fill="none" stroke="#b9b4ad" stroke-width="13" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <g data-part="ears" data-cx="-6" data-cy="-176">
    <path d="M-24 -170 Q-46 -260 -26 -280 Q-6 -262 -10 -172 Z" fill="#b9b4ad" ${stroke}/>
    <path d="M-23 -182 Q-36 -248 -26 -262 Q-15 -248 -16 -184 Z" fill="#f4b8b0"/>
    <path d="M4 -172 Q8 -262 32 -276 Q44 -252 18 -168 Z" fill="#b9b4ad" ${stroke}/>
    <path d="M10 -184 Q16 -246 30 -258 Q34 -238 18 -184 Z" fill="#f4b8b0"/>
  </g>
  <ellipse cx="-8" cy="-150" rx="44" ry="38" fill="#b9b4ad" ${stroke}/>
  <ellipse cx="-30" cy="-134" rx="22" ry="17" fill="#f1ede6"/>
  ${eyes(-14, -160, 30, 6)}
  ${closedEyes(-14, -160, 30, 6)}
  <ellipse cx="-44" cy="-144" rx="7" ry="5" fill="#e57373"/>
  <path d="M-62 -142 h-22 M-62 -136 l-20 6 M-28 -140 h20" stroke="${INK}" stroke-width="2" opacity=".6"/>
  ${mouth(
    `<path d="M-44 -132 q-6 8 -14 4 M-44 -132 q4 8 12 4" fill="none" ${st(3)}/><rect x="-50" y="-128" width="12" height="11" rx="2" fill="#fff" ${st(2)}/>`,
    `<ellipse cx="-44" cy="-124" rx="10" ry="9" fill="#8a2a1a" ${st(3)}/><rect x="-50" y="-132" width="12" height="9" rx="2" fill="#fff" ${st(2)}/>`,
  )}
</g>`;

export const vovk = () => `
<g data-part="body">
  <!-- tail -->
  <path d="M40 -100 Q110 -110 116 -40 Q90 -70 44 -70 Z" fill="#7d8790" ${stroke}/>
  <!-- legs -->
  <path d="M-30 -90 L-36 -10 L-6 -10 L-4 -90 Z" fill="#6c757d" ${stroke}/>
  <path d="M8 -90 L10 -10 L40 -10 L36 -90 Z" fill="#6c757d" ${stroke}/>
  <ellipse cx="-26" cy="-8" rx="22" ry="10" fill="#5a636b" ${st(4)}/>
  <ellipse cx="26" cy="-8" rx="22" ry="10" fill="#5a636b" ${st(4)}/>
  <g data-dress="legs"></g>
  <!-- body -->
  <ellipse cx="2" cy="-150" rx="58" ry="80" fill="#7d8790" ${stroke}/>
  <path d="M-30 -205 Q-40 -130 -10 -90 Q20 -130 6 -205 Z" fill="#d6d9dc"/>
  <path d="M-46 -190 Q-80 -150 -64 -110" fill="none" stroke="${INK}" stroke-width="28" stroke-linecap="round"/>
  <path d="M-46 -190 Q-80 -150 -64 -110" fill="none" stroke="#7d8790" stroke-width="18" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <!-- head with a long snout to the left -->
  <path d="M-10 -300 L-2 -350 L20 -308 Z" fill="#6c757d" ${stroke}/>
  <path d="M28 -300 L50 -342 L52 -296 Z" fill="#6c757d" ${stroke}/>
  <ellipse cx="14" cy="-268" rx="48" ry="44" fill="#7d8790" ${stroke}/>
  <path d="M-20 -280 Q-80 -270 -96 -252 Q-90 -232 -60 -232 Q-20 -232 0 -240 Z" fill="#9aa3ab" ${stroke}/>
  <ellipse cx="-96" cy="-254" rx="10" ry="8" fill="#2b1a10"/>
  ${mouth(
    `<path d="M-88 -236 Q-60 -228 -26 -238" fill="none" ${st(4)}/><path d="M-70 -234 l4 8 l4 -8" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    `<path d="M-90 -238 Q-60 -206 -24 -236 Q-56 -230 -90 -238 Z" fill="#8a2a1a" ${st(3)}/><path d="M-76 -236 l4 8 l4 -8 M-52 -234 l4 8 l4 -8" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
  )}
  <path d="M-30 -298 l26 8 M30 -298 l-14 10" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
  ${eyes(0, -282, 34, 6)}
  ${closedEyes(0, -282, 34, 6)}
</g>`;

const vedmid = () => `
<g data-part="body">
  <ellipse cx="-36" cy="-24" rx="40" ry="26" fill="#6d4426" ${stroke}/>
  <ellipse cx="40" cy="-24" rx="40" ry="26" fill="#6d4426" ${stroke}/>
  <ellipse cx="0" cy="-150" rx="96" ry="120" fill="#7b4b2a" ${stroke}/>
  <ellipse cx="-6" cy="-128" rx="56" ry="76" fill="#b07c52"/>
  <g data-dress="legs"></g>
  <path d="M-86 -220 Q-130 -170 -110 -110" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M-86 -220 Q-130 -170 -110 -110" fill="none" stroke="#7b4b2a" stroke-width="35" stroke-linecap="round"/>
  <path d="M86 -220 Q130 -170 110 -110" fill="none" stroke="${INK}" stroke-width="46" stroke-linecap="round"/>
  <path d="M86 -220 Q130 -170 110 -110" fill="none" stroke="#7b4b2a" stroke-width="35" stroke-linecap="round"/>
  <g data-dress="torso"></g>
  <circle cx="-48" cy="-360" r="24" fill="#7b4b2a" ${stroke}/>
  <circle cx="-48" cy="-360" r="11" fill="#b07c52"/>
  <circle cx="46" cy="-364" r="24" fill="#7b4b2a" ${stroke}/>
  <circle cx="46" cy="-364" r="11" fill="#b07c52"/>
  <ellipse cx="0" cy="-310" rx="70" ry="62" fill="#7b4b2a" ${stroke}/>
  <ellipse cx="-14" cy="-284" rx="34" ry="26" fill="#c9966b" ${st(4)}/>
  <ellipse cx="-20" cy="-298" rx="13" ry="9" fill="#2b1a10"/>
  ${eyes(-4, -330, 46, 7)}
  ${closedEyes(-4, -330, 46, 7)}
  ${mouth(
    `<path d="M-36 -272 q16 12 32 0" fill="none" ${st(4)}/>`,
    `<path d="M-36 -276 q16 28 32 0 z" fill="#8a2a1a" ${st(3)}/>`,
  )}
</g>`;

let foxUid = 0;
export const lysytsia = () => {
  // a gradient id unique in the page: the shelf's covers and the stage can show a fox at once
  const fur = `fox-fur-${++foxUid}`;
  return `
<defs>
  <linearGradient id="${fur}" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#f58a3a"/><stop offset="1" stop-color="#e2661f"/>
  </linearGradient>
</defs>
<g data-part="body">
  <!-- a big fluffy tail, curled up behind her -->
  <path d="M26 -48 C96 -40 150 -84 146 -160 C143 -212 106 -238 82 -226 C116 -196 112 -132 70 -108 C50 -96 34 -92 20 -96 Z" fill="url(#${fur})" ${stroke}/>
  <path d="M82 -226 C106 -238 143 -212 146 -160 C128 -170 104 -196 82 -226 Z" fill="#fffaf2" ${st(4)}/>
  <!-- legs in dark "socks" -->
  <path d="M-30 -64 L-32 -12 L-6 -12 L-6 -64 Z" fill="#4a2a1c" ${st(4)}/>
  <path d="M8 -64 L8 -12 L34 -12 L32 -64 Z" fill="#4a2a1c" ${st(4)}/>
  <ellipse cx="-22" cy="-9" rx="19" ry="10" fill="#4a2a1c" ${st(4)}/>
  <ellipse cx="22" cy="-9" rx="19" ry="10" fill="#4a2a1c" ${st(4)}/>
  <g data-dress="legs"></g>
  <!-- pear-shaped body with a white chest -->
  <path d="M-46 -60 C-56 -110 -40 -160 0 -166 C40 -160 56 -110 46 -60 C30 -42 -30 -42 -46 -60 Z" fill="url(#${fur})" ${stroke}/>
  <path d="M-26 -150 C-34 -110 -26 -70 0 -58 C26 -70 34 -110 26 -150 C14 -140 -14 -140 -26 -150 Z" fill="#fffaf2"/>
  <g data-dress="torso"></g>
  <!-- paws folded politely in front -->
  <path d="M-34 -132 C-50 -112 -40 -94 -18 -96" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
  <path d="M-34 -132 C-50 -112 -40 -94 -18 -96" fill="none" stroke="#ef7d2f" stroke-width="13" stroke-linecap="round"/>
  <path d="M34 -132 C50 -112 40 -94 18 -96" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/>
  <path d="M34 -132 C50 -112 40 -94 18 -96" fill="none" stroke="#ef7d2f" stroke-width="13" stroke-linecap="round"/>
  <ellipse cx="-12" cy="-96" rx="12" ry="9" fill="#4a2a1c" ${st(3)}/>
  <ellipse cx="12" cy="-96" rx="12" ry="9" fill="#4a2a1c" ${st(3)}/>
  <!-- ears: dark tips, pink inside -->
  <path d="M-46 -232 L-40 -298 L-6 -250 Z" fill="url(#${fur})" ${stroke}/>
  <path d="M-40 -244 L-37 -278 L-18 -252 Z" fill="#f6b3a6"/>
  <path d="M-42 -284 L-40 -298 L-30 -284 Z" fill="#3a2418"/>
  <path d="M10 -250 L42 -296 L46 -230 Z" fill="url(#${fur})" ${stroke}/>
  <path d="M18 -250 L38 -280 L40 -244 Z" fill="#f6b3a6"/>
  <path d="M34 -284 L42 -296 L43 -282 Z" fill="#3a2418"/>
  <!-- head: round, with white cheek fluff and a short snout to the left -->
  <ellipse cx="-4" cy="-212" rx="54" ry="48" fill="url(#${fur})" ${stroke}/>
  <path d="M-58 -206 C-54 -176 -36 -164 -14 -166 L-4 -176 L6 -164 C26 -164 44 -176 50 -200 C34 -186 14 -182 -4 -188 C-24 -184 -44 -190 -58 -206 Z" fill="#fffaf2" ${st(4)}/>
  <path d="M-40 -212 C-62 -210 -84 -200 -92 -192 C-86 -180 -62 -176 -40 -182 Z" fill="#fffaf2" ${st(4)}/>
  <ellipse cx="-92" cy="-193" rx="9" ry="7" fill="#2b1a10"/>
  <circle cx="-94" cy="-196" r="2.4" fill="#fff"/>
  ${mouth(
    `<path d="M-84 -184 C-74 -178 -62 -178 -54 -184" fill="none" ${st(3)}/>`,
    `<path d="M-86 -186 C-76 -164 -56 -166 -50 -186 C-62 -182 -76 -182 -86 -186 Z" fill="#8a2a1a" ${st(3)}/>`,
  )}
  <!-- sly half-closed eyes with lashes -->
  <g data-part="eyes" data-cx="-14" data-cy="-220">
    <ellipse cx="-34" cy="-220" rx="10" ry="8" fill="#fff" ${st(3)}/>
    <circle cx="-37" cy="-219" r="5.5" fill="#2b1a10"/><circle cx="-35" cy="-221" r="1.8" fill="#fff"/>
    <path d="M-45 -222 Q-34 -232 -23 -222 Z" fill="#ef7d2f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="2" cy="-222" rx="10" ry="8" fill="#fff" ${st(3)}/>
    <circle cx="-1" cy="-221" r="5.5" fill="#2b1a10"/><circle cx="1" cy="-223" r="1.8" fill="#fff"/>
    <path d="M-9 -224 Q2 -234 13 -224 Z" fill="#ef7d2f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M-46 -224 l-6 -4 M13 -226 l6 -4" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
  </g>
  ${closedEyes(-16, -220, 36, 7)}
  <ellipse cx="-50" cy="-200" rx="9" ry="5" fill="#f0786a" opacity=".45"/>
  <ellipse cx="22" cy="-202" rx="9" ry="5" fill="#f0786a" opacity=".45"/>
</g>`;
};

const bush = () => `
<g data-part="body">
  <circle cx="-60" cy="-50" r="52" fill="#3f7f3a" ${stroke}/>
  <circle cx="54" cy="-52" r="56" fill="#3f7f3a" ${stroke}/>
  <circle cx="0" cy="-92" r="64" fill="#4f9446" ${stroke}/>
  <path d="M-110 -6 Q0 14 112 -6 L104 0 L-104 0 Z" fill="#3f7f3a"/>
  <circle cx="-30" cy="-110" r="7" fill="#e53935"/><circle cx="22" cy="-70" r="7" fill="#e53935"/><circle cx="66" cy="-80" r="7" fill="#e53935"/><circle cx="-70" cy="-60" r="7" fill="#e53935"/>
</g>`;

/** the flour bin (засік): a wooden chest with its lid open, flour inside — the kolobok's flour */
const zasik = () => `
<g data-part="body">
  <path d="M-96 -132 L-118 -238 L96 -238 L96 -132 Z" fill="#9a6535" ${stroke}/>
  <path d="M-104 -176 L92 -176 M-110 -208 L94 -208" stroke="#7a4c24" stroke-width="5"/>
  <rect x="-100" y="-138" width="200" height="138" rx="8" fill="#b07a45" ${stroke}/>
  <path d="M-100 -92 H100 M-100 -46 H100" stroke="#8d5a2b" stroke-width="5"/>
  <path d="M-62 -138 V0 M62 -138 V0" stroke="#8d5a2b" stroke-width="4" opacity=".6"/>
  <path d="M-88 -136 Q-40 -170 0 -160 Q48 -176 88 -136 Z" fill="#fffaf0" ${st(4)}/>
  <circle cx="-30" cy="-150" r="4" fill="#efe6d4"/><circle cx="26" cy="-156" r="5" fill="#efe6d4"/>
</g>`;

export const PUPPETS: Record<string, () => string> = {
  zasik,
  did,
  baba,
  kolobok,
  zayets,
  vovk,
  vedmid,
  lysytsia,
  bush,
  did_winter,
  sobaka,
  myshka,
  zhabka,
  kaban,
  rukavychka,
  rvana: rukavychka_rvana,
  khatka: snizhna_khatka,
  koza,
  yizhachok,
  rak,
  khatynka,
  kapusta,
  kit,
  dub,
  koloda,
  skatertyna,
  ryba,
  med,
  malyna,
  koshyk,
  bush2: bush,
  sirko,
  dytyna,
  nevista,
  stil,
  snip,
  snip2: snip,
  halushky,
  pyrizhok,
  pastushok,
  bychok,
  sanky,
  lamani: sanky_lamani,
  drova,
  viz,
  lunka,
  vudka,
  lysytsia_tisto,
  chumak: did_winter,
  telesyk,
  chovnyk,
  kolyska,
  zmiyuchka,
  olenka,
  koval,
  kovadlo,
  lopata,
  yavir,
  gusy,
  gusy2: gusy,
  gusy3: gusy,
  gusenia,
  pyrohy,
  kyrylo: () => kyrylo(),
  kyrylo_konopli,
  zmiy,
  holub,
  knyaz,
  knyazivna,
  dity,
  kozhi,
  bulava,
  kotyhoroshko,
  braty,
  sestra: nevista,
  horoshyna,
  kamin,
  zalizo,
  zemlia,
  motuzky,
  solombychok,
  lokh,
  ovechka,
  kurka,
  kuzhil,
  pivnyk,
  husli,
  torba,
  vyazanka,
  lysenia1: lysytsia,
  lysenia2: lysytsia,
  zhuravel,
  tarilka,
  hlechyk,
  pyrih,
  vernyhora,
  vernydub,
  krutyvus,
  muzhychok,
  hryfon,
  hnizdo,
  yama,
  skarb,
  skarb2: skarb,
  bochka,
  tsarivna: knyazivna,
  ripka,
  hriadka,
  vnuchka,
  // Zhuchka is black with a white chest (the little dog of the mitten is brown)
  zhuchka: () => sobaka().replace(/#c08a52/g, '#3a3a3e').replace(/#a8743f/g, '#2a2a2e').replace(/#7a4e28/g, '#1c1c1f').replace(/#c62828/g, '#1e88e5'),
  // the cat of Ripka: ginger and white (the tomcat Kotskyi is grey)
  kishka: () => kit().replace(/#9e9e9e/g, '#f0a04b').replace(/#616161/g, '#c46a1c').replace(/#bdbdbd/g, '#f6c48a'),
  ryaba,
  kubelko,
  zolote,
  yaiechko,
  shkarlupa,
  shokolad,
  kurcha,
  yaieshnia,
  mariyka,
  podruzhky,
  soroka,
  korob,
  penok,
  hryby,
  hryby2: hryby,
  hryby3: hryby,
  yahidky,
  kasha,
  khata_vedmedya,
  kit_chobotar,
  kit_chobotar_bosyi,
  syn,
  markiz,
  korol,
  pryntsesa,
  lyudozher,
  lev,
  myshenia,
  kulka,
  starshi,
  osel,
  kosari,
  zhentsi,
  kareta,
  krolyk,
  kuropatky,
  voda,
  lakhmittia,
  restoran,
  masha,
  vedmedytsia,
  mishko,
  miska_velyka,
  miska_serednia,
  miska_mala,
  miska_mala_porozhnia,
  lozhka,
  stilets_velykyi,
  stilets_serednii,
  stilets_malyi,
  stilets_lamanyi,
  stil_vedmediv,
  lizhko_velyke,
  lizhko_serednie,
  lizhko_male,
  vikno,
  dveri,
  // the cover of «Три ведмеді»: the father, the mother and Mishko side by side
  try_vedmedi: () =>
    `<g transform="translate(-120 0) scale(.6)">${vedmid()}</g><g transform="translate(30 0) scale(.6)">${vedmedytsia()}</g><g transform="translate(150 0) scale(.6)">${mishko()}</g>`,
  duimovochka,
  duimovochka_koroleva,
  zhuk,
  zhuky,
  krit,
  lastivka,
  elf,
  zhinka,
  charivnytsia,
  synok,
  rybky,
  metelyk_bilyi,
  zernia,
  vazon,
  tulpan,
  tulpan_vidkrytyi,
  shkarlupka,
  tarilka_vody,
  pelustka,
  latattia,
  steblo,
  romashka,
  lopukh,
  norka,
  norka_zyma,
  kovdrochka,
  promin,
  kvitochka,
  kvitka_bila,
  // the cover of «Дюймовочка»: she stands in the open tulip
  duimovochka_cover,  nifnif,
  nufnuf,
  nafnaf,
  hata_solomiana,
  hata_khmyzova,
  hata_tsehlyana,
  hata_podushkova,
  tsehla,
  kelma,
  soloma,
  khmyz,
  kazan,
  kazan_kryshka,
  opudalo,
  vovk_pirya,
  vovk_kaska,
  // the cover of «Троє поросят»: the three brothers
  troie_porosiat,
  chervona_shapochka,
  chervona_shapochka_bez,
  chervona_shapochka_bez_koshyka,
  chervona_shapochka_kvity,
  mama,
  myslyvets,
  drovorub,
  baba_chepets,
  vovk_babusia,
  lizhko_babusi,
  kovdra,
  khvist,
  khatynka_babusi,
  kvity,
  kvity2,
  metelyky,
  kaminnia,
  koshyk_pyrizhky,
  // the cover of «Червона Шапочка»: she on the path, the wolf behind an oak
  chervona_shapochka_cover,
};

/** a fresh puppet (drawing `id`, playing the actor `actor`); the stage keeps its live parts */
export function makePuppet(id: string, actor = id): SVGGElement {
  const draw = PUPPETS[id];
  if (!draw) throw new Error(`no puppet "${id}"`);
  const g = svg(draw());
  g.setAttribute('data-actor', actor);
  return g;
}

/** Where on a puppet things come from: the mouth (notes, chomp), the top (sparkles), the hands (carrying). */
/** behind: what it carries rides behind it (on the bear's back), not in front */
/** hip: where the legs begin (sitting folds the body there; a guess from `top` when not given) */
export const ANCHORS: Record<string, { mouth: [number, number]; top: number; hands?: [number, number]; behind?: boolean; hip?: number }> = {
  // hands: where a carried kolobok's bottom is, held in front of the chest
  did: { mouth: [0, -268], top: -400, hands: [0, -120] },
  baba: { mouth: [0, -262], top: -352, hands: [0, -128] },
  kolobok: { mouth: [6, -36], top: -104 },
  zasik: { mouth: [0, -150], top: -240 },
  zayets: { mouth: [-44, -126], top: -280, hands: [-34, -66] },
  vovk: { mouth: [-60, -236], top: -350, hands: [-84, -196] },
  // hands: what he carries rides on his back (the box with Marijka in it)
  vedmid: { mouth: [-20, -272], top: -390, hands: [70, -150], behind: true },
  lysytsia: { mouth: [-70, -180], top: -300, hands: [-92, -150] },
  bush: { mouth: [0, -80], top: -156 },
  sobaka: { mouth: [-80, -90], top: -150 },
  myshka: { mouth: [-40, -74], top: -136, hands: [0, -126] },
  zhabka: { mouth: [0, -50], top: -90 },
  kaban: { mouth: [-46, -192], top: -300 },
  // mouth = the door, where animals go in and come out
  rukavychka: { mouth: [-26, -20], top: -300 },
  rvana: { mouth: [0, -20], top: -130 },
  khatka: { mouth: [0, -40], top: -310 },
  koza: { mouth: [-86, -172], top: -255 },
  yizhachok: { mouth: [-62, -28], top: -124 },
  rak: { mouth: [0, -54], top: -200 },
  khatynka: { mouth: [-30, -20], top: -330 },
  kapusta: { mouth: [0, -34], top: -70 },
  kit: { mouth: [0, -142], top: -232, hands: [-46, -60] },
  dub: { mouth: [0, -300], top: -700 },
  koloda: { mouth: [0, -60], top: -112 },
  bush2: { mouth: [0, -80], top: -156 },
  skatertyna: { mouth: [0, -20], top: -40 },
  ryba: { mouth: [0, -24], top: -50 },
  med: { mouth: [0, -40], top: -90 },
  malyna: { mouth: [0, -40], top: -90 },
  koshyk: { mouth: [0, -40], top: -80 },
  sirko: { mouth: [-112, -100], top: -165, hands: [-110, -66] },
  dytyna: { mouth: [-34, -38], top: -70 },
  nevista: { mouth: [0, -258], top: -330 },
  stil: { mouth: [0, -100], top: -290 },
  snip: { mouth: [0, -100], top: -220 },
  snip2: { mouth: [0, -100], top: -220 },
  halushky: { mouth: [0, -30], top: -60 },
  pyrizhok: { mouth: [0, -24], top: -50 },
  pastushok: { mouth: [0, -222], top: -306 },
  bychok: { mouth: [-88, -104], top: -192 },
  sanky: { mouth: [0, -40], top: -110 },
  lamani: { mouth: [0, -20], top: -50 },
  drova: { mouth: [0, -30], top: -80 },
  viz: { mouth: [0, -80], top: -160, hands: [30, -96] },
  lunka: { mouth: [0, -6], top: -26 },
  vudka: { mouth: [96, -24], top: -200 },
  chumak: { mouth: [0, -268], top: -400, hands: [0, -120] },
  telesyk: { mouth: [0, -168], top: -230 },
  chovnyk: { mouth: [0, -30], top: -60, hands: [-30, -36] },
  kolyska: { mouth: [0, -150], top: -330 },
  zmiyuchka: { mouth: [-60, -268], top: -380, hands: [-110, -180] },
  olenka: { mouth: [-28, -186], top: -256 },
  koval: { mouth: [0, -268], top: -440 },
  kovadlo: { mouth: [10, -110], top: -120 },
  lopata: { mouth: [80, -10], top: -40 },
  yavir: { mouth: [-90, -712], top: -860 },
  gusy: { mouth: [-80, -80], top: -180 },
  gusy2: { mouth: [-80, -80], top: -180 },
  gusy3: { mouth: [-80, -80], top: -180 },
  gusenia: { mouth: [-90, -104], top: -130, hands: [6, -62] },
  pyrohy: { mouth: [0, -30], top: -60 },
  kyrylo: { mouth: [0, -306], top: -410, hands: [118, -150] },
  zmiy: { mouth: [-220, -318], top: -440, hands: [-150, -170] },
  holub: { mouth: [-44, -50], top: -110 },
  knyaz: { mouth: [0, -268], top: -400 },
  knyazivna: { mouth: [0, -258], top: -360 },
  dity: { mouth: [0, -126], top: -175 },
  kozhi: { mouth: [0, -60], top: -110 },
  bulava: { mouth: [0, -240], top: -290 },
  kotyhoroshko: { mouth: [0, -296], top: -380, hands: [104, -140] },
  braty: { mouth: [0, -120], top: -210 },
  sestra: { mouth: [0, -258], top: -330 },
  horoshyna: { mouth: [0, -18], top: -40 },
  kamin: { mouth: [0, -70], top: -150 },
  zalizo: { mouth: [0, -40], top: -80 },
  zemlia: { mouth: [0, 0], top: 0 },
  motuzky: { mouth: [0, -180], top: -280 },
  solombychok: { mouth: [-90, -104], top: -196 },
  lokh: { mouth: [0, -20], top: -160 },
  ovechka: { mouth: [-66, -90], top: -110 },
  kurka: { mouth: [-44, -74], top: -95 },
  kuzhil: { mouth: [0, -150], top: -210 },
  pivnyk: { mouth: [-66, -158], top: -200 },
  husli: { mouth: [0, -40], top: -90 },
  torba: { mouth: [0, -100], top: -115 },
  vyazanka: { mouth: [0, -40], top: -100 },
  lysenia1: { mouth: [-70, -180], top: -300 },
  lysenia2: { mouth: [-70, -180], top: -300 },
  zhuravel: { mouth: [-100, -330], top: -360 },
  tarilka: { mouth: [0, -12], top: -30 },
  hlechyk: { mouth: [0, -210], top: -230 },
  pyrih: { mouth: [0, -40], top: -80 },
  vernyhora: { mouth: [0, -314], top: -410, hands: [118, -150] },
  vernydub: { mouth: [0, -314], top: -410, hands: [118, -150] },
  krutyvus: { mouth: [0, -314], top: -410, hands: [118, -150] },
  muzhychok: { mouth: [0, -104], top: -164 },
  hryfon: { mouth: [-190, -236], top: -320, hands: [10, -150] },
  hnizdo: { mouth: [0, -60], top: -100 },
  yama: { mouth: [0, -10], top: -50 },
  skarb: { mouth: [0, -60], top: -115 },
  skarb2: { mouth: [0, -60], top: -115 },
  bochka: { mouth: [0, -60], top: -120 },
  tsarivna: { mouth: [0, -258], top: -360 },
  ripka: { mouth: [0, -110], top: -430 },
  hriadka: { mouth: [0, -30], top: -60 },
  vnuchka: { mouth: [0, -258], top: -330 },
  zhuchka: { mouth: [-80, -90], top: -150 },
  kishka: { mouth: [0, -142], top: -232, hands: [-46, -60] },
  // hands: the hen carries the egg on her back
  ryaba: { mouth: [-66, -142], top: -205, hands: [30, -126] },
  kubelko: { mouth: [0, -30], top: -60 },
  zolote: { mouth: [0, -44], top: -96 },
  yaiechko: { mouth: [0, -44], top: -90 },
  shkarlupa: { mouth: [0, -20], top: -60 },
  shokolad: { mouth: [0, -44], top: -90 },
  kurcha: { mouth: [-24, -34], top: -84 },
  yaieshnia: { mouth: [0, -24], top: -50 },
  mariyka: { mouth: [0, -226], top: -306, hands: [0, -140] },
  podruzhky: { mouth: [70, -206], top: -270 },
  soroka: { mouth: [-58, -80], top: -110 },
  // mouth = the top, where Marijka climbs in and pops out
  korob: { mouth: [0, -150], top: -200 },
  penok: { mouth: [0, -60], top: -110 },
  hryby: { mouth: [0, -30], top: -70 },
  hryby2: { mouth: [0, -30], top: -70 },
  hryby3: { mouth: [0, -30], top: -70 },
  yahidky: { mouth: [0, -20], top: -50 },
  kasha: { mouth: [0, -60], top: -110 },
  khata_vedmedya: { mouth: [-60, -20], top: -420 },
  // hands: the bag with the rabbit, the partridges, the old clothes hang from his paw
  kit_chobotar: { mouth: [0, -228], top: -360, hands: [-70, -40] },
  syn: { mouth: [0, -276], top: -360, hands: [88, -120] },
  markiz: { mouth: [0, -276], top: -400, hands: [88, -120] },
  korol: { mouth: [0, -262], top: -415, hands: [108, -120] },
  pryntsesa: { mouth: [0, -248], top: -335, hands: [62, -150] },
  lyudozher: { mouth: [0, -418], top: -680, hands: [162, -190] },
  lev: { mouth: [-96, -160], top: -275 },
  myshenia: { mouth: [-38, -38], top: -92 },
  kulka: { mouth: [0, -218], top: -460 },
  starshi: { mouth: [0, -236], top: -310 },
  osel: { mouth: [-146, -210], top: -330 },
  kosari: { mouth: [0, -236], top: -320 },
  zhentsi: { mouth: [0, -232], top: -300 },
  kareta: { mouth: [0, -120], top: -300 },
  krolyk: { mouth: [-56, -64], top: -170 },
  kuropatky: { mouth: [0, -40], top: -80 },
  voda: { mouth: [0, -150], top: -160 },
  lakhmittia: { mouth: [0, -30], top: -60 },
  restoran: { mouth: [0, -170], top: -430 },
  masha: { mouth: [0, -224], top: -300, hands: [0, -140] },
  vedmedytsia: { mouth: [-17, -238], top: -340, hands: [60, -130] },
  mishko: { mouth: [-12, -132], top: -220, hands: [0, -60] },
  miska_velyka: { mouth: [0, -60], top: -110 },
  miska_serednia: { mouth: [0, -50], top: -90 },
  miska_mala: { mouth: [0, -40], top: -70 },
  miska_mala_porozhnia: { mouth: [0, -40], top: -50 },
  lozhka: { mouth: [0, -80], top: -110 },
  stilets_velykyi: { mouth: [0, -220], top: -500 },
  stilets_serednii: { mouth: [0, -190], top: -400 },
  stilets_malyi: { mouth: [0, -120], top: -250 },
  stilets_lamanyi: { mouth: [0, -20], top: -60 },
  stil_vedmediv: { mouth: [0, -150], top: -160 },
  lizhko_velyke: { mouth: [0, -200], top: -320 },
  lizhko_serednie: { mouth: [0, -330], top: -450 },
  lizhko_male: { mouth: [0, -100], top: -220 },
  // mouth = the window itself: Masha jumps out through it
  vikno: { mouth: [0, -60], top: -260 },
  dveri: { mouth: [0, -20], top: -400 },
  // «Дюймовочка»: she is shown small on stage (size ≈ 0.6), the anchors scale with her
  duimovochka: { mouth: [0, -229], top: -300, hands: [0, -150] },
  // hands: the beetle carries her off in his arms; the swallow on her back
  zhuk: { mouth: [0, -262], top: -370, hands: [-80, -140] },
  zhuky: { mouth: [0, -190], top: -270 },
  krit: { mouth: [0, -226], top: -352, hands: [-112, -120] },
  lastivka: { mouth: [0, -236], top: -312, hands: [24, -196] },
  elf: { mouth: [0, -231], top: -330, hands: [0, -150] },
  zhinka: { mouth: [0, -258], top: -340, hands: [64, -150] },
  charivnytsia: { mouth: [0, -250], top: -440, hands: [54, -150] },
  synok: { mouth: [0, -80], top: -160 },
  rybky: { mouth: [0, -10], top: -60 },
  metelyk_bilyi: { mouth: [0, -90], top: -150 },
  zernia: { mouth: [0, -30], top: -60 },
  vazon: { mouth: [0, -76], top: -80 },
  tulpan: { mouth: [0, -280], top: -320 },
  // hands: who lies in the cradle lies on its violet mattress
  shkarlupka: { mouth: [0, -50], top: -90, hands: [-40, -56] },
  tarilka_vody: { mouth: [0, -68], top: -110 },
  pelustka: { mouth: [0, -20], top: -60, hands: [0, -14] },
  latattia: { mouth: [0, -10], top: -40, hands: [-30, -4] },
  steblo: { mouth: [0, 50], top: 0 },
  romashka: { mouth: [0, -410], top: -470 },
  lopukh: { mouth: [-110, -230], top: -420 },
  // mouth = the little door
  norka: { mouth: [0, -10], top: -180 },
  kovdrochka: { mouth: [0, -40], top: -90 },
  promin: { mouth: [0, -10], top: -100 },
  kvitochka: { mouth: [0, -126], top: -150 },
  kvitka_bila: { mouth: [0, -410], top: -560 },  // «Троє поросят»: hands — what they carry (a bundle, the bricks) is held in front of the belly
  nifnif: { mouth: [0, -200], top: -345, hands: [0, -96] },
  nufnuf: { mouth: [0, -200], top: -365, hands: [0, -96] },
  nafnaf: { mouth: [0, -200], top: -345, hands: [0, -96] },
  // mouth = the door, where the piglets go in and tumble out
  hata_solomiana: { mouth: [0, -20], top: -360 },
  hata_khmyzova: { mouth: [0, -20], top: -360 },
  hata_tsehlyana: { mouth: [-80, -20], top: -500 },
  hata_podushkova: { mouth: [0, -20], top: -380 },
  tsehla: { mouth: [0, -60], top: -110 },
  kelma: { mouth: [0, -20], top: -40 },
  soloma: { mouth: [0, -80], top: -150 },
  khmyz: { mouth: [0, -60], top: -110 },
  kazan: { mouth: [0, -150], top: -260 },
  opudalo: { mouth: [0, -300], top: -420 },
  // «Червона Шапочка»: hands — the basket on her arm, what the others carry in front
  chervona_shapochka: { mouth: [0, -226], top: -330, hands: [60, -150] },
  mama: { mouth: [0, -268], top: -360, hands: [0, -140] },
  myslyvets: { mouth: [0, -276], top: -410, hands: [0, -130] },
  drovorub: { mouth: [0, -280], top: -420, hands: [0, -130] },
  // mouth = the door (who comes in or out goes there); the bed: who lies in it stands at x + 60
  khatynka_babusi: { mouth: [-90, -20], top: -520 },
  lizhko_babusi: { mouth: [60, -100], top: -420 },
  kovdra: { mouth: [0, -120], top: -230 },
  khvist: { mouth: [-70, -30], top: -70 },
  kvity: { mouth: [0, -60], top: -120 },
  kvity2: { mouth: [0, -60], top: -120 },
  metelyky: { mouth: [0, -60], top: -110 },
  kaminnia: { mouth: [0, -50], top: -115 },
  koshyk_pyrizhky: { mouth: [0, -50], top: -120 },
};
