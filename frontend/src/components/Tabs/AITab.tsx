import { useParams } from "react-router-dom"
import InterviewFeedback from "./Feedback"

export default function AITab() {
  const {id} = useParams<{id: string}>()
  return (
    <div className="h-full w-full">
      <InterviewFeedback interview_id={id as string} />
    </div>
  )
}
