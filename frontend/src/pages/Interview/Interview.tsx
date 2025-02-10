import LeftPanel from "@/components/LeftPanel"
import { initialTabs } from "@/components/Tabs/constants"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { TabsProvider } from "@/context/tabs-context"
import { useParams } from "react-router-dom"
import RightPanel from "./RightPanel"

export default function Interview() {
    const { id } = useParams<{ id: string }>()
    console.log(id)
  return (
    <TabsProvider initialTabs={initialTabs}>
      <div className="h-screen w-full flex flex-col inset-0">
        <ResizablePanelGroup direction="horizontal" className="flex-grow p-2">
          <ResizablePanel minSize={20} defaultSize={50} className="rounded-lg">
            <LeftPanel />
          </ResizablePanel>
          <ResizableHandle withHandle className="bg-background px-[1px] mx-[2px] hover:bg-blue-700 transition-colors" />
          <ResizablePanel minSize={20} defaultSize={50} className="rounded-lg">
            <RightPanel interview_id={id as string} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </TabsProvider>
  )
}
