import LeftPanel from "@/components/LeftPanel"
import { initialTabs } from "@/components/Tabs/constants"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { TabsProvider } from "@/context/tabs-context"
import { useParams } from "react-router-dom"
import RightPanel from "./RightPanel"
import { useLayoutEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "@/lib/credentials"

export default function Interview() {
  const { id } = useParams<{ id: string }>()
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [isComplete, setIsComplete] = useState<boolean>(false)

  useLayoutEffect(() => {
    const fetchInterviewDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/get-interview-details/${id}/`)
        const interview = response.data
        const startTime = new Date(interview.start_time).getTime()
        const currentTime = new Date().getTime()
        const elapsedTime = Math.floor((currentTime - startTime) / 1000) 
        const totalDuration = 45 * 60 
        const remaining = totalDuration - elapsedTime
        setIsComplete(interview.is_completed);
        setRemainingTime(remaining > 0 ? remaining : 0)
        console.log("interview", interview);
      } catch (error) {
        console.error("Error fetching interview details:", error)
      }
    }
    fetchInterviewDetails()
  }, [id])

 if(remainingTime==null) return;
  return (
    <TabsProvider initialTabs={initialTabs}>
      <div className="h-screen w-full flex flex-col inset-0">
        <ResizablePanelGroup direction="horizontal" className="flex-grow p-2">
          <ResizablePanel minSize={20} defaultSize={50} className="rounded-lg">
            <LeftPanel />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-background px-[1px] mx-[2px] hover:bg-blue-700 transition-colors" />
          <ResizablePanel minSize={20} defaultSize={50} className="rounded-lg h-full relative">
            {/* <ChatPanel interview_id={id as string} /> */}
            <RightPanel remainingTime={remainingTime} isComplete={isComplete} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TabsProvider>
  )
}
