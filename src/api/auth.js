// api/auth.js
import { request } from './client';

export const register = (form) =>
  request('/api/auth/register', { method: 'POST', body: JSON.stringify(form) });

export const login = (form) =>
  request('/api/auth/login', { method: 'POST', body: JSON.stringify(form) });

// ログイン中のユーザーの情報を取得する（JWTが必要なAPI）
export const fetchMe = () => request('/api/me');

// メール内リンクのトークンを送って、メールアドレスを確認済みにする
export const verifyEmail = (token) =>
  request('/api/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
