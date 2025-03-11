import { useEffect, useState } from 'react';
import { useTabs } from '@/context/tabs-context';
import axios from 'axios';
import { API_URL } from '@/lib/credentials';
import { ScrollArea } from '@/components/ui/scroll-area';
import ProblemComponent from '../ProblemLayout';
import { useParams } from 'react-router-dom';
import { useStrictMode } from '@/context/StrictModeContext';

export type problemSet = {
  title: string;
  difficulty: "E" | "M" | "H";
  topicTags: string[];
  time_limit: string;
  memory_limit: string;
  description: string;
  hints: string[];
  related_problems: {
    title: string;
    a: string;
  }[];
  acceptanceRate: number;
  likes: number;
  dislikes: number;
  solution?: string;
}

export default function Description() {
  const { slug } = useParams();
  console.log(slug, "slug");

  const { id } = useParams<{id: string}>();
  console.log(id);

  const [problem, setProblem] = useState<problemSet | null>(null);
  const { strictMode } = useStrictMode();

  useEffect(() => {
    const fetchProblemBySlug = async (slug: string) => {
      try {
        const response = await axios.get(`${API_URL}/problem/?slug=${slug}`);
        setProblem(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!id && slug) {
      fetchProblemBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    const fetchProblemById = async (id: string) => {
      try {
        const response = await axios.post(`${API_URL}/interview/question/`, { id });
        setProblem(response.data);
        localStorage.setItem('problemId',response.data.id);
      } catch (error) {
        console.error(error);
      }
    }

    if(!slug && id) {
      fetchProblemById(id);
    }
    console.log(id);
  }, [id]);

  useEffect(() => {
    console.log("Strict Mode:", strictMode);
  }, [strictMode]);

  return (
    <ScrollArea className="h-full w-full">
      {problem && (
        <ProblemComponent
          title={problem.title}
          difficulty={problem.difficulty}
          topicTags={problem.topicTags}
          time_limit={problem.time_limit}
          memory_limit={problem.memory_limit}
          description={problem.description}
          hints={problem.hints}
          related_problems={problem.related_problems}
          initialLikes={problem.likes}
          initialDislikes={problem.dislikes}
          strictMode={strictMode}
        />
      )}
    </ScrollArea>
  );
}
