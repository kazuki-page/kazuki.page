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
 *
 * 媒体名を並べるのではなく、媒体ごとに実物を 2 件ずつ出す。
 * 「フォローしたら何が流れてくるか」への答えとしては、分類の説明より
 * 実際の作品名のほうが強い。3 件にすると 4 媒体で 12 件になり、
 * 30 秒で読まれる 1 ページには多すぎる。2 件なら本当に選ぶことになるので、
 * 「並べた」ではなく「選んだ」に見える。
 *
 * ブログだけは latest: true にして、ビルド時に RSS の最新 2 件が入る。
 * 更新頻度が価値の媒体なので新しさを出す。他は頻度で戦っていないので、
 * 本人が選んだものを置く。
 *
 * 日付が出るのはブログだけなので、読む人には「日付があるものは新着、
 * ないものは選んだもの」と自然に読める。言葉での説明は足していない。
 */
type Work = {
  medium: string;
  url: string;
  /** ビルド時に blog.kazuki.page の RSS から最新 2 件を入れる */
  latest?: true;
  /** 自分で選んだ代表作。2 件を想定 */
  picks?: { title: string; url: string; note?: string }[];
};

export const works: Work[] = [
  {
    medium: 'blog.kazuki.page（ブログ）',
    url: 'https://blog.kazuki.page/',
    latest: true,
  },
  {
    medium: 'GitHub',
    url: 'https://github.com/kazuki-page',
    picks: [
      {
        title: '大家の帳面',
        url: 'https://github.com/kazuki-page/chomen',
        note: '賃貸データ管理アプリケーション。デモ： https://chomen-demo.kazuki.page',
      },
      {
        title: 'blog.kazuki.page',
        url: 'https://github.com/kazuki-page/blog.kazuki.page',
        note: 'ブログの実装',
      },
    ],
  },
  {
    medium: 'YouTube',
    url: 'https://www.youtube.com/@kazuki-page',
    // ★ 代表作を 2 件。動画のタイトルと URL、必要なら一言
    picks: [
      {
        title: 'Alice / 古川P covered by かずき',
        url: 'https://www.youtube.com/watch?v=gLDRmTnubFE',
        note: '歌ってみた',
      },
      {
        title: '【新鬼武者 超鬼難】#1 縛り実況プレイ',
        url: 'https://www.youtube.com/watch?v=yzUpgPZL1Bo',
        note: 'ゲーム実況',
      },
    ],
  },
  {
    medium: 'pixiv',
    url: 'https://www.pixiv.net/users/92910523',
    // ★ 代表作を 2 件
    picks: [
      {
        title: 'kazuki.page 立ち絵',
        url: 'https://www.pixiv.net/artworks/147124951',
        note: '自キャラの全身イラスト'
      },
      {
        title: 'kazuki.page SDイラスト',
        url: 'https://www.pixiv.net/artworks/147124993',
        note: '自キャラのデフォルメイラスト'
      },
    ],
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
export const updatedAt = '2026-08-09';
