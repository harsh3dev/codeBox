import { useTabs } from "@/context/tabs-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs/Tabs";
import { cn } from "@/lib/utils";

export default function LeftPanel() {
  const { visibleTabs, removeTab, activateTab, hideTab } = useTabs();
  return (
    <div className="flex w-full h-full min-h-screen bg-white dark:bg-neutral-900 rounded-lg shadow">
      <Tabs
        value={visibleTabs.find(tab => tab.isActive)?.id || visibleTabs[0]?.id}
        onValueChange={activateTab}
        className="flex w-full h-full"
      >
        <TabsList className="bg-gray-400 dark:bg-neutral-800/50">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              isClosable={tab.isClosable}
              onClose={() => hideTab(tab.id)}
              className={cn(
                "data-[state=active]:border-r data-[state=active]:border-blue-500",
                "data-[state=inactive]:text-muted-foreground",
                "transition-colors duration-150 py-4 relative"
              )}
            >
              {tab.icon || tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="flex-1">
          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="w-full h-full">
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}