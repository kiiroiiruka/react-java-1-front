//誰にメール付きで連絡を送るかページ描画
import FormField from './FormField';
import StepCard, { isFilled } from './StepCard';

const WhoToSendItTo = ({ values, onChange, nextPath }) => {
  const handleChange = (e) =>
    onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <StepCard
      title="送信先を設定"
      description="リンクをメールで送る相手を入力してください。"
      canNext={isFilled(values)}
      nextPath={nextPath}
    >
      <FormField
        label="宛先の名前"
        type="text"
        name="name"
        placeholder="例：山田 太郎"
        value={values.name}
        onChange={handleChange}
      />
      <FormField
        label="メールアドレス"
        type="email"
        name="email"
        placeholder="example@mail.com"
        value={values.email}
        onChange={handleChange}
      />
      <FormField
        label="メッセージ"
        multiline
        name="message"
        placeholder="一緒に送るメッセージ"
        value={values.message}
        onChange={handleChange}
      />
    </StepCard>
  );
};

export default WhoToSendItTo;
