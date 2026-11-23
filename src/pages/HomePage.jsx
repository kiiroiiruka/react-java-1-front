// ログイン後のホーム（/）。自分が登録したWebサイト（共有リンク）を上から順に並べる
// 1件も登録していなければ、一覧は出さずに登録画面（/new）へそのまま移動する
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { deleteShare, listShares, shareUrlOf } from '@/api/shares';
import AppShell from '@/components/AppShell';
import CopyButton from '@/components/CopyButton';
import RemainingTime from '@/components/RemainingTime';
import Alert from '@/components/ui/Alert';
import Badge from '@/components/ui/Badge';
import Button, { buttonClass } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageTitle from '@/components/ui/PageTitle';
import Skeleton from '@/components/ui/Skeleton';
import { timeZoneLabel } from '@/constants/timeZones';

const HomePage = () => {
  // 登録画面で「完了」したときに渡される、今作ったリンク（なければ null）
  const created = useLocation().state?.created ?? null;
  const [shares, setShares] = useState(null); // null の間は読み込み中
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    listShares()
      .then(setShares)
      .catch(() =>
        setError(
          '一覧を取得できませんでした。時間をおいてもう一度お試しください。',
        ),
      );
  }, []);

  const handleDelete = async (share) => {
    if (
      !window.confirm(
        `「${share.title}」を削除しますか？\n削除すると、共有URLも開けなくなります。`,
      )
    ) {
      return;
    }
    setDeletingId(share.id);
    setError('');
    try {
      await deleteShare(share.id);
      // サーバーで消えたので、画面の一覧からも外す（最後の1件なら、下の Navigate で登録画面へ）
      setShares((prev) => prev.filter((s) => s.id !== share.id));
    } catch {
      setError('削除できませんでした。時間をおいてもう一度お試しください。');
    } finally {
      setDeletingId(null);
    }
  };

  // 1件もなければ、いきなり登録画面へ
  if (shares?.length === 0) return <Navigate to="/new" replace />;

  return (
    <AppShell>
      {/* 追加ボタンは、1件以上あると分かってから出す（0件ならこのあと登録画面へ移動するため） */}
      {shares?.length > 0 && (
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageTitle description={`${shares.length}件`}>
            登録したサイト
          </PageTitle>
          <Link to="/new" className={buttonClass('primary')}>
            ＋ 新しいサイトを追加
          </Link>
        </div>
      )}

      {created && (
        <Alert tone="success">
          <p>
            「{created.title}」を登録しました。下のURLを相手に送ってください。
          </p>
          {!created.embeddable && (
            <p className="mt-1">
              ※このサイトは埋め込み表示が禁止されているため、相手はパスワード入力後にサイトへ移動します（期限が過ぎても、サイトのURLを知っていれば開けます）。
            </p>
          )}
        </Alert>
      )}

      {error && <Alert>{error}</Alert>}

      {/* 読み込み中は、カードの形をした「仮の箱」を出しておく（中身が来たら差し替わる） */}
      {shares === null && !error && (
        <div
          role="status"
          aria-label="読み込み中"
          className="flex flex-col gap-4"
        >
          <Skeleton className="h-8 w-48" />
          {[0, 1].map((i) => (
            <Card key={i} padding="sm">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <div className="mt-4 flex gap-2">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-9 w-full" />
            </Card>
          ))}
        </div>
      )}

      {shares && (
        <ul className="flex flex-col gap-4">
          {shares.map((share, index) => (
            // 上から順番に、少しずつ遅れてふわっと出てくる
            <li
              key={share.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <Card
                padding="sm"
                className={`transition-shadow duration-200 hover:shadow-md ${created?.id === share.id ? 'border-accent ring-4 ring-accent/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-bold text-ink">
                      {share.title}
                    </h2>
                    <a
                      href={share.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 block truncate text-sm text-muted hover:text-accent hover:underline"
                    >
                      {share.url}
                    </a>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(share)}
                    loading={deletingId === share.id}
                  >
                    {deletingId === share.id ? '削除中…' : '削除'}
                  </Button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone={share.expired ? 'danger' : 'neutral'}>
                    {share.expired
                      ? '期限切れ'
                      : share.expiresAt
                        ? `${share.expiresAt}まで（${timeZoneLabel(share.timeZone)}）`
                        : '期限なし'}
                  </Badge>
                  <Badge>
                    {share.passwordProtected ? 'パスワードあり' : 'パスワードなし'}
                  </Badge>
                  {!share.expired && share.closesAt && (
                    <RemainingTime closesAt={share.closesAt} />
                  )}
                  <Badge tone={share.embeddable ? 'accent' : 'neutral'}>
                    {share.embeddable ? 'ページ内に表示' : 'サイトへ移動'}
                  </Badge>
                </div>

                <div className="mt-4 flex gap-2 border-t border-line pt-4">
                  <input
                    readOnly
                    value={shareUrlOf(share.slug)}
                    onFocus={(e) => e.target.select()}
                    aria-label="共有URL"
                    className="min-w-0 flex-1 rounded-lg border border-line bg-canvas px-3 py-1.5 text-sm text-body focus:border-accent focus:outline-none"
                  />
                  <CopyButton text={shareUrlOf(share.slug)} />
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
};

export default HomePage;
