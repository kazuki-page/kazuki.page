# kazuki.page

プロフィールサイト [kazuki.page](https://kazuki.page) の実装。
WordPress から Astro + Cloudflare Pages へ移行するもの（移行はまだ完了していない）。

## このサイトが何のためにあるか

X からとんできた人に、**戻ってフォローしてもらう**ための 1 ページ。
就活で見られる可能性もあるが副次的で、目標は「使う」ではなく「減点されない」こと。

設計はこの目的から引いている。実装を変えるときは、まずここに立ち返ること。

| 判断 | 理由 |
| --- | --- |
| 1 ページ完結 | X から来る人はスマホ縦・数十秒。ページ遷移させると離脱する |
| 塗りのボタンは X の 1 つだけ | 他を静かにしておけば「次にしてほしいこと」が迷わず伝わる |
| 「いま」を実績より先に置く | 応援したくなる気持ちは、完成品ではなく進行中のものに向く |
| 形容詞で人柄を書かない | 「意欲的です」は嘘くさい。事実の量とレンジで読み手に判断させる |
| 最終更新日を出す | 「生きているサイト」の記号。誠実さの伝達効率がいちばん高い一行 |
| ブログ最新記事は自動取得 | 手で書き写すと必ず止まる。止まったサイトは印象を大きく削る |

## 構成

```
src/
  data/profile.ts     載せる内容はすべてここ。中身だけ直すならこのファイル
  lib/blog-posts.ts   blog.kazuki.page/rss.xml から最新記事を取る（build 時）
  pages/index.astro   1 ページの本体。セクションの順番に意図がある
  pages/policy.astro  現行 WordPress から文面ごと引き継いだもの
  layouts/            <head>・テーマ切り替え・フッター
  styles/global.css   blog.kazuki.page と共通の土台（色・書体・最上部の帯）
```

**内容の変更は `src/data/profile.ts` だけで完結する。** 見た目を触る必要はない。

## blog.kazuki.page との関係

2 サイトが 1 つのブランドに見えるよう、次を揃えている。

- カラー変数（`--bg` `--text` `--accent` ほか）とダークテーマの切り替え方
- 書体（BIZ UDゴシック系の等幅）
- ページ最上部の 3 本の帯
- `trailingSlash: 'always'`、`_headers` のセキュリティヘッダ

違うのは密度だけ。ブログは読ませる場、こちらは 10 秒で判断される場なので、
本文幅を 42rem → 40rem に詰め、余白と文字サイズを小さくしている。

テーマの設定は共有されない。同じ `localStorage` のキーを使っているが、
ドメインが違うため別々に保存される（共有するには Cookie が要る）。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（ブログの 4321 と衝突するので 4322 を使う） |
| `npm run build` | ビルド。RSS の取得もここで走る |
| `npm run preview` | ビルド結果をローカルで確認 |

RSS の取得に失敗してもビルドは通る（記事セクションが消えるだけ）。
ブログ側が一時的に落ちているだけでデプロイできなくなるのは割に合わないため。

## 移行前にやること

- [ ] アイコン画像を `public/` に置き、`intro.avatar` にパスを書く
- [ ] OGP 画像の差し替え（`public/ogp-default.png` は今ブログ用の流用）
- [ ] 現行 WordPress のサイトマップで公開 URL を棚卸しし、`public/_redirects` に追記
- [ ] Cloudflare Pages にプロジェクトを作成（Direct Upload、ブログと同じ方式）
- [ ] DNS を切り替え、`/about/` → `/` の 301 が効いていることを確認
- [ ] blog.kazuki.page 側の `/about/` にある「詳しいプロフィールは」のリンク先を確認
- [ ] blog.kazuki.page の `_redirects` にある `/contact/` の暫定リダイレクトを見直す

## 技術構成

- [Astro](https://astro.build) 7（静的出力）
- Cloudflare Pages（Direct Upload）
- TypeScript
