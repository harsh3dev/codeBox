import { useState, useEffect } from "react"
import { ThumbsUp, ThumbsDown, Minus, RefreshCw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Markdown from "../Markdown"
import axios from "axios"
import { API_URL } from "@/lib/credentials"
import { ScrollArea } from "../ui/scroll-area"

// Type for feedback data
interface FeedbackData {
    feedback: string
    message: string
}

export default function InterviewFeedback({ interview_id }: { interview_id: string }) {
    const [feedback, setFeedback] = useState<FeedbackData | null>(null)
    const [loading, setLoading] = useState(true)
    const isComplete = false;

    const fetchFeedback = async () => {
        setLoading(true)
        const response = await axios.post(`${API_URL}/code/feedback/`, {
            interview_id: interview_id
        });
        console.log(response.data, "feedback");
        setFeedback(response.data)
        setLoading(false)
    }

    // Fetch data on component mount
    useEffect(() => {
        if(isComplete) fetchFeedback()
    }, [])

    if(!isComplete) {
        return (
            <ScrollArea
              className={`min-h-screen h-full p-4 sm:p-6 md:p-8 transition-colors duration-200 bg-background`}>
              <div className="max-w-4xl mx-auto h-full">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Feedback</h1>
                </div>
                <Card className="w-full h-full transition-all duration-300 shadow-md hover:shadow-lg">
                  <CardContent className="p-6">
                    <p className="text-center text-gray-500 dark:text-gray-400">Feedback will be available after the interview is complete</p>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
        )
    }

    return (
        <ScrollArea
          className={`min-h-screen h-full p-4 sm:p-6 md:p-8 transition-colors duration-200 bg-background`}
        >
          <div className="max-w-4xl mx-auto h-full">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Feedback</h1>
            </div>

            <Card className="w-full h-full transition-all duration-300 shadow-md hover:shadow-lg">
              {loading ? (
                // Skeleton loading state
                <div className="p-6 space-y-4">
                  <div className="h-8 bg-gray-400 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-400 dark:bg-gray-700 rounded animate-pulse w-5/6"></div>
                  </div>
                </div>
              ) : feedback ? (
                <>
                  
                  <CardContent className="prose dark:prose-invert max-w-none pt-2 h-full">
                    <Markdown>{feedback.feedback}</Markdown>
                  </CardContent>
                </>
              ) : (
                <CardContent className="p-6">
                  <p className="text-center text-gray-500 dark:text-gray-400">No feedback available</p>
                </CardContent>
              )}
            </Card>
          </div>
        </ScrollArea>
    )

}