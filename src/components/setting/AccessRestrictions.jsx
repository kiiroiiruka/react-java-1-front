//アクセス制限設定ページ描画
import { useId } from 'react';
import { TIME_ZONES } from '@/constants/timeZones';
import FormField, { inputClass, labelClass } from './FormField';
import StepCard, { isFilled } from './StepCard';

// 最後のステップ。「完了」で onSubmit（SettingPages の保存処理）が呼ばれる
const AccessRestrictions = ({ values, onChange, onSubmit, submitting }) => {
  const timeZoneId = useId();
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
        label="有効期限（この日の終わりまで閲覧できます）"
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
          className={inputClass}
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
