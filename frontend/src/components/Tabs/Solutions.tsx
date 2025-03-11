import React, { useLayoutEffect } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Lock, FileText } from 'lucide-react'
import { motion } from "framer-motion"
import { useStrictMode } from "@/context/StrictModeContext";
import { API_URL } from "@/lib/credentials";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { problemSet } from "./Description"
import Markdown from "../Markdown"
import { ScrollArea } from "../ui/scroll-area"

export default function Solutions() {
  const { id, slug } = useParams();
  const { strictMode } = useStrictMode();
  const [problem, setProblem] = useState<problemSet | null>(null);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const location = useLocation();
  const isInterview = location.pathname.includes("interview");

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

  useLayoutEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-interview-details/${id}/`)
        const interview = response.data
        setIsComplete(interview.is_completed);
        console.log(interview);
      } catch (error) {
        console.error("Error fetching interview details:", error)
      }
    }
    if (isInterview) fetchInterviewDetails()
  }, [id])
  const className = "bg-background h-full"

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader className="bg-muted/50 dark:bg-muted/20">
        {(!isInterview || isComplete) && (
          <CardTitle className="flex items-center text-muted-foreground gap-2 text-lg md:text-xl">
            <FileText className="h-5 w-5" />
            Solution for {problem?.title}
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="p-0 h-full bg-[#feffff] dark:bg-black">
        {isInterview && !isComplete ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center h-full"
          >
            <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
              <Lock className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium md:text-xl">Cannot view the solution during the interview</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Solutions are locked while you're in interview mode.
            </p>
          </motion.div>
        ) : strictMode ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/30 dark:text-red-400">
              <AlertCircle className="h-6 w-6 md:h-8 md:w-8" />
            </div>
            <h3 className="mb-2 text-lg font-medium md:text-xl">Solution is hidden due to strict mode</h3>
            <p className="text-sm text-muted-foreground md:text-base">
              Strict mode is enabled. Disable it to view the solution.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="markdown-body p-6 h-full"
          >
            <ScrollArea className="h-full">
              <Markdown>
                {problem?.solution || "No solution provided"}
              </Markdown>
            </ScrollArea>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
