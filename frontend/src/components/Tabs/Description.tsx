import { ScrollArea } from '@/components/ui/scroll-area';
import ProblemComponent from '../ProblemLayout';
import { useEffect, useState } from 'react';
type problemSet = {
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  labels: string[];
  timeLimit: string;
  memoryLimit: string;
  description: string;
  hints: string[];
  relatedProblems: {
    title: string;
    a: string;
  }[];
  acceptanceRate: number;
  initialLikes: number;
  initialDislikes: number;
}

export default function Description() {
  // const { state, dispatch } = useEditorMode();
  const [problem, setProblem] = useState<problemSet | null>(null);

  const [strictMode, setStrictMode] = useState(false);

  useEffect(() => {
    const isStrictMode = localStorage.getItem("strictMode") === "true";
    setStrictMode(isStrictMode);
  }, [strictMode]);

  useEffect(() => {
    const problemset = {
      "title": "Find the Prefix Common Array of Two Arrays",
      "difficulty": "Easy" as const,
      "labels": ["Array", "Hash Table", "Bit Manipulation"],
      "timeLimit": "1s",
      "memoryLimit": "256MB",
      "description": `You are given two strings \`s1\` and \`s2\` of equal length. A **string swap** is an operation where you choose two indices in a string (not necessarily different) and swap the characters at these indices.\n\nReturn \`true\` if it is possible to make both strings equal by performing **at most one string swap** on exactly **one** of the strings. Otherwise, return \`false\`.\n\n---\n\n### Example 1:\n\n **Input:**\n\n \`s1 = "bank", s2 = "kanb"\`\n\n **Output:**\n\n \`true\`\n\n **Explanation:**\n\n For example, swap the first character with the last character of \`s2\` to make \`"bank"\`.\n\n---\n\n### Example 2:\n\n **Input:**\n\n \`s1 = "attack", s2 = "defend"\`\n\n **Output:**\n\n \`false\`\n\n**Explanation:**\n\n It is impossible to make them equal with one string swap.\n\n---\n\n### Example 3:\n\n **Input:**\n\n \`s1 = "kelb", s2 = "kelb"\`\n\n **Output:**\n\n \`true\` \n\n**Explanation:**\n\n The two strings are already equal, so no string swap operation is required.\n\n---\n\n## Constraints:\n\n- \`1 <= s1.length, s2.length <= 100\`\n\n- \`s1.length == s2.length\`\n\n- \`s1\` and \`s2\` consist of only lowercase English letters.`,
      "hints": [
        `\`\`\`python
        from collections import Counter
        def areAlmostEqual(s1: str, s2: str) -> bool:
            return s1 == s2 or Counter(s1) == Counter(s2)
        \`\`\``,
        "If a number occurred two times, it means it occurred in both A and B since they’re both permutations so add one to the answer."
      ],
      "relatedProblems": [
        { "title": "Three Sum", "a": "/problems/three-sum" },
        { "title": "Four Sum", "a": "/problems/four-sum" }
      ],
      "acceptanceRate": 47.5,
      "initialLikes": 1245,
      "initialDislikes": 45,
    }

    Promise.resolve().then(() => { });

    setProblem(problemset);
  }, [])

  return (
    <ScrollArea className="h-full w-full">
      {problem && (
        <ProblemComponent
          title={problem.title}
          difficulty={problem.difficulty}
          labels={problem.labels}
          timeLimit={problem.timeLimit}
          memoryLimit={problem.memoryLimit}
          description={problem.description}
          hints={problem.hints}
          relatedProblems={problem.relatedProblems}
          acceptanceRate={problem.acceptanceRate}
          initialLikes={problem.initialLikes}
          initialDislikes={problem.initialDislikes}
          strictMode={strictMode}
        />
      )}
    </ScrollArea>
  );
}
