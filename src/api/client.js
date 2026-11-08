// api/client.js
import { clearAuth, loadAuth } from '@/auth/storage';

// 開発中（npm run dev）は .env.development の VITE_API_URL（http://localhost:8080）を使う
// 本番（npm run build）は .env.production の VITE_API_URL（HerokuのURL）を使う
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function request(path, options = {}) {
  // ログイン中なら、JWTを「Authorization: Bearer <JWT>」ヘッダーにつけて送る
  // （Cookieと違ってブラウザは自動で送ってくれないので、自分でつける）
  const token = loadAuth()?.token;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  // JWTを送ったのに401 → 期限切れか偽物。保存しているJWTを捨ててログイン画面へ
  if (res.status === 401 && token) {
    clearAuth();
    window.location.assign('/login');
  }

  //もしもOKならば、res.json()を返す。そうでなければエラーを投げる
  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`);
    error.status = res.status; // 呼び出し側で 409 などを見分けられるようにする
    throw error;
  }
  return res.json();
}
