// 共有リンク（/s/:slug）を受け取った人が開くページ
// パスワードが合って、有効期限内なら、共有されたWebサイトを表示する
//   埋め込めるサイト：このページの中に iframe で表示し、期限が来たら消す
//   埋め込めないサイト：そのサイトへ移動する
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicShare, openShare } from '@/api/publicShares';
import AuthLayout from '@/components/AuthLayout';
import FormField from '@/components/setting/FormField';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LockMark from '@/components/ui/LockMark';
import { timeZoneLabel } from '@/constants/timeZones';

// バックエンドが返すステータスコードごとのメッセージ
const ERROR_MESSAGES = {
  403: 'パスワードが違います。',
  404: 'このリンクは見つかりません。URLをもう一度確認してください。',
  410: 'このリンクは有効期限が切れているため、現在は開けません。',
};

const PublicSharePage = () => {
  const { slug } = useParams();
  // 'loading'（確認中） / 'ready'（パスワード入力） / 'viewing'（埋め込み表示中） / 'unavailable'（開けない）
  const [status, setStatus] = useState('loading');
  const [share, setShare] = useState(null); // { expiresAt, timeZone }
  const [opened, setOpened] = useState(null); // { embedUrl, title, closesAt }
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

  // 埋め込み表示中は、期限の瞬間（closesAt）を過ぎたら iframe を消す
  // （ページを開きっぱなしでも見られなくなるように、10秒ごとに時計を確認する）
  useEffect(() => {
    if (status !== 'viewing') return;
    const closesAt = new Date(opened.closesAt).getTime();
    const timer = setInterval(() => {
      if (Date.now() >= closesAt) {
        setOpened(null);
        setError(ERROR_MESSAGES[410]);
        setStatus('unavailable');
      }
    }, 10_000);
    return () => clearInterval(timer);
  }, [status, opened]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const result = await openShare(slug, password);
      if (result.embedUrl) {
        setOpened(result);
        setStatus('viewing');
        return;
      }
      // 埋め込めないサイトは、そのサイトへ移動する（URLはサーバー側で http/https のみ許可している）
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

  if (status === 'viewing') {
    return (
      <div className="mx-auto flex h-screen w-full max-w-5xl flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <LockMark size={32} />
            <h1 className="truncate text-lg font-bold text-ink">
              {opened.title}
            </h1>
          </div>
          <Badge>
            {share.expiresAt}（{timeZoneLabel(share.timeZone)}
            ）の終わりまで閲覧できます
          </Badge>
        </div>
        {/* sandbox：埋め込んだサイトに許すことを絞る（このページ自体を別のURLに書き換える、などはさせない） */}
        <iframe
          src={opened.embedUrl}
          title={opened.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full flex-1 rounded-2xl border border-line bg-white"
        />
      </div>
    );
  }

  return (
    <AuthLayout>
      <Card>
        {status === 'loading' && (
          <h1 className="text-2xl font-bold text-ink">
            リンクを確認しています…
          </h1>
        )}

        {status === 'unavailable' && (
          <>
            <h1 className="text-2xl font-bold text-ink">
              このリンクは開けません
            </h1>
            <Alert className="mt-4">{error}</Alert>
          </>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} noValidate>
            <h1 className="text-2xl font-bold text-ink">
              パスワードで保護されたリンク
            </h1>
            <p className="mt-2 text-sm text-muted">
              パスワードを入力すると開けます。
            </p>
            <div className="mt-4">
              <Badge>
                {share.expiresAt}（{timeZoneLabel(share.timeZone)}
                ）の終わりまで閲覧できます
              </Badge>
            </div>

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

            {error && <Alert className="mt-5">{error}</Alert>}

            <Button
              type="submit"
              className="mt-8 w-full"
              disabled={!password || submitting}
            >
              {submitting ? '確認中…' : '開く'}
            </Button>
          </form>
        )}
      </Card>
    </AuthLayout>
  );
};

export default PublicSharePage;
