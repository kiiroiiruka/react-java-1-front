//アクセス制限設定ページ描画
import FormField from './FormField';
import StepCard, { isFilled } from './StepCard';

// 最後のステップ。「完了」で onSubmit（SettingPages の保存処理）が呼ばれる
const AccessRestrictions = ({ values, onChange, onSubmit, submitting }) => {
  const handleChange = (e) =>
    onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <StepCard
      title="アクセス制限"
      description="リンクを開くためのパスワードと有効期限を設定してください。"
      canNext={isFilled(values)}
      nextLabel="完了"
      onSubmit={onSubmit}
      submitting={submitting}
    >
      <FormField
        label="パスワード"
        type="password"
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
      />
      <FormField
        label="有効期限"
        type="date"
        name="expiresAt"
        value={values.expiresAt}
        onChange={handleChange}
      />
    </StepCard>
  );
};

export default AccessRestrictions;
