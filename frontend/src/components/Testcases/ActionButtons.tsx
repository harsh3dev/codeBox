import { Button } from '@/components/ui/button';
import ModeToggle from '../ModeToggle';
import { useTabs } from '@/context/tabs-context';
import Results from '../Tabs/Results';

export default function ActionButtons() {
  const { state, addTab } = useTabs()


  const handleSubmit = () => {
    const newTab = {
      id: `new-tab-${state.tabs.length + 1}`,
      name: "Results",
      isHidden: false,
      isActive: true,
      isClosable: true,
      content: <Results />,
    }
    setTimeout(() => {
      addTab(newTab)
    }, 500);
    
  }

  return (
    <div className="flex justify-center gap-2 p-4 bg-background">
      <ModeToggle />
      <Button variant="secondary" className="mr-2">
        Run
      </Button>
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
