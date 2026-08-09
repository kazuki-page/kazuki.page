/*
 * アイコンに白い縁を付けて public/ へ書き出す。
 *
 * 原画（src/assets/icon-source.svg）は線画が黒なので、ダークテーマだと
 * ヘッドホンのアーチと紺のイヤーカップが地色に沈んで、マークとして読めなくなる。
 * かといって CSS でこのページに円を敷いても、favicon やブラウザのタブ、
 * X に置いたときには効かない。直すなら絵の側。
 *
 * やっていることは単純で、絵全体の「太い白コピー」を最下層に一枚敷く。
 * 上から原画がそのまま重なるので、シルエットからはみ出した分だけが白く残る。
 *
 * この敷き方には効いてくる性質がある。
 *
 *   白背景では、原画と 1 画素も変わらない。
 *
 * 白い縁が白地に乗っても見えないうえ、縁は必ず原画の下にあるので絵を侵さない。
 * ライトテーマでも、白地の OGP 画像でも、何も足していないのと同じになる。
 * 縁は暗い背景に置かれたときだけ現れる。
 *
 * 灰色にすると、この性質は失われる（白地でも縁が見えるようになる）。
 * 検討した結果、縁は絵の一部ではなく補助でいてほしいので白にした。
 *
 * 原画を描き直したら、このスクリプトを再実行する:
 *   node scripts/build-icon.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE = join(root, 'src/assets/icon-source.svg');
/* favicon も同じ絵。ダークのタブバーでも同じ問題が起きるので同じものを使う */
const OUTPUTS = [join(root, 'public/icon.svg'), join(root, 'public/favicon.svg')];

/** 縁が元の線の外側にはみ出す量（viewBox 単位）。96px 表示で片側およそ 1px */
const HALO = 3.0;

/*
 * 原画の 1 つめのグループは中身が transform で縮小されている。
 * 線幅はその中の座標系で解釈されるので、指定する値は縮小率で割り戻す。
 */
const GROUP1_SCALE = 0.26458;

/**
 * 直下の要素を 1 つずつ切り出す。
 * グループが入れ子になっているので、深さを数えながら閉じタグを探す。
 */
function splitTopLevel(body) {
  const parts = [];
  let depth = 0;
  let start = 0;

  for (const m of body.matchAll(/<(\/?)g\b[^>]*?(\/?)>/g)) {
    const [tag, closing, selfClosing] = m;
    if (selfClosing) continue;

    if (closing) {
      depth -= 1;
      if (depth === 0) {
        parts.push(body.slice(start, m.index + tag.length));
        start = m.index + tag.length;
      }
    } else {
      if (depth === 0) start = m.index;
      depth += 1;
    }
  }

  return parts;
}

/**
 * グループを「白一色・線幅太め」に塗り替えて縁の素にする。
 * fill="none" は塗らない（塗ると線画が面で潰れる）。
 */
function toHalo(group, strokeWidth) {
  return group
    .replace(/fill="(?!none)[^"]*"/g, 'fill="#fff"')
    .replace(/stroke="[^"]*"/g, 'stroke="#fff"')
    .replace(/stroke-width="[^"]*"/g, `stroke-width="${strokeWidth}"`)
    .replace(/^<g\b/, '<g stroke-linejoin="round"');
}

const source = readFileSync(SOURCE, 'utf8');

const openTag = source.match(/<svg\b[^>]*>/);
if (!openTag) throw new Error(`${SOURCE} に <svg> が見つからない`);

const body = source.slice(openTag.index + openTag[0].length, source.lastIndexOf('</svg>'));
const groups = splitTopLevel(body);

if (groups.length !== 2) {
  throw new Error(
    `原画の構造が変わっている（直下のグループが ${groups.length} 個）。` +
      'このスクリプトは「塗りのグループ」「黒線のグループ」の 2 つを前提にしている'
  );
}

const [fills, lines] = groups;

/*
 * 縁は塗りと黒線の両方から作る。
 * 黒線ぶんを省くと軽くなりそうに見えるが、ヘッドホンのアーチは塗りを持たない
 * 線だけの図形なので、省くとそこに縁が付かず見た目が変わってしまう（実測 6.5% 差）。
 */
const halo =
  toHalo(fills, 18.898 + (HALO * 2) / GROUP1_SCALE) + toHalo(lines, 5 + HALO * 2);

const result = `${openTag[0]}${halo}${body}</svg>`;

for (const out of OUTPUTS) {
  writeFileSync(out, result);
  console.log(`${out} を書いた (${result.length} バイト)`);
}
