// ページやカードの見出し＋説明文。見出しの大きさを変えたいときはここを直す
const PageTitle = ({ children, description, as: Tag = 'h1' }) => (
  <div>
    <Tag className="text-2xl font-bold tracking-tight text-ink">{children}</Tag>
    {description && <p className="mt-2 text-sm text-muted">{description}</p>}
  </div>
);

export default PageTitle;
