// 共有リンク（/s/:slug）を受け取った人が開くページ
// パスワードが合って、有効期限内なら、共有されたWebサイトを表示する
//   埋め込めるサイト：このページの中に iframe で表示し、期限が来たら消す
//   埋め込めないサイト：そのサイトへ移動する
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublicShare, openShare } from '@/api/publicShares';
import AuthLayout from '@/components/AuthLayout';
import RemainingTime from '@/components/RemainingTime';
import FormField from '@/components/setting/FormField';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LockMark from '@/components/ui/LockMark';
import PageTitle from '@/components/ui/PageTitle';
import Spinner from '@/components/ui/Spinner';
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

  // 期限の瞬間（closesAt）を過ぎたら iframe を消す
  // RemainingTime が1秒ごとに残り時間を数えていて、0になったらこれを呼ぶ
  // （ページを開きっぱなしでも見られなくなる）
  const handleExpire = useCallback(() => {
    setOpened(null);
    setError(ERROR_MESSAGES[410]);
    setStatus('unavailable');
  }, []);

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
      <div className="mx-auto flex h-screen w-full max-w-5xl animate-fade-up flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <LockMark size={32} />
            <h1 className="truncate text-lg font-bold text-ink">
              {opened.title}
            </h1>
          </div>
          <Badge>
            {share.expiresAt}（{timeZoneLabel(share.timeZone)}
            ）の終わりまで
          </Badge>
        </div>
        {/* sandbox：埋め込んだサイトに許すことを絞る（このページ自体を別のURLに書き換える、などはさせない） */}
        <iframe
          src={opened.embedUrl}
          title={opened.title}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full flex-1 rounded-2xl border border-line bg-white shadow-sm"
        />
        {/* 画面の右下に「残り○時間で閲覧できなくなります」を浮かべる */}
        <RemainingTime
          closesAt={opened.closesAt}
          variant="floating"
          onExpire={handleExpire}
        />
      </div>
    );
  }

  return (
    <AuthLayout>
      <Card>
        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-6 text-ink">
            <Spinner size={28} />
            <p className="text-sm text-muted">リンクを確認しています…</p>
          </div>
        )}

        {status === 'unavailable' && (
          <>
            <PageTitle>このリンクは開けません</PageTitle>
            <Alert className="mt-4">{error}</Alert>
          </>
        )}

        {status === 'ready' && (
          <form onSubmit={handleSubmit} noValidate>
            <PageTitle description="パスワードを入力すると開けます。">
              パスワードで保護されたリンク
            </PageTitle>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>
                {share.expiresAt}（{timeZoneLabel(share.timeZone)}
                ）の終わりまで
              </Badge>
              {share.closesAt && <RemainingTime closesAt={share.closesAt} />}
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
              disabled={!password}
              loading={submitting}
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
