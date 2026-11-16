import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Card from '../ui/Card';

// 入力値がすべて埋まっているか（空白だけもNG）
export const isFilled = (values) =>
  Object.values(values).every((value) => value.trim() !== '');

// 各ステップ共通のカードUI。canNext が true のときだけ nextPath へ進める
// onSubmit を渡したとき（最後のステップ）は、ページ移動の代わりに onSubmit を呼ぶ
const StepCard = ({
  title,
  description,
  canNext,
  nextPath,
  nextLabel = '次へ',
  onSubmit,
  submitting = false,
  children,
}) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canNext || submitting) return;
    if (onSubmit) onSubmit();
    else navigate(nextPath);
  };

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}

      <div className="mt-6 flex flex-col gap-5">{children}</div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" disabled={!canNext || submitting}>
          {submitting ? '保存中…' : nextLabel}
        </Button>
      </div>
    </Card>
  );
};

export default StepCard;
