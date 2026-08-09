/*
 * blog.kazuki.page の最新記事を build 時に取り込む。
 *
 * 手で書き写す運用にすると必ず更新が止まり、「止まったサイト」に見える。
 * ブログを書いた時点でこちらも新しくなるよう、RSS から自動で引く。
 */

const FEED_URL = 'https://blog.kazuki.page/rss.xml';

export type BlogPost = {
  title: string;
  url: string;
  date: Date;
};

/**
 * RSS の <item> から必要な 3 つだけを取り出す。
 *
 * XML パーサを足さず正規表現で済ませているのは、相手が自分の生成した
 * RSS で構造が分かっているため。他人のフィードを読むなら話は別。
 */
function parseFeed(xml: string): BlogPost[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

  return items.flatMap((item) => {
    // タイトルは CDATA で囲まれている場合とそうでない場合がある
    const title = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1];
    const url = item.match(/<link>([\s\S]*?)<\/link>/)?.[1];
    const pubDate = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];

    if (!title || !url || !pubDate) return [];

    const date = new Date(pubDate);
    if (Number.isNaN(date.getTime())) return [];

    return [{ title: title.trim(), url: url.trim(), date }];
  });
}

/**
 * 最新記事を取得する。
 *
 * 取得に失敗したら空配列を返してビルドは通す。ブログ側が一時的に落ちて
 * いるだけでプロフィールサイトまでデプロイできなくなるのは割に合わない。
 * 呼び出し側は「0 件ならセクションごと出さない」で対応する。
 */
export async function getLatestPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.warn(`[blog-posts] ${FEED_URL} が ${res.status} を返した。記事一覧を省略する`);
      return [];
    }

    return parseFeed(await res.text())
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
  } catch (e) {
    console.warn('[blog-posts] 取得に失敗した。記事一覧を省略する:', e);
    return [];
  }
}
