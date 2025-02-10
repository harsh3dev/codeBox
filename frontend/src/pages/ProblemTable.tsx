import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/credentials';

export type Difficulty = 'E' | 'M' | 'H';

export interface Problem {
    id: string;
    serialNumber: number;
    title: string;
    difficulty: Difficulty;
    slug: string;
  }
  
  export interface ProblemTableProps {
    problems: Problem[];
    isLoading?: boolean;
  }
  
  export interface DifficultyBadgeProps {
    difficulty: Difficulty;
  }
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function ProblemTable({ problems, isLoading }: ProblemTableProps) {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleNavigation = ({pid}: {pid: string}) => {
        setLoading(true);
        const createInterview = async () => {
            try {
                const response = await axios.post(`${API_URL}/code/start/`, {
                    id: 1,
                    question_id: pid
                })
                console.log(response.data);
                
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
                navigate(`/interview/${response.data.interview_id}`);
            } catch (error) {
                console.error(error);
            }
        }
        createInterview();
    }


  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border bg-background/30 backdrop-blur-2xl backdrop-saturate-200 transition-all shadow-lg"
    >
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-accent/5">
            <TableHead className="w-24 text-primary/80">No.</TableHead>
            <TableHead className="text-primary/80">Title</TableHead>
            <TableHead className="w-32 text-primary/80">Difficulty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem) => (
            <motion.tr
              key={problem.id}
              variants={item}
              initial="hidden"
              animate="show"
              className="group cursor-pointer transition-all duration-300 hover:bg-accent/10"
            >
              <TableCell className="font-mono text-muted-foreground group-hover:text-primary">
                {problem.id}
              </TableCell>
              <TableCell className="font-medium text-foreground/80 group-hover:text-primary">
                {problem.title}
              </TableCell>
              <TableCell className='flex items-center justify-start mt-2'>
                <DifficultyBadge difficulty={problem.difficulty} />
              </TableCell>
              <TableCell>
                <Button onClick={()=>handleNavigation({ pid: problem.id })} variant={'ghost'} className="text-primary">
                    {loading ? 'Loading...' : 'Practice Interview'}
                </Button>
              </TableCell>
              <TableCell>
                <a href={`/code/${problem.id}`} target="_blank" rel="noreferrer">
                    <Button variant={'ghost'} className="text-primary">
                        Solve
                    </Button>
                </a>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative overflow-hidden rounded-xl border bg-background/30 backdrop-blur-2xl backdrop-saturate-200 transition-all shadow-lg"
    >
      <div className="p-4 space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center space-x-4"
          >
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-24" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
