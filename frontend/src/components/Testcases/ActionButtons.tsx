import { useTabs } from '@/context/tabs-context';
import Results from '../Tabs/Results';
import { FlaskConical } from 'lucide-react';
import PerformAction from './PerformAction';

export default function ActionButtons({className, onRun, submitState, setSubmitState}: {className?: string, onRun: () => void, submitState: "initial" | "loading" | "success", setSubmitState: React.Dispatch<React.SetStateAction<"initial" | "loading" | "success">>}) {
  const { state, addTab } = useTabs()


  const handleSubmit = () => {
    const newTab = {
      id: `new-tab-${state.tabs.length + 1}`,
      name: "Results",
      isHidden: false,
      icon: <FlaskConical />,
      isActive: true,
      isClosable: true,
      content: <Results />,
    }
    setTimeout(() => {
      addTab(newTab)
    }, 500);
    
  }

  return (
    <div className={"flex justify-center gap-2 py-4 pr-8" + (className ? ` ${className}` : "")}>
      <PerformAction state={submitState} onRun={onRun} onSubmit={handleSubmit} setState={setSubmitState} />
    </div>
  );
}
