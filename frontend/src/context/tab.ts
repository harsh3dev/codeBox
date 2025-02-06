import { ReactNode } from 'react'

export interface Tab {
  id: string
  name: string
  isHidden: boolean
  isActive: boolean
  isClosable: boolean
  content: ReactNode
  icon?: ReactNode
}

export interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}
