//メールアドレスとパスワードで新規登録するページ描画
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '@/api/auth';
import FormField from '@/components/setting/FormField';

const MIN_PASSWORD_LENGTH = 8;

// バックエンドが返すステータスコードごとのエラーメッセージ
const ERROR_MESSAGES = {
  400: 'メールアドレスの形式か、パスワードの長さが正しくありません。',
  409: 'このメールアドレスは既に登録されています。',
};

const RegisterPage = () => {
  const [values, setValues] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  // 送信前にフロント側でチェックする（サーバー側でも同じチェックをしている）
  const validationError = (() => {
    if (values.password.length < MIN_PASSWORD_LENGTH)
      return `パスワードは${MIN_PASSWORD_LENGTH}文字以上にしてください。`;
    if (values.password !== values.passwordConfirm)
      return 'パスワードが一致しません。';
    return '';
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = await register({
        email: values.email.trim(),
        password: values.password,
      });
      setRegisteredEmail(result.email);
    } catch (err) {
      setError(
        ERROR_MESSAGES[err.status] ??
          '登録に失敗しました。サーバーが起動しているか確認してください。',
      );
    } finally {
      setSubmitting(false);
    }
  };

  // 送信できたら「メールを開いてください」画面に切り替える
  if (registeredEmail) {
    return (
      <div className="mx-auto w-full max-w-md p-4 pt-12">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold">確認メールを送信しました</h2>
          <p className="mt-2 text-sm text-gray-700">
            <span className="font-bold break-all">{registeredEmail}</span>{' '}
            宛にメールを送りました。メール内のリンクを開いて、登録を完了してください。
          </p>
          <p className="mt-4 text-sm text-gray-500">
            メールが届かない場合は、迷惑メールフォルダも確認してください。
          </p>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => setRegisteredEmail('')}
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              メールアドレスを間違えた場合はこちら
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md p-4 pt-12">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-lg font-bold">新規登録</h2>
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
            label={`パスワード（${MIN_PASSWORD_LENGTH}文字以上）`}
            type="password"
            name="password"
            autoComplete="new-password"
            value={values.password}
            onChange={handleChange}
          />
          <FormField
            label="パスワード（確認）"
            type="password"
            name="passwordConfirm"
            autoComplete="new-password"
            value={values.passwordConfirm}
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
            to="/login"
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            ログインはこちら
          </Link>
          <button
            type="submit"
            disabled={submitting || values.email.trim() === ''}
            className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? '登録中…' : '登録する'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
