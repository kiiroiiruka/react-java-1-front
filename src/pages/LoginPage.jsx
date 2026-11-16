//メールアドレスとパスワードでログインするページ描画
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useAuth } from '@/auth/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/setting/FormField';
import Alert from '@/components/ui/Alert';
import Button, { buttonClass } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';

// バックエンドが返すステータスコードごとのエラーメッセージ
const ERROR_MESSAGES = {
  401: 'メールアドレスまたはパスワードが違います。',
  403: 'メールアドレスの確認がまだです。届いたメールのリンクを開いてください。',
};

const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // すでにログイン済みならトップへ
  if (auth.email) return <Navigate to="/" replace />;

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await login({
        email: values.email.trim(),
        password: values.password,
      });
      // バックエンドが発行したJWT（result.token）を保存する
      auth.login(result.email, result.token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(
        ERROR_MESSAGES[err.status] ??
          'ログインに失敗しました。サーバーが起動しているか確認してください。',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <PageTitle description="メールアドレスとパスワードを入力してください。">
          ログイン
        </PageTitle>

        <div className="mt-6 flex flex-col gap-4">
          <FormField
            label="メールアドレス"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={handleChange}
          />
          <FormField
            label="パスワード"
            type="password"
            name="password"
            autoComplete="current-password"
            value={values.password}
            onChange={handleChange}
          />
        </div>

        {error && <Alert className="mt-5">{error}</Alert>}

        <Button
          type="submit"
          className="mt-8 w-full"
          disabled={values.email.trim() === '' || values.password === ''}
          loading={submitting}
        >
          {submitting ? 'ログイン中…' : 'ログイン'}
        </Button>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        アカウントをお持ちでない方は{' '}
        <Link to="/register" className={buttonClass('link')}>
          新規登録
        </Link>
      </p>

      {/* 開発用：バックエンドなしで設定ページを見るためのボタン（npm run dev のときだけ表示） */}
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => {
            auth.login('dev@example.com', null);
            navigate('/');
          }}
          className="mt-6 w-full rounded-lg border border-dashed border-line py-2 text-sm text-muted hover:bg-surface"
        >
          【開発用】ログインせずに設定ページへ
        </button>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
