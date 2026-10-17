// api/client.js
const BASE_URL = 'http://localhost:8080';

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
