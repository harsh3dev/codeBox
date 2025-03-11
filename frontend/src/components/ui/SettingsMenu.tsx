import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Settings, InfoIcon } from "lucide-react"
import { useStrictMode } from "@/context/StrictModeContext"
import { useEditorMode } from "@/context/editor-mode-context"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface EditorSettings {
  keyBindings: "standard" | "vim" | "emacs"
  fontSize: number
  tabSize: number
  lineNumbers: string
}

export function SettingsMenu() {
  const { strictMode, toggleStrictMode } = useStrictMode()
  const { state, dispatch } = useEditorMode()
  const location = useLocation()
  const isInterviewPage = location.pathname.startsWith("/interview")

  const [settings, setSettings] = useState<EditorSettings>(state.editorOptions)

  useEffect(() => {
    setSettings(state.editorOptions)
  }, [state.editorOptions])

  const updateSettings = <K extends keyof EditorSettings>(key: K, value: EditorSettings[K]) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    dispatch({ type: 'SET_EDITOR_OPTIONS', payload: newSettings })
  }

  const fontSizeOptions = [12, 14, 16, 18, 20]
  const tabSizeOptions = [2, 4, 8]

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-transparent border-none hover:bg-primary/10">
                <Settings size={16} />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full p-4 min-w-80 bg-white dark:bg-zinc-900 text-black dark:text-white" align="end" side="right">
              <DropdownMenuLabel className="text-lg font-medium">Settings</DropdownMenuLabel>
              <DropdownMenuSeparator className="border-gray-200 dark:border-gray-700" />

              <DropdownMenuGroup className="p-2 space-y-4">
                {/* Key Bindings */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-blue-500">Key Bindings</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={16} className="text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white dark:bg-zinc-900 text-black dark:text-white">
                        <p>Choose your preferred keyboard shortcuts style</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <ToggleGroup
                    type="single"
                    value={settings.keyBindings}
                    onValueChange={(value) => {
                      if (value) updateSettings("keyBindings", value as "standard" | "vim" | "emacs")
                    }}
                    className="bg-gray-100 dark:bg-zinc-900 rounded-md w-full"
                  >
                    <ToggleGroupItem
                      value="standard"
                      className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      Standard
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="vim"
                      className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      Vim
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="emacs"
                      className="flex-1 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                    >
                      Emacs
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>

                {/* Font Size */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-blue-500">Font Size</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={16} className="text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white dark:bg-zinc-900 text-black dark:text-white">
                        <p>Adjust the size of the editor text</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={settings.fontSize.toString()}
                    onValueChange={(value) => updateSettings("fontSize", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full bg-gray-100 dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                      <SelectValue placeholder="Font size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                      {fontSizeOptions.map((size) => (
                        <SelectItem key={size} value={size.toString()} className="text-black dark:text-white">
                          {size} px
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tab Spacing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-base font-medium text-blue-500">Tab Spacing</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon size={16} className="text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-white dark:bg-zinc-900 text-black dark:text-white">
                        <p>Set the number of spaces for each tab</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Select
                    value={settings.tabSize.toString()}
                    onValueChange={(value) => updateSettings("tabSize", Number.parseInt(value))}
                  >
                    <SelectTrigger className="w-full bg-gray-100 dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                      <SelectValue placeholder="Tab size" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-zinc-900 border-gray-300 dark:border-zinc-700">
                      {tabSizeOptions.map((size) => (
                        <SelectItem key={size} value={size.toString()} className="text-black dark:text-white">
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!isInterviewPage && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="strict-mode" className="text-base font-medium text-blue-500">
                        Strict Mode
                      </Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon size={16} className="text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-white dark:bg-zinc-900 text-black dark:text-white">
                          <p>
                            Strict mode enables a focused coding environment eliminating all the clutter from the
                            workspace.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Switch
                      id="strict-mode"
                      checked={strictMode}
                      onCheckedChange={toggleStrictMode}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                )}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-white dark:bg-zinc-900 text-black dark:text-white">
          <p>Editor Settings</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

