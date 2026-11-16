// 読み込み中に、中身の代わりに出しておく「仮の箱」。上を光が流れる
const Skeleton = ({ className = '' }) => (
  <div
    aria-hidden="true"
    className={`animate-shimmer rounded-md bg-[linear-gradient(90deg,var(--color-line)_25%,var(--color-canvas)_50%,var(--color-line)_75%)] bg-size-[200%_100%] ${className}`}
  />
);

export default Skeleton;
