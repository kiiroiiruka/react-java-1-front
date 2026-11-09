import { Navigate, Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PublicSharePage from './pages/PublicSharePage';
import RegisterPage from './pages/RegisterPage';
import SettingPages from './pages/SettingPages';
import VerifyEmailPage from './pages/VerifyEmailPage';

function App() {
  return (
    <Routes>
      {/* ログインしていなくても開けるページ */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify" element={<VerifyEmailPage />} />
      {/* 共有リンクを受け取った人が開くページ（このアプリのユーザーでなくても開ける） */}
      <Route path="/s/:slug" element={<PublicSharePage />} />

      {/* ここから下はログインが必要。未ログインなら /login へ移動 */}
      {/* ホーム：登録したサイトの一覧（0件なら /new へ移動する） */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <HomePage />
          </RequireAuth>
        }
      />
      {/* 新しいサイトを登録する3ステップ（/new → /new/send-to → /new/access） */}
      <Route
        path="/new/*"
        element={
          <RequireAuth>
            <SettingPages />
          </RequireAuth>
        }
      />
      {/* 知らないURLはホームへ */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
