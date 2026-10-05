import { useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Stepper from '../components/Stepper';
import AccessRestrictions from '../components/setting/AccessRestrictions';
import InputWebLink from '../components/setting/InputWebLink';
import WhoToSendItTo from '../components/setting/WhoToSendItTo';

// 各ステップのURL。nextPath にはここの値だけを使う
const PATHS = {
  link: '/',
  sendTo: '/send-to',
  access: '/access',
};

const SettingPages = () => {
  const { pathname } = useLocation();

  // 全ステップの入力値をここでまとめて持つ（ページを戻っても消えない）
  const [form, setForm] = useState({
    link: { url: '', title: '' },
    sendTo: { name: '', email: '', message: '' },
    access: { password: '', expiresAt: '' },
  });
  const updateSection = (key) => (values) =>
    setForm((prev) => ({ ...prev, [key]: values }));

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
          nextPath={PATHS.link}
        />
      ),
    },
  ];

  // 今のURLから何番目のステップかを計算
  const currentStep = steps.findIndex((step) => step.path === pathname);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-8 p-4 pt-12">
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
