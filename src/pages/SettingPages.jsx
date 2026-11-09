// 新しいサイト（共有リンク）を登録する3ステップの画面（/new）
// 「完了」で保存したら、ホーム（/ の一覧）に戻る
import { useEffect, useState } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { createShare, listShares } from '@/api/shares';
import AppHeader from '@/components/AppHeader';
import { DEFAULT_TIME_ZONE } from '@/constants/timeZones';
import Stepper from '../components/Stepper';
import AccessRestrictions from '../components/setting/AccessRestrictions';
import InputWebLink from '../components/setting/InputWebLink';
import WhoToSendItTo from '../components/setting/WhoToSendItTo';

// 各ステップのURL。nextPath にはこの値だけを使う
const BASE_PATH = '/new';
const PATHS = {
  link: BASE_PATH,
  sendTo: `${BASE_PATH}/send-to`,
  access: `${BASE_PATH}/access`,
};

// <Routes> の中では、App.jsx の "/new/*" より後ろの部分だけで判定される
// そのため Route には "/new/send-to" ではなく "send-to"（"/new" は ""）のように書く
const toRoutePath = (path) => path.slice(BASE_PATH.length).replace(/^\//, '');

// 入力欄の初期値
const EMPTY_FORM = {
  link: { url: '', title: '' },
  sendTo: { name: '', email: '', message: '' },
  access: { password: '', expiresAt: '', timeZone: DEFAULT_TIME_ZONE },
};

const SettingPages = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // 全ステップの入力値をここでまとめて持つ（ページを戻っても消えない）
  const [form, setForm] = useState(EMPTY_FORM);
  const updateSection = (key) => (values) =>
    setForm((prev) => ({ ...prev, [key]: values }));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // すでに登録したサイトがあるときだけ「一覧に戻る」を出す
  // （0件のときは一覧ページがないので、戻る先がない）
  const [hasShares, setHasShares] = useState(false);
  useEffect(() => {
    listShares()
      .then((shares) => setHasShares(shares.length > 0))
      .catch(() => {});
  }, []);

  // 「完了」ボタン：3ステップ分の入力をまとめて POST /api/shares に送る
  // JWTは client.js が自動でつけるので、サーバーは「誰が作ったか」が分かる
  const handleComplete = async () => {
    setSubmitting(true);
    setError('');
    try {
      const share = await createShare({
        url: form.link.url.trim(),
        title: form.link.title.trim(),
        recipientName: form.sendTo.name.trim(),
        recipientEmail: form.sendTo.email.trim(),
        message: form.sendTo.message,
        password: form.access.password,
        expiresAt: form.access.expiresAt, // "2026-12-31" の形
        timeZone: form.access.timeZone, // "Asia/Tokyo" など
      });
      // 一覧に戻り、今作ったリンクを知らせる（HomePage が state.created を読む）
      navigate('/', { state: { created: share } });
    } catch (err) {
      setError(
        err.status === 400
          ? '入力内容を確認してください（URLは http:// か https:// で始まるもの、パスワードは4文字以上、有効期限は選んだ国の今日以降）。'
          : '保存に失敗しました。時間をおいてもう一度試してください。',
      );
      setSubmitting(false);
    }
  };

  const steps = [
    {
      label: 'リンク入力',
      path: PATHS.link,
      element: (
        <InputWebLink
          values={form.link}
          onChange={updateSection('link')}
          nextPath={PATHS.sendTo}
        />
      ),
    },
    {
      label: '送信先',
      path: PATHS.sendTo,
      element: (
        <WhoToSendItTo
          values={form.sendTo}
          onChange={updateSection('sendTo')}
          nextPath={PATHS.access}
        />
      ),
    },
    {
      label: 'アクセス制限',
      path: PATHS.access,
      element: (
        <AccessRestrictions
          values={form.access}
          onChange={updateSection('access')}
          onSubmit={handleComplete}
          submitting={submitting}
        />
      ),
    },
  ];

  // 今のURLから何番目のステップかを計算
  const currentStep = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-8 p-4 pt-12">
      <AppHeader />
      {hasShares && (
        <Link
          to="/"
          className="self-start text-sm font-bold text-blue-600 hover:underline"
        >
          ← 一覧に戻る
        </Link>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}
      <Stepper steps={steps} current={currentStep} />
      <Routes>
        {steps.map((step) => (
          <Route
            key={step.path}
            path={toRoutePath(step.path)}
            element={step.element}
          />
        ))}
        <Route path="*" element={<Navigate to={PATHS.link} replace />} />
      </Routes>
    </div>
  );
};

export default SettingPages;
