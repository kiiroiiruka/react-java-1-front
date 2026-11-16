// 押すと text をクリップボードにコピーするボタン
import { useState } from 'react';
import Button from './ui/Button';

const CopyButton = ({ text }) => {
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
    <Button size="sm" onClick={handleClick}>
      {copied ? 'コピーしました' : 'コピー'}
    </Button>
  );
};

export default CopyButton;
