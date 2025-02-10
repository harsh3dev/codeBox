import { Button } from '@/components/ui/button';
import { useTabs } from '@/context/tabs-context';
import Results from '../Tabs/Results';
import { FlaskConical } from 'lucide-react';

export default function ActionButtons({className}: {className?: string}) {
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
      <Button variant="outline" className="mr-2 shadow-lg">
        Run
      </Button>
      <Button onClick={handleSubmit} className='shadow-lg'>Submit</Button>
    </div>
  );
}
