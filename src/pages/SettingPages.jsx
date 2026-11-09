import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { fetchMe } from '@/api/auth';
import { createShare } from '@/api/shares';
import { useAuth } from '@/auth/AuthContext';
import Stepper from '../components/Stepper';
import AccessRestrictions from '../components/setting/AccessRestrictions';
import InputWebLink from '../components/setting/InputWebLink';
import WhoToSendItTo from '../components/setting/WhoToSendItTo';

// 各ステップのURL。nextPath にはこの値だけを使う
const PATHS = {
  link: '/',
  sendTo: '/send-to',
  access: '/access',
};

// 入力欄の初期値（保存に成功したらこれに戻す）
const EMPTY_FORM = {
  link: { url: '', title: '' },
  sendTo: { name: '', email: '', message: '' },
  access: { password: '', expiresAt: '' },
};

const SettingPages = () => {
  const { pathname } = useLocation();
  const auth = useAuth();
  // サーバーから受け取った「ログイン中のユーザー」（GET /api/me）
  const [me, setMe] = useState(null);
  useEffect(() => {
    // 保存しているJWTがまだ有効かをサーバーに確かめる
    // 期限切れなら 401 になり、client.js がログイン画面へ移動させる
    fetchMe()
      .then(setMe)
      .catch(() => {});
  }, []);
  // 全ステップの入力値をここでまとめて持つ（ページを戻っても消えない）
  const [form, setForm] = useState(EMPTY_FORM);
  const updateSection = (key) => (values) =>
    setForm((prev) => ({ ...prev, [key]: values }));

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState(null); // { type: 'success' | 'error', text }

  // 「完了」ボタン：3ステップ分の入力をまとめて POST /api/shares に送る
  // JWTは client.js が自動でつけるので、サーバーは「誰が作ったか」が分かる
  const handleComplete = async () => {
    setSubmitting(true);
    setNotice(null);
    try {
      const share = await createShare({
        url: form.link.url.trim(),
        title: form.link.title.trim(),
        recipientName: form.sendTo.name.trim(),
        recipientEmail: form.sendTo.email.trim(),
        message: form.sendTo.message,
        password: form.access.password,
        expiresAt: form.access.expiresAt, // "2026-12-31" の形
      });
      setNotice({
        type: 'success',
        text: `「${share.title}」を保存しました（有効期限：${share.expiresAt}）`,
      });
      setForm(EMPTY_FORM);
      navigate(PATHS.link);
    } catch (err) {
      setNotice({
        type: 'error',
        text:
          err.status === 400
            ? '入力内容を確認してください（URLは http:// か https:// で始まるもの、パスワードは4文字以上、有効期限は今日以降）。'
            : '保存に失敗しました。時間をおいてもう一度試してください。',
      });
    } finally {
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
      <div className="flex items-center justify-end gap-3 text-sm">
        <span className="truncate text-gray-500">
          {me?.email ?? auth.email}
        </span>
        <button
          type="button"
          onClick={auth.logout}
          className="shrink-0 font-bold text-blue-600 hover:underline"
        >
          ログアウト
        </button>
      </div>
      {notice && (
        <p
          className={`rounded-lg p-3 text-sm ${
            notice.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          {notice.text}
        </p>
      )}
      <Stepper steps={steps} current={currentStep} />
      <Routes>
        {steps.map((step) => (
          <Route key={step.path} path={step.path} element={step.element} />
        ))}
        <Route path="*" element={<Navigate to={PATHS.link} replace />} />
      </Routes>
    </div>
  );
};

export default SettingPages;
