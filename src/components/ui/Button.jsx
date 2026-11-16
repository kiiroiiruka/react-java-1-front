// アプリ共通のボタン
// <Link> にも同じ見た目を使えるように、クラス名を返す buttonClass も出しておく
//   例：<Link to="/new" className={buttonClass('primary')}>追加</Link>
// loading を渡すと、くるくるを出して押せなくする
import Spinner from './Spinner';

const BASE =
  'inline-flex shrink-0 items-center justify-center gap-2 rounded-lg font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100';

const VARIANTS = {
  primary:
    'bg-ink text-white shadow-sm hover:-translate-y-px hover:bg-ink-hover hover:shadow-md',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  danger: 'border border-danger/30 bg-surface text-danger hover:bg-danger-soft',
  // 文字だけのボタン（「ログインはこちら」など）
  link: 'text-sm text-accent underline-offset-4 hover:underline active:scale-100',
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
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${buttonClass(variant, size)} ${className}`}
    {...props}
  >
    {loading && <Spinner />}
    {children}
  </button>
);

export default Button;
