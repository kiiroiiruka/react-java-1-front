// 小さなラベル（「期限切れ」「ページ内に表示」など）
const TONES = {
  neutral: 'bg-canvas text-muted',
  accent: 'bg-accent-soft text-accent',
  danger: 'bg-danger-soft text-danger',
};

const Badge = ({ tone = 'neutral', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}
  >
    {children}
  </span>
);

export default Badge;
