import { useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom"; // Added useLocation
import { useTabs } from "@/context/tabs-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs/Tabs";
import { cn } from "@/lib/utils";
import ModeToggle from "./ModeToggle";
import ProfileAvatar from "./ui/ProfileAvatar";
import { SettingsMenu } from "./ui/SettingsMenu";
import { ArrowBigLeftDash } from "lucide-react";

export default function LeftPanel() {
  const { visibleTabs, activateTab, hideTab } = useTabs();
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  const isInterview = location.pathname.includes("interview");

  const filteredTabs = visibleTabs.filter((tab) => {
    if (!isInterview) {
      return tab.id !== "assistant";
    }
    return true;
  });

  return (
    <div className="flex w-full h-full min-h-screen bg-white border dark:bg-neutral-900 rounded-lg shadow">
      <Tabs
        value={visibleTabs.find(tab => tab.isActive)?.id || visibleTabs[0]?.id}
        onValueChange={activateTab}
        className="flex w-full h-full rounded-lg bg-gray-100 dark:bg-neutral-800/50"
      >
        <div className="flex flex-col justify-around h-[95%] bg-gray-200 dark:bg-neutral-800/50">
          <Link to="/problems" className="flex items-center justify-center h-12 text-lg font-bold text-blue-500 dark:text-blue-400">
            <ArrowBigLeftDash size={24} className="" />
          </Link>
          <TabsList className="bg-gray-200 dark:bg-neutral-800/50">
            {filteredTabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  isClosable={tab.isClosable}
                  onClose={() => hideTab(tab.id)}
                  className={cn(
                    "data-[state=active]:border-r data-[state=active]:border-blue-500",
                    "data-[state=inactive]:text-muted-foreground",
                    "transition-colors duration-150 py-4 relative"
                  )}
                >
                  {tab.icon || tab.name}
                </TabsTrigger>
              ))}
          </TabsList>
          <div className="flex flex-col items-center justify-between gap-4">
            <ModeToggle />
            <SettingsMenu />
            <ProfileAvatar />
          </div>
        </div>
        <div className="flex-1">
          {visibleTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="w-full h-full">
              {tab.content}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}