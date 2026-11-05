// ログイン中のユーザーをアプリ全体で共有する
// ※バックエンドにセッションができるまでの仮の仕組み。ブラウザのタブを閉じるとログアウト状態に戻る
import { createContext, useContext, useState } from 'react';

const STORAGE_KEY = 'loginEmail';
const AuthContext = createContext(null);

// sessionStorage は使えない環境（プライベートモードなど）もあるので try で囲む
const readStoredEmail = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [email, setEmail] = useState(readStoredEmail);

  const login = (loginEmail) => {
    setEmail(loginEmail);
    try {
      sessionStorage.setItem(STORAGE_KEY, loginEmail);
    } catch {}
  };

  const logout = () => {
    setEmail(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
