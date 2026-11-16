import { useId } from 'react';

// 入力欄の見た目。<select> など FormField を使わない欄でも同じ見た目にできるよう出しておく
export const inputClass =
  'w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15';

export const labelClass = 'text-sm font-medium text-ink';

// ラベル付きの入力欄。multiline で textarea になる
const FormField = ({ label, multiline = false, ...inputProps }) => {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={4} className={inputClass} {...inputProps} />
      ) : (
        <input id={id} className={inputClass} {...inputProps} />
      )}
    </div>
  );
};

export default FormField;
