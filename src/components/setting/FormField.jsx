import { useId } from 'react';

// ラベル付きの入力欄。multiline で textarea になる
const FormField = ({ label, multiline = false, ...inputProps }) => {
  const id = useId();
  const className =
    'w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100';

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={4} className={className} {...inputProps} />
      ) : (
        <input id={id} className={className} {...inputProps} />
      )}
    </div>
  );
};

export default FormField;
