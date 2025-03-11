import { cn } from '@/lib/utils';
import { Difficulty } from '@/pages/Problems/ProblemTable';
import { useEffect, useState } from 'react';



const difficultyColors: Record<Difficulty, { bg: string; text: string }> = {
  E: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  M: { bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  H: { bg: 'bg-red-500/15', text: 'text-red-400' },
};

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const colors = difficultyColors[difficulty];

  const [validDifficulty, setValidDifficulty] = useState("");

  useEffect(() => {
    switch (difficulty) {
        case "E":
          setValidDifficulty("Easy");
          break;
        case "M":
          setValidDifficulty("Medium");
          break;
        case "H":
          setValidDifficulty("Hard");
          break;
        default:
          setValidDifficulty("");
          break;
      }
  }, [difficulty]);
  
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-300',
        colors.bg,
        colors.text,
        'ring-1 ring-inset ring-current/20'
      )}
    >
      {validDifficulty}
    </span>
  );
}