import { Tab } from "@/context/tab";
import Discussion from "./Discussion";
import Results from "./Results";
import Solutions from "./Solutions";
import TestCases from "../Testcases/TestCases";
import TestCaseResults from "../Testcases/TestCaseResults";

export const initialTabs: Tab[] = [
    {
        id: "discussion",
        name: "Discussion",
        isHidden: false,
        isActive: true,
        isClosable: false,
        content: <Discussion />,
    },
    {
        id: "solutions",
        name: "Solutions",
        isHidden: false,
        isActive: false,
        isClosable: false,
        content: <Solutions />,
    },
    {
        id: "results",
        name: "Results",
        isHidden: true,
        isActive: false,
        isClosable: true,
        content: <Results />,
    }
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