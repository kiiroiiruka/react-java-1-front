//アクセス制限設定ページ描画
import { useId } from 'react';
import { TIME_ZONES } from '@/constants/timeZones';
import FormField from './FormField';
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
      <div className="flex flex-col gap-1">
        <label
          htmlFor={timeZoneId}
          className="text-sm font-medium text-gray-700"
        >
          有効期限の基準にする時刻
        </label>
        <select
          id={timeZoneId}
          name="timeZone"
          value={values.timeZone}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
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
