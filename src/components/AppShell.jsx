// ログイン後の画面（ホーム・登録画面）の枠：上にヘッダー、下に本文
import AppHeader from './AppHeader';

const AppShell = ({ children }) => (
  <div className="min-h-screen">
    <AppHeader />
    <main className="mx-auto flex w-full max-w-2xl animate-fade-up flex-col gap-6 px-4 py-10">
      {children}
    </main>
  </div>
);

export default AppShell;
