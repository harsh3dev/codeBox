import CodeEditor from './CodeEditor/CodeEditor';
import ActionButtons from './Testcases/ActionButtons';
import TestCases from './Testcases/TestCases';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
export default function RightPanel() {

  return (
    <ResizablePanelGroup direction="vertical" className='flex-grow'>
      <ResizablePanel minSize={10} defaultSize={70} className='bg-white dark:bg-neutral-900 rounded-lg border shadow'>
        <CodeEditor />
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-background py-[1px] my-[2px] hover:bg-blue-700 transition-colors" />
      <ResizablePanel minSize={10} defaultSize={30} className='relative bg-white dark:bg-neutral-900 rounded-lg border shadow'>
        <TestCases />
        <ActionButtons className="absolute bottom-0 right-0" />
      </ResizablePanel>
    </ResizablePanelGroup >
  );
}

{/* 
    const { state, dispatch } = useEditorMode();
  <Tabs
value={state.activeEditorTab}
onValueChange={(value) =>
  dispatch({ type: 'SET_ACTIVE_EDITOR_TAB', payload: value as 'code' | 'testcases' })
}
className="h-full flex flex-col"

> */}