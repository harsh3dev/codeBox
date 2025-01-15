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

export default function Discussion() {
  // const { state, dispatch } = useEditorMode();
  const [problem, setProblem] = useState<problemSet | null>(null);

  useEffect(() => {
    const problemset = {
      "title": "Find the Prefix Common Array of Two Arrays",
      "difficulty": "Easy" as const,
      "labels": ["Array", "Hash Table", "Bit Manipulation"],
      "timeLimit": "1s",
      "memoryLimit": "256MB",
      "description": `You are given two 0-indexed integer permutations \`A\` and \`B\` of length \`n\`.

A **prefix common array** of \`A\` and \`B\` is an array \`C\` such that \`C[i]\` is equal to the count of numbers that are present at or before the index \`i\` in both \`A\` and \`B\`.

Return the prefix common array of \`A\` and \`B\`.

A sequence of \`n\` integers is called a **permutation** if it contains all integers from \`1\` to \`n\` exactly once.

---

### Example 1:

**Input:**  
\`A = [1,3,2,4]\`  
\`B = [3,1,2,4]\`  

**Output:**  
\`[0,2,3,4]\`  

**Explanation:**  
- At \`i = 0\`: No number is common, so \`C[0] = 0\`.  
- At \`i = 1\`: \`1\` and \`3\` are common in \`A\` and \`B\`, so \`C[1] = 2\`.  
- At \`i = 2\`: \`1\`, \`2\`, and \`3\` are common in \`A\` and \`B\`, so \`C[2] = 3\`.  
- At \`i = 3\`: \`1\`, \`2\`, \`3\`, and \`4\` are common in \`A\` and \`B\`, so \`C[3] = 4\`.

---

### Example 2:

**Input:**  
\`A = [2,3,1]\`  
\`B = [3,1,2]\`  

**Output:**  
\`[0,1,3]\`  

**Explanation:**  
- At \`i = 0\`: No number is common, so \`C[0] = 0\`.  
- At \`i = 1\`: Only \`3\` is common in \`A\` and \`B\`, so \`C[1] = 1\`.  
- At \`i = 2\`: \`1\`, \`2\`, and \`3\` are common in \`A\` and \`B\`, so \`C[2] = 3\`.

---

### Constraints:

- \`1 <= A.length == B.length == n <= 50\`  
- \`1 <= A[i], B[i] <= n\`  
- It is guaranteed that \`A\` and \`B\` are both permutations of \`n\` integers.
`,
      "hints": [
        "Consider keeping a frequency array that stores the count of occurrences of each number till index i.",
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
        />
      )}
    </ScrollArea>
  );
}
