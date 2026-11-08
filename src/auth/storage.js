// ログイン情報（メールアドレスとJWT）をブラウザの localStorage に保存する
// AuthContext（画面の状態）と client.js（APIの呼び出し）の両方から使うので、ファイルを分けている
//
// localStorage はタブを閉じても残るので、1時間（JWTの有効期限）の間はログインしたままになる
// ※ localStorage は JavaScript から読めるので、XSS で盗まれないよう
//    dangerouslySetInnerHTML などでユーザーの入力をそのままHTMLにしないこと

const STORAGE_KEY = 'auth';

// 使えない環境（プライベートモードなど）もあるので try で囲む
export const loadAuth = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
};

export const saveAuth = (auth) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {}
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
};
