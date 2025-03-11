import { Problem, ProblemTable } from "./ProblemTable";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/lib/credentials";  
import { MenuBar } from "@/components/menu-bar";

export default function ProblemLists() {
    const [problems, setProblems] = useState<Problem[]>([]);
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await axios.get(`${API_URL}/list/`);
                console.log(response.data);
                setProblems(response.data);
            } catch (error) {
                console.error(error);                
            }
        }
        fetchProblems();
    }, []);
  return (
    <div className="min-h-screen bg-background">
      <div className='w-full flex justify-center items-center p-4 '>
          <MenuBar />
        </div>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
                Problem Lists
            </h1>
        </div>
        <ProblemTable problems={problems} />
      </div>
    </div>
  )
}
