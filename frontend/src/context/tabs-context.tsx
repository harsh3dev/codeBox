import * as React from "react"
import { Tab, TabsState } from "./tab"

interface TabsContextType {
  state: TabsState
  visibleTabs: Tab[]
  addTab: (newTab: Omit<Tab, "isActive" | "isClosable">) => void
  removeTab: (tabId: string) => void
  activateTab: (tabId: string) => void
  hideTab: (tabId: string) => void
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProviderProps {
  children: React.ReactNode
  initialTabs: Tab[]
}

export function TabsProvider({ children, initialTabs }: TabsProviderProps) {
  const [state, setState] = React.useState<TabsState>(() => ({
    tabs: initialTabs,
    activeTabId: initialTabs.find(tab => tab.isActive)?.id || initialTabs[0]?.id || null,
  }))

  const addTab = React.useCallback((newTab: Omit<Tab, "isActive" | "isClosable">) => {
    setState((prev) => {
      const updatedTabs = prev.tabs.map(tab => ({ ...tab, isActive: false }))
      return {
        tabs: [
          ...updatedTabs,
          { ...newTab, isActive: true, isHidden: false, isClosable: true },
        ],
        activeTabId: newTab.id,
      }
    })
  }, [])

  const removeTab = React.useCallback((tabId: string) => {
    setState((prev) => {
      const newTabs = prev.tabs.filter((tab) => tab.id !== tabId)
      const removedTab = prev.tabs.find((tab) => tab.id === tabId)
      
      if (removedTab?.isActive && newTabs.length > 0) {
        const index = prev.tabs.findIndex((tab) => tab.id === tabId)
        const newActiveIndex = Math.max(0, index - 1)
        newTabs[newActiveIndex].isActive = true
        return {
          tabs: newTabs,
          activeTabId: newTabs[newActiveIndex].id,
        }
      }
      
      return {
        ...prev,
        tabs: newTabs,
      }
    })
  }, [])

  const activateTab = React.useCallback((tabId: string) => {
    setState((prev) => ({
      tabs: prev.tabs.map((tab) => ({
        ...tab,
        isActive: tab.id === tabId,
        isHidden: tab.id === tabId ? false : tab.isHidden,
      })),
      activeTabId: tabId,
    }))
  }, [])

  const hideTab = React.useCallback((tabId: string) => {
    setState((prev) => {
      const updatedTabs = prev.tabs.map(tab => 
        tab.id === tabId ? { ...tab, isHidden: true, isActive: false } : tab
      )
      const visibleTabs = updatedTabs.filter(tab => !tab.isHidden)
      const newActiveTabId = visibleTabs.length > 0 ? visibleTabs[0].id : null

      return {
        tabs: updatedTabs.map(tab => 
          tab.id === newActiveTabId ? { ...tab, isActive: true } : tab
        ),
        activeTabId: newActiveTabId,
      }
    })
  }, [])

  const visibleTabs = React.useMemo(() => state.tabs.filter(tab => !tab.isHidden), [state.tabs])

  return (
    <TabsContext.Provider value={{ state, visibleTabs, addTab, removeTab, activateTab, hideTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export function useTabs(initialTabs?: Tab[]) {
  const context = React.useContext(TabsContext)
  if (context === undefined) {
    if (!initialTabs) {
      throw new Error("useTabs must be used within a TabsProvider or with initialTabs")
    }
    return {
      ...context!,
      state: { tabs: initialTabs, activeTabId: initialTabs[0]?.id || null },
      visibleTabs: initialTabs.filter(tab => !tab.isHidden),
    }
  }
  return context
}
