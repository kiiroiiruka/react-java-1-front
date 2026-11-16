//メールアドレスとパスワードで新規登録するページ描画
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '@/api/auth';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/setting/FormField';
import Alert from '@/components/ui/Alert';
import Button, { buttonClass } from '@/components/ui/Button';
import Card from '@/components/ui/Card';

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
      <AuthLayout>
        <Card>
          <h1 className="text-2xl font-bold text-ink">
            確認メールを送信しました
          </h1>
          <p className="mt-4 text-sm leading-relaxed">
            <span className="font-bold break-all text-ink">
              {registeredEmail}
            </span>{' '}
            宛にメールを送りました。メール内のリンクを開いて、登録を完了してください。
          </p>
          <p className="mt-4 text-sm text-muted">
            メールが届かない場合は、迷惑メールフォルダも確認してください。
          </p>
          <div className="mt-8 border-t border-line pt-5">
            <Button variant="link" onClick={() => setRegisteredEmail('')}>
              メールアドレスを間違えた場合はこちら
            </Button>
          </div>
        </Card>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <Card as="form" onSubmit={handleSubmit} noValidate>
        <h1 className="text-2xl font-bold text-ink">新規登録</h1>
        <p className="mt-2 text-sm text-muted">
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

        {error && <Alert className="mt-5">{error}</Alert>}

        <Button
          type="submit"
          className="mt-8 w-full"
          disabled={submitting || values.email.trim() === ''}
        >
          {submitting ? '登録中…' : '登録する'}
        </Button>
      </Card>

      <p className="mt-6 text-center text-sm text-muted">
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className={buttonClass('link')}>
          ログイン
        </Link>
      </p>
    </AuthLayout>
  );
};

export default RegisterPage;
