import { ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

export interface Tab {
  id: string
  name: string
  isHidden: boolean
  isActive: boolean
  isClosable: boolean
  content: ReactNode
  icon?: LucideIcon
}

export interface TabsState {
  tabs: Tab[]
  activeTabId: string | null
}
