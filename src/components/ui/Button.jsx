// アプリ共通のボタン
// <Link> にも同じ見た目を使えるように、クラス名を返す buttonClass も出しておく
//   例：<Link to="/new" className={buttonClass('primary')}>追加</Link>

const BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-50';

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink-hover',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  danger: 'border border-danger/30 bg-surface text-danger hover:bg-danger-soft',
  // 文字だけのボタン（「ログインはこちら」など）
  link: 'text-sm text-accent underline-offset-4 hover:underline',
};

const SIZES = {
  md: 'px-5 py-2.5 text-sm',
  sm: 'px-3 py-1.5 text-sm',
};

export const buttonClass = (variant = 'primary', size = 'md') =>
  `${BASE} ${VARIANTS[variant]} ${variant === 'link' ? '' : SIZES[size]}`;

const Button = ({
  variant,
  size,
  type = 'button',
  className = '',
  ...props
}) => (
  <button
    type={type}
    className={`${buttonClass(variant, size)} ${className}`}
    {...props}
  />
);

export default Button;
