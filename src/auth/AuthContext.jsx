// ログイン中のユーザーをアプリ全体で共有する
// ログイン時にバックエンドから受け取ったJWTを保存し、client.js がAPIを呼ぶときに使う
import { createContext, useContext, useState } from 'react';
import { clearAuth, loadAuth, saveAuth } from './storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // { email, token } または null（未ログイン）
  const [auth, setAuth] = useState(loadAuth);

  const login = (email, token) => {
    const next = { email, token };
    setAuth(next);
    saveAuth(next);
  };

  // JWTはサーバーが何も覚えていないので、ブラウザから捨てるだけでログアウトになる
  const logout = () => {
    setAuth(null);
    clearAuth();
  };

  return (
    <AuthContext.Provider value={{ email: auth?.email ?? null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
