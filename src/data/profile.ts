/*
 * サイトに載せる内容はすべてこのファイルに集める。
 * 見た目を変えずに中身だけ直したいときは、ここだけ触れば済む。
 *
 * 直したら末尾の updatedAt も直すこと。
 */

/** ファーストビュー。X から来た人が最初の数秒で見るところ */
export const intro = {
  name: 'kazuki.page',
  reading: 'かずき ぺーじ',

  /*
   * 一行紹介。
   */
  tagline: 'まだ何者でもない、ような気がしつつもいろいろと。',
  taglineSub: 'ブログ、イラスト、動画など。AIでアプリ開発の一方でプログラミング学習も。',

  /*
   * アイコン画像。
   */
  /* 先頭のスラッシュは必須。相対パスだと下層ページを足したときに壊れる */
  avatar: '/icon.svg',
};

/*
 * いま取り組んでいること。
 */
export const now: { text: string; note?: string }[] = [
  { text: 'ブログを書き続けている', note: '4年目、約300記事' },
  { text: 'ブログとプロフページを工事中', note: 'WordPressからAstroへ' },
  { text: '自動車免許を取るために準備中' },
  { text: '免許取得後は就活を本格化予定' },
];

/*
 * つくったもの。このサイトで一番見せたいところ。
 *
 * 各アプリの OGP 画像をそのまま並べる。3 枚が同じ書式で揃うので、
 * 「作品が 3 つある」ではなく「つくり方が一貫している」に見える。
 * 単体で置くより並べたときの効果が大きい、というのがこの見せ方の理由。
 *
 * 説明文は持たせない。タグラインも技術スタックも OGP 画像の中に
 * 描いてあるので、下に書くと二重になる。カード自体をデモへのリンクにして、
 * テキストは作品名と導線だけに絞る。
 *
 * 並び順は背景色が濃い→淡い→濃いになるようにしてある。同じ濃さが
 * 続くと 3 枚が一枚の塊に見えて、境目が分からなくなる。
 */
type App = {
  name: string;
  /** public/works/ に置いた OGP 画像。デモ側と同じもの */
  image: string;
  /** 画像が出ないときに何のアプリか分かる文。画像内のタグラインと揃える */
  alt: string;
  demo: string;
  /*
   * ソースコード。まだ public にしていないものは書かない。
   * 404 になるリンクを出すくらいならデモだけ出すほうがいい。
   */
  repo?: string;
};

export const apps: App[] = [
  {
    name: '家主の帳面',
    image: '/works/chomen.png',
    alt: '家主の帳面 — 賃貸物件の入居者・修繕管理アプリ',
    demo: 'https://chomen-demo.kazuki.page/',
    repo: 'https://github.com/kazuki-page/chomen',
  },
  {
    name: 'daifuku',
    image: '/works/daifuku.png',
    alt: 'daifuku — 入出金と資産残高を切り離して記録する家計簿',
    demo: 'https://daifuku-demo.kazuki.page/',
    // repo: 'https://github.com/kazuki-page/daifuku',  // public 化したら開ける
  },
  {
    name: 'leaves',
    image: '/works/leaves.png',
    alt: 'leaves — メモを貯めて、見返して、AI に渡すツール',
    demo: 'https://leaves-demo.kazuki.page/',
    // repo: 'https://github.com/kazuki-page/leaves',  // public 化したら開ける
  },
];

/*
 * ブログ。ビルド時に RSS から入る。
 *
 * limit を 2 から 3 に増やしてあるが、効いているのは maxRoutine のほう。
 * 素直に新しい順で取ると Weekly を 2 本書いた直後に一覧が週報で埋まり、
 * 「週報しか書いていない人」に見える。定期もの（RSS の diary カテゴリ、
 * Weekly と Monthly が該当）を 1 件までにすると、読書録や雑記が残って
 * 書いている幅がそのまま出る。
 */
export const blog = {
  url: 'https://blog.kazuki.page/',
  limit: 3,
  maxRoutine: 1,
};

/*
 * そのほかの活動。
 *
 * かつては「つくっているもの」の中で各媒体 2 件ずつ実物を並べていたが、
 * アプリを主役に据えた時点で、ここまで同じ密度で見せる必要がなくなった。
 * この 2 つは「やっている」ことが伝わればよく、中身は現地で見てもらう。
 */
export const otherLinks: { label: string; url: string; note: string }[] = [
  { label: 'YouTube', url: 'https://www.youtube.com/@kazuki-page', note: '歌ってみた、ゲーム実況' },
  { label: 'pixiv', url: 'https://www.pixiv.net/users/92910523', note: 'イラスト' },
];

/*
 * これまで。
 */
export const history: { year: string; text: string }[] = [
  { year: '2022', text: 'ブログを書き始める' },
  { year: '2023', text: '基本情報技術者試験 合格' },
  { year: '2026', text: 'ブログを WordPress から Astro へ移行' },
];

/*
 * ファーストビューと末尾に置く、このサイトの本命の導線。
 *
 * かつては「リンク」セクションで媒体を一覧していたが、「つくっているもの」が
 * 媒体ごとの見出しを持つようになった時点で中身がそのまま重複したので畳んだ。
 * 各媒体へは「つくっているもの」の見出しから行ける。
 */
export const primaryLink = {
  label: 'X (@kazuki_page)',
  url: 'https://x.com/kazuki_page',
  description: '活動報告、つぶやきなど。だいたいはここで観測可能。',
};

export const contact = {
  text: 'ご連絡は X のダイレクトメッセージへ。',
  url: 'https://x.com/kazuki_page',
};

/*
 * 最終更新日。
 * 「生きているサイト」であることを示す記号として置いている。
 * 内容を直したらここも直すこと。
 */
export const updatedAt = '2026-08-23';
