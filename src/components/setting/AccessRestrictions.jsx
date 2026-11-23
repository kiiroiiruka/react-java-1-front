//アクセス制限設定ページ描画
import { useId } from 'react';
import { TIME_ZONES } from '@/constants/timeZones';
import FormField, { inputClass, labelClass } from './FormField';
import StepCard from './StepCard';

// 最後のステップ。「完了」で onSubmit（SettingPages の保存処理）が呼ばれる
const AccessRestrictions = ({ values, onChange, onSubmit, submitting }) => {
  const timeZoneId = useId();
  const handleChange = (e) =>
    onChange({ ...values, [e.target.name]: e.target.value });

  // パスワードと有効期限は、どちらか片方だけでもOK（両方空のときだけ「完了」を押せない）
  const hasPassword = values.password.trim() !== '';
  const hasExpiry = values.expiresAt !== '';

  return (
    <StepCard
      title="アクセス制限"
      description="パスワードと有効期限のどちらか（または両方）を設定してください。空欄にした方は制限なしになります。"
      canNext={hasPassword || hasExpiry}
      nextLabel="完了"
      onSubmit={onSubmit}
      submitting={submitting}
    >
      <FormField
        label="パスワード（任意・4文字以上）"
        type="password"
        name="password"
        autoComplete="new-password"
        value={values.password}
        onChange={handleChange}
      />
      <FormField
        label="有効期限（任意・この日の終わりまで閲覧できます）"
        type="date"
        name="expiresAt"
        value={values.expiresAt}
        onChange={handleChange}
      />
      {/* 同じ「12/31まで」でも、どの国の12/31かで終わる瞬間が変わる */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor={timeZoneId} className={labelClass}>
          有効期限の基準にする時刻
        </label>
        <select
          id={timeZoneId}
          name="timeZone"
          value={values.timeZone}
          onChange={handleChange}
          // 期限を設定しないなら、基準の時刻も関係ないので選べなくする
          disabled={!hasExpiry}
          className={`${inputClass} disabled:opacity-50`}
        >
          {TIME_ZONES.map((zone) => (
            <option key={zone.value} value={zone.value}>
              {zone.label}
            </option>
          ))}
        </select>
      </div>
    </StepCard>
  );
};

export default AccessRestrictions;
