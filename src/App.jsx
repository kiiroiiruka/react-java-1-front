import { Route, Routes } from 'react-router-dom';
import RequireAuth from './components/RequireAuth';
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
      {/* それ以外はログインが必要。未ログインなら /login へ移動 */}
      <Route
        path="/*"
        element={
          <RequireAuth>
            <SettingPages />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default App;
