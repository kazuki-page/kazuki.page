/*
 * blog.kazuki.page の最新記事を build 時に取り込む。
 *
 * 手で書き写す運用にすると必ず更新が止まり、「止まったサイト」に見える。
 * ブログを書いた時点でこちらも新しくなるよう、RSS から自動で引く。
 */

const FEED_URL = 'https://blog.kazuki.page/rss.xml';

/*
 * Weekly / Monthly に付いているカテゴリ。
 * ブログ側でこの分類を変えたらここも直すこと。
 */
const ROUTINE_CATEGORY = 'diary';

export type BlogPost = {
  title: string;
  url: string;
  date: Date;
  /** Weekly や Monthly のような定期更新か */
  routine: boolean;
};

/**
 * RSS の <item> から必要なものだけを取り出す。
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

    const categories = [...item.matchAll(/<category>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/category>/g)]
      .map((m) => m[1].trim());

    return [{ title: title.trim(), url: url.trim(), date, routine: categories.includes(ROUTINE_CATEGORY) }];
  });
}

/**
 * 新しい順に並べつつ、定期更新は maxRoutine 件までに抑えて選ぶ。
 *
 * 素直に上から取ると、Weekly を 2 本書いた直後は一覧が週報だけで埋まって
 * 「週報しか書いていない人」に見える。実際には読書録も雑記も書いているので、
 * 定期ものに上限をかけて、書いている幅がそのまま出るようにする。
 *
 * 上限で弾いた結果 limit に足りなくなったら、弾いたものを新しい順に戻す。
 * 「幅を見せる」より「空欄を作らない」を優先する。
 */
function pickPosts(posts: BlogPost[], limit: number, maxRoutine: number): BlogPost[] {
  const sorted = [...posts].sort((a, b) => b.date.getTime() - a.date.getTime());

  const picked: BlogPost[] = [];
  const skipped: BlogPost[] = [];
  let routineCount = 0;

  for (const post of sorted) {
    if (picked.length === limit) break;

    if (post.routine && routineCount >= maxRoutine) {
      skipped.push(post);
      continue;
    }

    if (post.routine) routineCount += 1;
    picked.push(post);
  }

  return [...picked, ...skipped.slice(0, limit - picked.length)].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );
}

/**
 * 最新記事を取得する。
 *
 * 取得に失敗したら空配列を返してビルドは通す。ブログ側が一時的に落ちて
 * いるだけでプロフィールサイトまでデプロイできなくなるのは割に合わない。
 * 呼び出し側は「0 件ならセクションごと出さない」で対応する。
 */
export async function getLatestPosts(limit = 3, maxRoutine = 1): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) {
      console.warn(`[blog-posts] ${FEED_URL} が ${res.status} を返した。記事一覧を省略する`);
      return [];
    }

    return pickPosts(parseFeed(await res.text()), limit, maxRoutine);
  } catch (e) {
    console.warn('[blog-posts] 取得に失敗した。記事一覧を省略する:', e);
    return [];
  }
}
