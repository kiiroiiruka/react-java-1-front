//Webリンクを入力するページ描画
import FormField from './FormField';
import StepCard, { isFilled } from './StepCard';

const InputWebLink = ({ values, onChange, nextPath }) => {
  const handleChange = (e) =>
    onChange({ ...values, [e.target.name]: e.target.value });

  return (
    <StepCard
      title="Webリンクを入力"
      description="共有したいページのURLとタイトルを入力してください。"
      canNext={isFilled(values)}
      nextPath={nextPath}
    >
      <FormField
        label="URL"
        type="url"
        name="url"
        placeholder="https://example.com"
        value={values.url}
        onChange={handleChange}
      />
      <FormField
        label="タイトル"
        type="text"
        name="title"
        placeholder="例：プロジェクト資料"
        value={values.title}
        onChange={handleChange}
      />
    </StepCard>
  );
};

export default InputWebLink;
