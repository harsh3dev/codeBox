import { Tab } from "@/context/tab";
import Description from "./Description";
import Solutions from "./Solutions";
import { Book, Lightbulb, Sparkles } from "lucide-react";
import AITab from "./AITab";

export const initialTabs: Tab[] = [
    {
        id: "Description",
        name: "Description",
        icon: <Book />, 
        isHidden: false,
        isActive: true,
        isClosable: false,
        content: <Description />,
    },
    {
        id: "solutions",
        name: "Solutions",
        icon: <Lightbulb />,
        isHidden: false,
        isActive: false,
        isClosable: false,
        content: <Solutions />,
    },
    {
        id: "assistant",
        name: "AI Assistant",
        icon: <Sparkles />,
        isHidden: false,
        isActive: false,
        isClosable: false,
        content: <AITab />,
    },
]
