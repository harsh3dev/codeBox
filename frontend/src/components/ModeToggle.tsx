import { useState, useEffect } from 'react'

import { cn } from '@/lib/utils'
import { MoonIcon, Sun } from 'lucide-react'
import { useEditorMode } from '@/context/editor-mode-context';

function ModeToggle({ className }: { className?: string }) {
  const { dispatch } = useEditorMode();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (dark) {
      document.body.classList.add('dark')
      dispatch({ type: 'SET_CODE_THEME', payload: 'vs-dark' })
    } else {
      document.body.classList.remove('dark')
      dispatch({ type: 'SET_CODE_THEME', payload: 'vs-light' })
    }
  }, [dark])

  const darkModeHandler = () => {
    setDark(!dark)
    const newTheme = !dark ? 'dark' : 'light'
    document.body.classList.toggle('dark', !dark)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button onClick={darkModeHandler} className={cn('flex items-center justify-center hover:bg-gray-900/30 dark:hover:bg-gray-200/30 p-2 rounded-full', className)}>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {
          dark ? <MoonIcon size={16} /> : <Sun size={16} />
        }
      </div>
    </button>
  )
}

export default ModeToggle
