import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTabs } from "@/context/tabs-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/Tabs/Tabs";
import { cn } from "@/lib/utils";
import { Code2 } from 'lucide-react';
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import CodePanel from "./CodePanel";

export default function RightPanel() {
  const { activateTab, hideTab } = useTabs();
  const { id } = useParams<{ id: string }>();

  const [activeTab, setActiveTab] = useState('ChatPanel');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    activateTab(value);
  };

  return (
    <div className="flex w-full h-full min-h-screen bg-white border dark:bg-neutral-900 rounded-lg shadow">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full h-full rounded-lg bg-gray-100 dark:bg-neutral-800/50 justify-start items-start relative"
      >
        <div className="w-full bg-gray-200 dark:bg-neutral-800/50 mt-4">
          <TabsList direction="row" className="flex bg-gray-200 dark:bg-neutral-800/50">
            <TabsTrigger
              value="CodePanel"
              isClosable={false}
              className={cn(
                "data-[state=active]:border-b data-[state=active]:border-blue-500",
                "data-[state=inactive]:text-muted-foreground",
                "transition-colors duration-150 p-2 relative"
              )}
            >
              <Code2 size={20} />
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1 h-[calc(100%-3.8rem)]">
          <TabsContent value="CodePanel" direction="row" className="w-full h-full">
            <CodePanel/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
