// ログイン前の画面（ログイン・新規登録・メール確認・公開ページ）の枠
// 画面の真ん中に、鍵のマークとカードを縦に並べる（開いたときに、ふわっと出てくる）
import LockMark from './ui/LockMark';

const AuthLayout = ({ children }) => (
  <div className="flex min-h-screen flex-col items-center px-4 py-16">
    <div className="animate-pop">
      <LockMark size={48} />
    </div>
    <div className="mt-8 w-full max-w-md animate-fade-up [animation-delay:80ms]">
      {children}
    </div>
  </div>
);

export default AuthLayout;
