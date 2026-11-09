// 押すと text をクリップボードにコピーするボタン
import { useState } from 'react';

const CopyButton = ({ text, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      // 2秒たったら表示を元に戻す
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`shrink-0 rounded px-3 py-1 text-sm font-bold text-white ${className}`}
    >
      {copied ? 'コピーしました' : 'コピー'}
    </button>
  );
};

export default CopyButton;
