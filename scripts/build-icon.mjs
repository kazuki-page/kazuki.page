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
import { Resvg } from '@resvg/resvg-js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const SOURCE = join(root, 'src/assets/icon-source.svg');
/* favicon も同じ絵。ダークのタブバーでも同じ問題が起きるので同じものを使う */
const SVG_OUTPUTS = [join(root, 'public/icon.svg'), join(root, 'public/favicon.svg')];
const ICO_OUTPUT = join(root, 'public/favicon.ico');

/** SVG に使う縁の太さ（viewBox 単位）。96px 表示で片側およそ 1px */
const HALO = 3.0;

/**
 * .ico に入れる解像度と、そこでの縁の太さ（px）。
 *
 * 16 と 32 がタブとブックマーク、48 が Windows の一覧、256 は
 * 拡大表示される場面のため。SVG を読めるブラウザは favicon.svg を
 * 優先するので、この .ico が出るのは SVG 非対応の環境だけ。
 *
 * 縁は viewBox 単位で指定するので、SVG と同じ値のままだと 16px では
 * 3 / 283.7 * 16 ≈ 0.17px にしかならず、まったく見えない。かといって
 * どの解像度も同じ太さ（例えば 1.3px）に揃えると、今度は小さいほうが
 * 破綻する。16px の 1.3px は絵の 16% を縁が占める計算で、実際に
 * 並べて見るとヘッドホンのアーチが白い塊に潰れ、オレンジの点に白い輪が
 * 付いただけのものになった。
 *
 * 小さいほど控えめに、という手で決めた値。数式にしていないのは、
 * これが計算ではなく見比べた結果だから。null は SVG と同じ太さ。
 */
const ICO_SIZES = [
  { size: 16, haloPx: 0.6 },
  { size: 32, haloPx: 0.9 },
  { size: 48, haloPx: 1.1 },
  { size: 256, haloPx: null },
];

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

// --- 原画を読む -----------------------------------------------------------

const source = readFileSync(SOURCE, 'utf8');

const openTag = source.match(/<svg\b[^>]*>/);
if (!openTag) throw new Error(`${SOURCE} に <svg> が見つからない`);

const viewBox = openTag[0].match(/viewBox="[\d.\s-]*?\s([\d.]+)\s+[\d.]+"/);
if (!viewBox) throw new Error(`${SOURCE} の viewBox が読めない`);
const viewBoxWidth = Number(viewBox[1]);

const body = source.slice(openTag.index + openTag[0].length, source.lastIndexOf('</svg>'));
const groups = splitTopLevel(body);

if (groups.length !== 2) {
  throw new Error(
    `原画の構造が変わっている（直下のグループが ${groups.length} 個）。` +
      'このスクリプトは「塗りのグループ」「黒線のグループ」の 2 つを前提にしている'
  );
}

const [fills, lines] = groups;

/**
 * 指定した太さの縁を付けた SVG を組み立てる。
 *
 * 縁は塗りと黒線の両方から作る。黒線ぶんを省くと軽くなりそうに見えるが、
 * ヘッドホンのアーチは塗りを持たない線だけの図形なので、省くとそこに縁が
 * 付かず見た目が変わってしまう（実測 6.5% 差）。
 */
function buildSvg(halo) {
  const haloLayer =
    toHalo(fills, 18.898 + (halo * 2) / GROUP1_SCALE) + toHalo(lines, 5 + halo * 2);
  return `${openTag[0]}${haloLayer}${body}</svg>`;
}

// --- SVG を書く -----------------------------------------------------------

const svg = buildSvg(HALO);
for (const out of SVG_OUTPUTS) {
  writeFileSync(out, svg);
  console.log(`${out.replace(root + '/', '')}  ${svg.length} バイト`);
}

// --- .ico を書く ----------------------------------------------------------

/**
 * PNG を並べて .ico にまとめる。
 *
 * ヘッダ 6 バイト + 解像度ごとの索引 16 バイト、そのあとに画像本体が続く。
 * 中身は PNG のまま入れている（Windows Vista 以降と現行ブラウザが対応する）。
 */
function packIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // 予約領域
  header.writeUInt16LE(1, 2); // 1 = アイコン
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach(({ size, png }, i) => {
    const o = i * 16;
    // 256 は 1 バイトに収まらないので 0 と書く決まり
    directory.writeUInt8(size === 256 ? 0 : size, o);
    directory.writeUInt8(size === 256 ? 0 : size, o + 1);
    directory.writeUInt8(0, o + 2); // パレット数（true color なので 0）
    directory.writeUInt8(0, o + 3); // 予約領域
    directory.writeUInt16LE(1, o + 4); // カラープレーン数
    directory.writeUInt16LE(32, o + 6); // ビット深度
    directory.writeUInt32LE(png.length, o + 8);
    directory.writeUInt32LE(offset, o + 12);
    offset += png.length;
  });

  return Buffer.concat([header, directory, ...images.map((i) => i.png)]);
}

const images = ICO_SIZES.map(({ size, haloPx }) => {
  // px で決めた太さを viewBox 単位に戻す
  const halo = haloPx === null ? HALO : (haloPx * viewBoxWidth) / size;
  const png = new Resvg(buildSvg(halo), {
    fitTo: { mode: 'width', value: size },
    background: 'rgba(0,0,0,0)',
  })
    .render()
    .asPng();

  console.log(`  ${String(size).padStart(3)}px  縁 ${halo.toFixed(1)} 単位  ${png.length} バイト`);
  return { size, png };
});

const ico = packIco(images);
writeFileSync(ICO_OUTPUT, ico);
const sizeList = ICO_SIZES.map(({ size }) => size).join(', ');
console.log(`${ICO_OUTPUT.replace(root + '/', '')}  ${ico.length} バイト  (${sizeList})`);
