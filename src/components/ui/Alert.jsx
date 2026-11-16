// お知らせの帯（成功：緑、エラー：赤）
const TONES = {
  success: 'border-accent/30 bg-accent-soft text-accent',
  error: 'border-danger/30 bg-danger-soft text-danger',
};

const Alert = ({ tone = 'error', className = '', children }) => (
  <div
    role={tone === 'error' ? 'alert' : 'status'}
    className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${TONES[tone]} ${className}`}
  >
    {children}
  </div>
);

export default Alert;
