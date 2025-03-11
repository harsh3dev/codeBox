import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

interface BottomBarProps {
  likes: number
  dislikes: number
  userVote: 'like' | 'dislike' | null
  onVote: (type: 'like' | 'dislike') => void
}

export function BottomBar({
  likes,
  dislikes,
  userVote,
  onVote
}: BottomBarProps) {
  return (
    <div className="w-full px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={userVote === 'like' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onVote('like')}
              className={`${userVote === 'like' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'}`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {likes}
            </Button>
            <Button 
              variant={userVote === 'dislike' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => onVote('dislike')}
              className={`${userVote === 'dislike' ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/20'}`}
            >
              <ThumbsDown className="h-4 w-4 mr-1" />
              {dislikes}
            </Button>
            <Button variant="outline" size="sm" className="hover:bg-accent/20">
              <MessageSquare className="h-4 w-4 mr-1" />
              Discussion
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

