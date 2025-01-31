import { Tab } from "@/context/tab";
import Description from "./Description";
import Results from "./Results";
import Solutions from "./Solutions";
import TestCases from "../Testcases/TestCases";
import TestCaseResults from "../Testcases/TestCaseResults";
import { Book, FlaskConical, Lightbulb, Sparkles } from "lucide-react";

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
        id: "results",
        name: "Results",
        icon: <FlaskConical />,
        isHidden: true,
        isActive: false,
        isClosable: true,
        content: <Results />,
    },
    {
        id: "assistant",
        name: "AI Assistant",
        icon: <Sparkles />,
        isHidden: false,
        isActive: false,
        isClosable: false,
        content: <Solutions />,
    },
]

export const testCaseTabs: Tab[] = [
    {
        id: "testcases",
        name: "Test Cases",
        isHidden: false,
        isActive: true,
        isClosable: false,
        content: <TestCases />,
    },
    {
        id: "results",
        name: "Results",
        isHidden: true,
        isActive: false,
        isClosable: true,
        content: <TestCaseResults />,
    }
]