// 白いカード。as="form" でフォームとしても使える
// 余白は padding で選ぶ（className で p-6 などを足すと、元の余白とぶつかって効かないことがあるため）
const PADDINGS = {
  md: 'p-6 sm:p-8',
  sm: 'p-5 sm:p-6',
};

const Card = ({
  as: Tag = 'div',
  padding = 'md',
  className = '',
  ...props
}) => (
  <Tag
    className={`w-full rounded-2xl border border-line bg-surface shadow-[0_1px_3px_rgba(20,33,61,0.06)] ${PADDINGS[padding]} ${className}`}
    {...props}
  />
);

export default Card;
