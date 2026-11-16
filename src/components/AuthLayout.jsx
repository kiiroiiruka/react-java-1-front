// ログイン前の画面（ログイン・新規登録・メール確認・公開ページ）の枠
// 画面の真ん中に、鍵のマークとカードを縦に並べる
import LockMark from './ui/LockMark';

const AuthLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center px-4 py-16">
    <LockMark size={48} />
    <div className="mt-8 w-full max-w-md">{children}</div>
  </div>
);

export default AuthLayout;
