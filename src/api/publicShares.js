// api/publicShares.js
// 共有リンクを受け取った人（ログインしていない人）が使うAPI
// JWTは不要なので auth: false にする
// （期限切れのJWTを送ると、公開ページなのに 401 になってしまうため）
import { request } from './client';

// リンクが存在して、期限内かを確認する（URLはまだ返ってこない）
export const getPublicShare = (slug) =>
  request(`/api/public/shares/${encodeURIComponent(slug)}`, { auth: false });

// パスワードを送って、合っていれば共有されたURLを受け取る
export const openShare = (slug, password) =>
  request(`/api/public/shares/${encodeURIComponent(slug)}/open`, {
    method: 'POST',
    body: JSON.stringify({ password }),
    auth: false,
  });
