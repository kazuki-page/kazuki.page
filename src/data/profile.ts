/*
 * サイトに載せる内容はすべてこのファイルに集める。
 * 見た目を変えずに中身だけ直したいときは、ここだけ触れば済む。
 *
 * ★ の付いたコメントは「事実を確認してほしい箇所」。ドラフト時点の仮置き。
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
 * つくっているもの。
 */
export const works = [
  {
    title: 'ブログ',
    url: 'https://blog.kazuki.page/',
    description: '考えたことの記録と、定期的な振り返り。',
  },
  {
    title: 'GitHub',
    url: 'https://github.com/kazuki-page',
    description: '自作アプリやウェブサイトのコード',
  },
  {
    title: 'YouTube',
    url: 'https://www.youtube.com/@kazuki-page',
    description: 'ゲーム実況と楽曲カバー。',
  },
  {
    title: 'pixiv',
    url: 'https://www.pixiv.net/users/92910523',
    description: 'FAを中心としたイラスト。',
  },
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
 * リンク一覧。
 * X は「次にしてほしいこと」の本命なのでこの配列には入れず、
 * ファーストビューと末尾で別扱いにしている（primaryLink）。
 */
export const primaryLink = {
  label: 'X (@kazuki_page)',
  url: 'https://x.com/kazuki_page',
  description: '活動報告、つぶやきなど。だいたいはここで観測可能。',
};

export const links = [
  { label: 'ブログ', url: 'https://blog.kazuki.page/' },
  { label: 'GitHub', url: 'https://github.com/kazuki-page' },
  { label: 'YouTube', url: 'https://www.youtube.com/@kazuki-page' },
  { label: 'pixiv', url: 'https://www.pixiv.net/users/92910523' },
  { label: 'OFUSE', url: 'https://ofuse.me/kazukipage' },
];

export const contact = {
  text: 'ご連絡は X のダイレクトメッセージへ。',
  url: 'https://x.com/kazuki_page',
};

/*
 * 最終更新日。
 * 「生きているサイト」であることを示す記号として置いている。
 * 内容を直したらここも直すこと。
 */
export const updatedAt = '2026-08-09';
