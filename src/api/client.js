// api/client.js
// 開発中（npm run dev）は .env.development の VITE_API_URL（http://localhost:8080）を使う
// 本番はSpring Bootと同じサーバーから配信されるので、空文字（= 同じURL）でよい
const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  //もしもOKならば、res.json()を返す。そうでなければエラーを投げる
  if (!res.ok) {
    const error = new Error(`HTTP ${res.status}`);
    error.status = res.status; // 呼び出し側で 409 などを見分けられるようにする
    throw error;
  }
  return res.json();
}
