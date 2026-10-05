import { useNavigate } from 'react-router-dom';

// 入力値がすべて埋まっているか（空白だけもNG）
export const isFilled = (values) =>
  Object.values(values).every((value) => value.trim() !== '');

// 各ステップ共通のカードUI。canNext が true のときだけ nextPath へ進める
const StepCard = ({
  title,
  description,
  canNext,
  nextPath,
  nextLabel = '次へ',
  children,
}) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canNext) navigate(nextPath);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      )}

      <div className="mt-6 flex flex-col gap-4">{children}</div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={!canNext}
          className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {nextLabel}
        </button>
      </div>
    </form>
  );
};

export default StepCard;
