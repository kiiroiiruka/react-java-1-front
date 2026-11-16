// ログイン後のページの上部（鍵のマーク・ログイン中のメールアドレス・ログアウト）
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMe } from '@/api/auth';
import { useAuth } from '@/auth/AuthContext';
import Button from './ui/Button';
import LockMark from './ui/LockMark';

const AppHeader = () => {
  const auth = useAuth();
  // サーバーから受け取った「ログイン中のユーザー」（GET /api/me）
  const [me, setMe] = useState(null);

  useEffect(() => {
    // 保存しているJWTがまだ有効かをサーバーに確かめる
    // 期限切れなら 401 になり、client.js がログイン画面へ移動させる
    fetchMe()
      .then(setMe)
      .catch(() => {});
  }, []);

  return (
    <header className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" aria-label="ホームへ">
          <LockMark size={36} />
        </Link>
        <div className="flex min-w-0 items-center gap-4">
          <span className="truncate text-sm text-muted">
            {me?.email ?? auth.email}
          </span>
          <Button variant="secondary" size="sm" onClick={auth.logout}>
            ログアウト
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
