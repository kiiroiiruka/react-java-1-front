//メールアドレスとパスワードでログインするページ描画
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { login } from '@/api/auth';
import { useAuth } from '@/auth/AuthContext';
import FormField from '@/components/setting/FormField';

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
      auth.login(result.email);
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
    <div className="mx-auto w-full max-w-md p-4 pt-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold">ログイン</h2>
        <p className="mt-1 text-sm text-gray-500">
          メールアドレスとパスワードを入力してください。
        </p>

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

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Link
            to="/register"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            新規登録はこちら
          </Link>
          <button
            type="submit"
            disabled={
              submitting || values.email.trim() === '' || values.password === ''
            }
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? 'ログイン中…' : 'ログイン'}
          </button>
        </div>
      </form>

      {/* 開発用：バックエンドなしで設定ページを見るためのボタン（npm run dev のときだけ表示） */}
      {import.meta.env.DEV && (
        <button
          type="button"
          onClick={() => {
            auth.login('dev@example.com');
            navigate('/');
          }}
          className="mt-4 w-full rounded-lg border border-dashed border-gray-400 py-2 text-sm text-gray-500 hover:bg-gray-50"
        >
          【開発用】ログインせずに設定ページへ
        </button>
      )}
    </div>
  );
};

export default LoginPage;
