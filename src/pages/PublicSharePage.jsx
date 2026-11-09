// 共有リンク（/s/:slug）を受け取った人が開くページ
// パスワードが合って、有効期限内なら、共有されたWebサイトに移動する
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicShare, openShare } from '@/api/publicShares';
import FormField from '@/components/setting/FormField';
import { timeZoneLabel } from '@/constants/timeZones';

// バックエンドが返すステータスコードごとのメッセージ
const ERROR_MESSAGES = {
  403: 'パスワードが違います。',
  404: 'このリンクは見つかりません。URLをもう一度確認してください。',
  410: 'このリンクは有効期限が切れているため、現在は開けません。',
};

const PublicSharePage = () => {
  const { slug } = useParams();
  // 'loading'（確認中） / 'ready'（パスワード入力） / 'unavailable'（開けない）
  const [status, setStatus] = useState('loading');
  const [share, setShare] = useState(null); // { expiresAt, timeZone }
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // 開発中は StrictMode で useEffect が2回動くので、確認APIは1回だけ呼ぶ
  const requested = useRef(false);

  // ページを開いたら、まずリンクが有効か（存在する・期限内）を確認する
  useEffect(() => {
    if (requested.current) return;
    requested.current = true;
    getPublicShare(slug)
      .then((data) => {
        setShare(data);
        setStatus('ready');
      })
      .catch((err) => {
        setError(
          ERROR_MESSAGES[err.status] ??
            'リンクを確認できませんでした。時間をおいてもう一度お試しください。',
        );
        setStatus('unavailable');
      });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await openShare(slug, password);
      // 共有されたWebサイトに移動する（URLはサーバー側で http/https のみ許可している）
      window.location.assign(result.url);
    } catch (err) {
      setError(
        ERROR_MESSAGES[err.status] ??
          '開けませんでした。時間をおいてもう一度お試しください。',
      );
      // パスワードを入力している間に期限が切れた場合
      if (err.status === 410) setStatus('unavailable');
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md p-4 pt-12">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        {status === 'loading' && (
          <h2 className="text-lg font-bold">リンクを確認しています…</h2>
        )}

        {status === 'unavailable' && (
          <>
            <h2 className="text-lg font-bold">このリンクは開けません</h2>
            <p role="alert" className="mt-2 text-sm text-red-600">
              {error}
            </p>
          </>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-lg font-bold">共有されたリンク</h2>
            <p className="mt-1 text-sm text-gray-500">
              {share.expiresAt}（{timeZoneLabel(share.timeZone)}
              ）の終わりまで閲覧できます。 パスワードを入力してください。
            </p>

            <div className="mt-6">
              <FormField
                label="パスワード"
                type="password"
                name="password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={!password || submitting}
                className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting ? '確認中…' : '開く'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublicSharePage;
