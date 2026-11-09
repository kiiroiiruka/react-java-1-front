// api/shares.js
import { request } from './client';

// 共有リンクを作る（設定画面の「完了」ボタン）
export const createShare = (form) =>
  request('/api/shares', { method: 'POST', body: JSON.stringify(form) });

// 自分が作った共有リンクの一覧（新しい順）
export const listShares = () => request('/api/shares');

// 自分の共有リンクを削除する
export const deleteShare = (id) =>
  request(`/api/shares/${id}`, { method: 'DELETE' });

// 相手に送る共有URL。今開いているサイト（Cloudflare）のURLに /s/<slug> をつける
export const shareUrlOf = (slug) => `${window.location.origin}/s/${slug}`;
