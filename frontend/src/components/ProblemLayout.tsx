import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, MessageSquare, Timer, Brain, ChevronDown } from 'lucide-react'
import Markdown from './Markdown'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import ModeToggle from './ModeToggle'
import { BottomBar } from './BottomBar'
import { cn } from '@/lib/utils'

interface ProblemProps {
  title: string;
  difficulty: "E" | "M" | "H";
  topicTags: string[];
  time_limit: string;
  memory_limit: string;
  description: string;
  hints: string[];
  related_problems: {
    title: string;
    a: string;
  }[];
  initialLikes: number;
  initialDislikes: number;
  strictMode?: boolean;
}

const difficultySet = {
  E: 'Easy',
  M: 'Medium',
  H: 'Hard'
}

export default function ProblemLayout({
  title = "Two Sum",
  difficulty = "M",
  topicTags = ["Array", "Hash Table"],
  time_limit = "1s",
  memory_limit = "256MB",
  description = "Given an array of integers...",
  hints = ["Try using a hash map...", "What is the best way to find a pair of numbers that sum up to a target?"],
  related_problems = [
    { title: "Three Sum", a: "/problems/three-sum" },
    { title: "Four Sum", a: "/problems/four-sum" }
  ],
  initialLikes = 123,
  initialDislikes = 45,
  strictMode = true
}: ProblemProps) {
  const [likes, setLikes] = useState(initialLikes)
  const [dislikes, setDislikes] = useState(initialDislikes)
  const [userVote, setUserVote] = useState<'like' | 'dislike' | null>(null)
  const [isHintsOpen, setIsHintsOpen] = useState(false)
  const [isrelated_problemsOpen, setIsrelated_problemsOpen] = useState(false)

  const handleVote = (type: 'like' | 'dislike') => {
    if (userVote === type) {
      setUserVote(null)
      if (type === 'like') setLikes(prev => prev - 1)
      else setDislikes(prev => prev - 1)
    } else {
      if (userVote === 'like' && type === 'dislike') {
        setLikes(prev => prev - 1)
        setDislikes(prev => prev + 1)
      } else if (userVote === 'dislike' && type === 'like') {
        setLikes(prev => prev + 1)
        setDislikes(prev => prev - 1)
      } else {
        if (type === 'like') setLikes(prev => prev + 1)
        else setDislikes(prev => prev + 1)
      }
      setUserVote(type)
    }
  }

  return (
    <Card className="bg-transparent border-none flex flex-wrap w-full" style={{ userSelect: strictMode ? 'none' : 'auto' }}>
      <CardHeader className="space-y-4 bg-secondary/10 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="space-y-2 w-full">
            <h1 className="text-3xl font-bold text-wrap flex flex-wrap">{title}</h1>
            <div className='w-full flex items-center gap-2 justify-between'>
              { !strictMode &&(
                <div className="flex items-center gap-2">
                <Badge
                  variant="default"
                  className={cn(difficulty === 'M' ? 'text-yellow-500' : difficulty === 'E' ? 'text-green-500' : 'text-red-500', 'bg-primary/10 border border-primary/10')}
                >
                  {difficultySet[difficulty]}
                </Badge>
                {topicTags.map((label) => (
                  <Badge key={label} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {label}
                  </Badge>
                ))}
              </div>)
              }
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2 bg-secondary/10 text-secondary-foreground px-2 py-1 rounded-md">
                  <Brain className="h-4 w-4 text-primary" />
                  {memory_limit}
                  <Separator orientation="vertical" className="h-4" />
                  <Timer className="h-4 w-4 text-primary" />
                  {time_limit}
                </div>
              </div>
            </div>
          </div>
        </div>


      </CardHeader>

      <CardContent className="space-y-6 pt-6 mb-10">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-primary">Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <Markdown>{description}</Markdown>
          </div>
        </div>

        { !strictMode && hints.length > 0 &&
          <Collapsible open={isHintsOpen} onOpenChange={setIsHintsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between">
              <h2 className="text-2xl font-semibold text-primary">Hints</h2>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isHintsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="prose dark:prose-invert max-w-none bg-accent/10 p-4 rounded-md mt-2">
              {
                hints.map((hint, index) => {
                  const content = hint
                  return (
                      <span key={index}>
                        {content}
                      </span>
                  )
                })
              }
            </div>
          </CollapsibleContent>
        </Collapsible>
        }

        { !strictMode && related_problems.length > 0 &&
          <Collapsible open={isrelated_problemsOpen} onOpenChange={setIsrelated_problemsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex w-full justify-between">
              <h2 className="text-2xl font-semibold text-primary">Related Problems</h2>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isrelated_problemsOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="prose dark:prose-invert max-w-none mt-2">
              <ul>
                {related_problems.map((problem, index) => (
                  <li key={index}>
                    <a href={problem.a} className="text-primary hover:underline">
                      {problem.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
        }
        {/* <Separator className="bg-primary/30" /> */}
        {/* <BottomBar
          likes={likes}
          dislikes={dislikes}
          userVote={userVote}
          onVote={handleVote}
        /> */}
      </CardContent>
    </Card>
  )
}

