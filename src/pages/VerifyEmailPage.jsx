//メール内の確認リンク（/verify?token=...）を開いたときに表示するページ
import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
import AuthLayout from '@/components/AuthLayout';
import Alert from '@/components/ui/Alert';
import { buttonClass } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import Spinner from '@/components/ui/Spinner';

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
    <AuthLayout>
      <Card>
        {status === 'verifying' && (
          <div className="flex flex-col items-center gap-4 py-6 text-center text-ink">
            <Spinner size={28} />
            <PageTitle description="そのまましばらくお待ちください。">
              確認しています…
            </PageTitle>
          </div>
        )}

        {status === 'success' && (
          <>
            <PageTitle description="登録が完了しました。ログインしてサービスを利用できます。">
              メールアドレスの確認が完了しました
            </PageTitle>
            <Link
              to="/login"
              className={`mt-8 w-full ${buttonClass('primary')}`}
            >
              ログインへ
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <PageTitle>確認できませんでした</PageTitle>
            <Alert className="mt-4">{error}</Alert>
            <div className="mt-8 border-t border-line pt-5">
              <Link to="/register" className={buttonClass('link')}>
                登録画面に戻る
              </Link>
            </div>
          </>
        )}
      </Card>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
