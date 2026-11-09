// ログイン後のページの上部（ログイン中のメールアドレスとログアウト）
import { useEffect, useState } from 'react';
import { fetchMe } from '@/api/auth';
import { useAuth } from '@/auth/AuthContext';

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
    <div className="flex items-center justify-end gap-3 text-sm">
      <span className="truncate text-gray-500">{me?.email ?? auth.email}</span>
      <button
        type="button"
        onClick={auth.logout}
        className="shrink-0 font-bold text-blue-600 hover:underline"
      >
        ログアウト
      </button>
    </div>
  );
};

export default AppHeader;
