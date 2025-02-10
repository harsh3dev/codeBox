import ModeToggle from "@/components/ModeToggle";
import { Problem, ProblemTable } from "./ProblemTable";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProblemLists() {
    const [problems, setProblems] = useState<Problem[]>([]);
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/list/');
                console.log(response.data);
                setProblems(response.data);
            } catch (error) {
                console.error(error);                
            }
        }
        fetchProblems();
    }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-accent/20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
                Problem Lists
            </h1>
          <ModeToggle />
        </div>
        <ProblemTable problems={problems} />
      </div>
    </div>
  )
}
