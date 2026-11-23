// 「残り 2日 5時間」のように、閲覧できなくなるまでの残り時間を1秒ごとに数え直して表示する
//   variant="badge"    … 一覧のカードなどに並べる小さなラベル
//   variant="floating" … 画面の右下に浮かべる表示（公開ページの埋め込み表示中）
// 期限の瞬間（closesAt）はサーバーが計算したものを使う（どの国の「12/31の終わり」かはサーバーが知っている）
import { useEffect, useState } from 'react';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const formatRemaining = (ms) => {
  if (ms <= 0) return '期限切れ';
  const d = Math.floor(ms / DAY);
  const h = Math.floor((ms % DAY) / HOUR);
  const m = Math.floor((ms % HOUR) / MINUTE);
  const s = Math.floor((ms % MINUTE) / SECOND);
  if (d > 0) return `残り ${d}日 ${h}時間`;
  if (h > 0) return `残り ${h}時間 ${m}分`;
  return `残り ${m}分 ${s}秒`;
};

// 残りが少ないほど目立つ色にする（24時間を切ったら注意、1時間を切ったら警告）
const toneOf = (ms) => {
  if (ms <= HOUR) return 'danger';
  if (ms <= DAY) return 'warn';
  return 'normal';
};

const BADGE_TONES = {
  normal: 'bg-canvas text-muted',
  warn: 'bg-warn-soft text-warn',
  danger: 'bg-danger-soft text-danger',
};

const FLOATING_TONES = {
  normal: 'bg-ink text-white',
  warn: 'bg-warn text-white',
  danger: 'bg-danger text-white',
};

const ClockIcon = () => (
  <svg
    aria-hidden="true"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

const RemainingTime = ({ closesAt, variant = 'badge', onExpire }) => {
  const closesAtMs = new Date(closesAt).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), SECOND);
    return () => clearInterval(timer);
  }, []);

  const remaining = closesAtMs - now;
  // closesAt がない（期限なし）ときは、期限切れ扱いにしない
  const expired = Boolean(closesAt) && remaining <= 0;

  // 期限の瞬間を過ぎたら、親（公開ページなど）に知らせる
  useEffect(() => {
    if (expired) onExpire?.();
  }, [expired, onExpire]);

  if (!closesAt) return null;
  const tone = toneOf(remaining);

  if (variant === 'floating') {
    return (
      <div
        role="status"
        className={`fixed right-4 bottom-4 z-10 flex animate-fade-up items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold shadow-lg transition-colors duration-500 ${FLOATING_TONES[tone]}`}
      >
        {/* 1時間を切ったら、点を点滅させて急ぎであることを伝える */}
        {tone === 'danger' ? (
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
            <span className="relative inline-flex size-2.5 rounded-full bg-white" />
          </span>
        ) : (
          <ClockIcon />
        )}
        <span className="tabular-nums">{formatRemaining(remaining)}</span>
        <span className="font-normal opacity-80">で閲覧できなくなります</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums transition-colors duration-500 ${BADGE_TONES[tone]}`}
    >
      <ClockIcon />
      {formatRemaining(remaining)}
    </span>
  );
};

export default RemainingTime;
