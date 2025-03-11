import { useState } from "react";
import { Textarea } from "../ui/textarea";
import ActionButtons from "./ActionButtons";
import { TestCase } from "@/pages/Interview/types";

export default function TestCases({
  className,
  defaultTestCases = [], // Provide a default value if not passed
  onRun,
  submitState,
  setSubmitState,
}: {
  className?: string;
  defaultTestCases: TestCase[];
  onRun: (testCases: TestCase[]) => void;
  submitState: "initial" | "loading" | "success";
  setSubmitState: React.Dispatch<React.SetStateAction<"initial" | "loading" | "success">>;
}) {
  const [testCases, setTestCases] = useState<TestCase[]>(defaultTestCases);
  const [submittedCases, setSubmittedCases] = useState<TestCase[]>();
  const [showSubmitted, setShowSubmitted] = useState(false);

  const updateTestCase = (value: any) => {
    setTestCases(value);
  };

  const handleSubmit = () => {
    setSubmittedCases(testCases);
    setShowSubmitted(true);
    onRun(testCases);
  };

  return (
    <div className="min-h-screen p-4 overflow-auto">
      <h1 className="text-xl font-bold mb-4">Test Cases</h1>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center space-x-2 mb-4">
          <Textarea
            id="input-n"
            value={defaultTestCases
              ? defaultTestCases.map((testCase: TestCase) => testCase.input_data).join("\n")
              : ""} // Ensure defaultTestCases is an array before calling map()
            onChange={(e) => {
              const newTestCases = e.target.value.split("\n").map((inputData: string, index: number) => ({
                ...testCases[index],
                input_data: inputData.trim(),
              }));
              updateTestCase(newTestCases);
            }}
            className="border-none w-full focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-hidden"
            placeholder="Enter test case value"
          />
        </div>
      </div>
      <ActionButtons submitState={submitState} className="absolute bottom-0 right-0" onRun={handleSubmit} setSubmitState={setSubmitState} />
    </div>
  );
}
