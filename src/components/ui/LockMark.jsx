// アプリの目印（鍵のマーク）。「安全に共有する」アプリであることを表す
const LockMark = ({ size = 40 }) => (
  <span
    className="inline-flex shrink-0 items-center justify-center rounded-xl bg-ink text-white"
    style={{ width: size, height: size }}
  >
    <svg
      aria-hidden="true"
      width={size * 0.5}
      height={size * 0.5}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  </span>
);

export default LockMark;
