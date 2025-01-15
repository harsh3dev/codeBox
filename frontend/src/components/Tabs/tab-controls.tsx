import { Button } from "@/components/ui/button"
import { useTabs } from "@/context/tabs-context"

export function TabControls() {
  const { state, visibleTabs, activateTab, addTab } = useTabs()
  
  const handleCycleTab = () => {
    const currentIndex = visibleTabs.findIndex(tab => tab.isActive)
    const nextIndex = (currentIndex + 1) % visibleTabs.length
    const nextTabId = visibleTabs[nextIndex].id
    activateTab(nextTabId)
  }

  const handleAddTab = () => {
    const newTabId = `new-tab-${state.tabs.length + 1}`
    addTab({
      id: newTabId,
      name: `New Tab ${state.tabs.length + 1}`,
      isHidden: false,
      content: <div>Content for New Tab {state.tabs.length + 1}</div>,
    })
  }

  const hiddenTabs = state.tabs.filter(tab => tab.isHidden && tab.isClosable)

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-900 border-t border-gray-800">
      <div className="flex gap-4">
        <Button 
          onClick={handleCycleTab}
          variant="secondary"
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Switch to Next Tab
        </Button>
        <Button 
          onClick={handleAddTab}
          variant="secondary"
          className="bg-gray-800 text-white hover:bg-gray-700"
        >
          Add New Tab
        </Button>
      </div>
      {hiddenTabs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-white mb-2">Hidden Tabs:</h3>
          <div className="flex flex-wrap gap-2">
            {hiddenTabs.map(tab => (
              <Button
                key={tab.id}
                onClick={() => activateTab(tab.id)}
                variant="outline"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                {tab.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

