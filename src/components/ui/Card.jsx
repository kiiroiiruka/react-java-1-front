// 白いカード。as="form" でフォームとしても使える
const Card = ({ as: Tag = 'div', className = '', ...props }) => (
  <Tag
    className={`w-full rounded-2xl border border-line bg-surface p-6 shadow-[0_1px_3px_rgba(20,33,61,0.06)] sm:p-8 ${className}`}
    {...props}
  />
);

export default Card;
