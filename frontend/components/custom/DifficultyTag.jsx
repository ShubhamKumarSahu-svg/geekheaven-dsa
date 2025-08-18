export const DifficultyTag = ({ difficulty }) => {
  const styleMap = {
    Easy: 'bg-green-900/50 text-green-300 border-green-700',
    Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    Hard: 'bg-red-900/50 text-red-300 border-red-700',
  };

  const tagStyle =
    styleMap[difficulty] ||
    'bg-secondary text-secondary-foreground border-border';

  return (
    <span
      className={`px-3 py-1 text-sm font-medium rounded-full border ${tagStyle}`}
    >
      {difficulty}
    </span>
  );
};
