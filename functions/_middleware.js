/**
 * Cloudflare Pages のリクエスト処理。
 *
 * pages.dev で来たアクセスを本番ドメインへ寄せるだけ。
 * パスのリダイレクトは `public/_redirects` 側にある
 * （`_redirects` はドメイン単位のリダイレクトに対応していないため、ここが要る）。
 */

const CANONICAL_HOST = 'kazuki.page';

/**
 * 本番の pages.dev ホスト。
 *
 * Cloudflare は `<プロジェクト名>.pages.dev` を無効にできないため、
 * 同じ内容が 2 つの URL で見える状態になる。ここで本番ドメインへ 301 して
 * 実質的に閉じる。
 *
 * プレビュー用の `<ハッシュ>.kazuki-page.pages.dev` は対象外にしている。
 * 本番へ飛ばしてしまうとプレビューの確認ができなくなるため。
 */
const PAGES_DEV_HOST = 'kazuki-page.pages.dev';

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === PAGES_DEV_HOST) {
    const target = new URL(url.pathname + url.search, `https://${CANONICAL_HOST}`);
    return Response.redirect(target.toString(), 301);
  }

  return context.next();
}
