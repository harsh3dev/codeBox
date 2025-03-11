import { useState } from "react"
import { ChevronDown, ChevronUp, Moon, Sun, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "../ui/scroll-area"

type TestCase = {
  id: number
  problem: number
  input_data: string
  expected_output: string
  is_sample: boolean
  explanation: string | null
  order: number
}

type TestCaseResult = {
  test_case: TestCase
  output: string
  success: boolean
  error: boolean
  expected: string
  stderr?: string
}

interface TestCaseResponseProps {
  results: TestCaseResult[]
}

export default function TestCaseResponse({ results }: TestCaseResponseProps) {
  const [expandedIds, setExpandedIds] = useState<number[]>([])
  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const isExpanded = (id: number) => expandedIds.includes(id)

  // Calculate summary stats
  const totalTests = results.length
  const passedTests = results.filter((r) => r.success && !r.error).length
  const failedTests = results.filter((r) => !r.success && !r.error).length
  const errorTests = results.filter((r) => r.error).length

  return (
    <div className="min-h-screen h-full bg-background p-4 md:p-6 transition-colors duration-200">
      <ScrollArea className="max-w-5xl h-full mx-auto" >
        {/* Header with stats and dark mode toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-text">Test Results</h1>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {passedTests}/{totalTests} Passed
              </span>
              <div className="h-2 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${(passedTests / totalTests) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Passed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{passedTests}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{failedTests}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Errors</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{errorTests}</p>
            </div>
          </div>
        </div>

        {/* Test case cards */}
        <div className="space-y-4">
          {results.map((result) => {
            const { test_case, success, error, output, expected, stderr } = result
            const expanded = isExpanded(test_case.id)

            // Determine card color based on status
            const cardColorClass = error
              ? "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20"
              : success
                ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                : "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20"

            // Determine status icon
            const StatusIcon = error ? AlertTriangle : success ? CheckCircle : XCircle

            const statusColorClass = error
              ? "text-yellow-500 dark:text-yellow-400"
              : success
                ? "text-green-500 dark:text-green-400"
                : "text-red-500 dark:text-red-400"

            return (
              <motion.div
                key={test_case.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`border-l-4 rounded-lg shadow-sm overflow-hidden ${cardColorClass}`}
              >
                <div
                  className="p-4 bg-white dark:bg-gray-800 cursor-pointer"
                  onClick={() => toggleExpand(test_case.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${statusColorClass}`} />
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Test Case #{test_case.id} {test_case.is_sample ? "(Sample)" : ""}
                      </h3>
                    </div>
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label={expanded ? "Collapse" : "Expand"}
                    >
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Always visible summary */}
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Input</p>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                        {test_case.input_data}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Expected Output</p>
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                        {expected}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable details */}
                <AnimatePresence>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Actual Output</p>
                          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                            {output || "(No output)"}
                          </div>
                        </div>

                        {/* Show explanation if available */}
                        {test_case.explanation && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Explanation</p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
                              {test_case.explanation}
                            </div>
                          </div>
                        )}

                        {/* Show error details if there's an error */}
                        {error && stderr && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Error Details</p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap overflow-x-auto">
                              {stderr}
                            </div>
                          </div>
                        )}

                        {/* Show comparison if failed but no error */}
                        {!success && !error && output !== expected && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Comparison</p>
                            <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm font-mono overflow-x-auto">
                              <p className="text-red-500 dark:text-red-400">
                                Expected: <span className="text-green-600 dark:text-green-400">{expected}</span>
                              </p>
                              <p className="text-red-500 dark:text-red-400">
                                Received: <span className="text-red-600 dark:text-red-400">{output}</span>
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

