import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs"
import { useTabs } from "@/context/tabs-context"

export function DynamicTabs() {
  const { visibleTabs, activateTab, hideTab } = useTabs()

  return (
    <div className="w-full bg-gray-900">
      <div className="flex items-center border-b border-gray-800">
        <Tabs 
          value={visibleTabs.find(tab => tab.isActive)?.id || visibleTabs[0]?.id} 
          onValueChange={activateTab}
          className="flex-1"
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
                  "data-[state=active]:border-blue-500 data-[state=active]:text-white",
                  "data-[state=inactive]:text-gray-400",
                  "hover:text-gray-100 hover:bg-gray-800/50",
                  "transition-colors duration-150"
                )}
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="text-white mt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
