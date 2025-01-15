import { useTabs } from "@/context/tabs-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs/Tabs";
import { cn } from "@/lib/utils";

export default function LeftPanel() {
  const { visibleTabs, removeTab, activateTab, hideTab } = useTabs()
  return (
    <div className="w-full h-full min-h-screenborder bg-white dark:bg-neutral-900 rounded-lg shadow">
      <Tabs
        value={visibleTabs.find(tab => tab.isActive)?.id || visibleTabs[0]?.id}
        onValueChange={activateTab}
        className="flex-1 w-full h-full"
      >
        <TabsList className="bg-transparent">
          {visibleTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              icon={tab.icon && <tab.icon className="w-4 h-4" />}
              isClosable={tab.isClosable}
              onClose={() => hideTab(tab.id)}
              className={cn(
                "data-[state=active]:border-b data-[state=active]:border-blue-500",
                "data-[state=inactive]:text-muted-foreground",
                "transition-colors duration-150"
              )}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {visibleTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="w-full h-full">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
