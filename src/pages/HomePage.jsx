// ログイン後のホーム（/）。自分が登録したWebサイト（共有リンク）を上から順に並べる
// 1件も登録していなければ、一覧は出さずに登録画面（/new）へそのまま移動する
import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { deleteShare, listShares, shareUrlOf } from '@/api/shares';
import AppHeader from '@/components/AppHeader';
import CopyButton from '@/components/CopyButton';
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
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-6 p-4 pt-12">
      <AppHeader />

      {/* 追加ボタンは、1件以上あると分かってから出す（0件ならこのあと登録画面へ移動するため） */}
      {shares?.length > 0 && (
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold">登録したサイト</h1>
          <Link
            to="/new"
            className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            ＋ 新しいサイトを追加
          </Link>
        </div>
      )}

      {created && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          <p>
            「{created.title}」を登録しました。下のURLを相手に送ってください。
          </p>
          {!created.embeddable && (
            <p className="mt-1">
              ※このサイトは埋め込み表示が禁止されているため、相手はパスワード入力後にサイトへ移動します（期限が過ぎても、サイトのURLを知っていれば開けます）。
            </p>
          )}
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {shares === null && !error && (
        <p className="text-sm text-gray-500">読み込み中…</p>
      )}

      {shares && (
        <ul className="flex flex-col gap-4">
          {shares.map((share) => (
            <li
              key={share.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${
                created?.id === share.id
                  ? 'border-green-400'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-bold">{share.title}</h2>
                  <a
                    href={share.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block truncate text-sm text-blue-600 hover:underline"
                  >
                    {share.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(share)}
                  disabled={deletingId === share.id}
                  className="shrink-0 rounded-lg border border-red-200 px-3 py-1 text-sm font-bold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {deletingId === share.id ? '削除中…' : '削除'}
                </button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    share.expired
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {share.expired
                    ? '期限切れ'
                    : `${share.expiresAt}まで（${timeZoneLabel(share.timeZone)}）`}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                  {share.embeddable ? 'ページ内に表示' : 'サイトへ移動'}
                </span>
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                  宛先：{share.recipientName}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  readOnly
                  value={shareUrlOf(share.slug)}
                  onFocus={(e) => e.target.select()}
                  aria-label="共有URL"
                  className="min-w-0 flex-1 rounded border border-gray-200 bg-gray-50 p-1 text-sm text-gray-700"
                />
                <CopyButton
                  text={shareUrlOf(share.slug)}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
