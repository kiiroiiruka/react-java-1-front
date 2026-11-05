//メール内の確認リンク（/verify?token=...）を開いたときに表示するページ
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';

// バックエンドが返すステータスコードごとのエラーメッセージ
const ERROR_MESSAGES = {
  400: 'このリンクは無効です。メールに書かれたリンクをもう一度確認してください。',
  410: 'このリンクは有効期限が切れています。もう一度登録してください。',
};

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  // 'verifying'（確認中） / 'success'（完了） / 'error'（失敗）
  const [status, setStatus] = useState(token ? 'verifying' : 'error');
  const [error, setError] = useState(token ? '' : ERROR_MESSAGES[400]);
  // 開発中は StrictMode で useEffect が2回動くので、確認APIは1回だけ呼ぶ
  const requested = useRef(false);

  useEffect(() => {
    if (!token || requested.current) return;
    requested.current = true;
    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setError(
          ERROR_MESSAGES[err.status] ??
            '確認に失敗しました。時間をおいてもう一度お試しください。',
        );
        setStatus('error');
      });
  }, [token]);

  return (
    <div className="mx-auto w-full max-w-md p-4 pt-12">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {status === 'verifying' && (
          <>
            <h2 className="text-lg font-bold">確認しています…</h2>
            <p className="mt-2 text-sm text-gray-500">
              そのまましばらくお待ちください。
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-lg font-bold">
              メールアドレスの確認が完了しました
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              登録が完了しました。ログインしてサービスを利用できます。
            </p>
            <div className="mt-8 flex justify-end">
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                ログインへ
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-lg font-bold">確認できませんでした</h2>
            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>
            <div className="mt-8 flex justify-end">
              <Link
                to="/register"
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                登録画面に戻る
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
