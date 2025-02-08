import { formatDistanceToNow } from 'date-fns';
import { Play, Pause, User, Bot } from 'lucide-react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
  isPlaying: boolean;
  onPlayToggle: () => void;
}

export function MessageBubble({ message, isPlaying, onPlayToggle }: MessageBubbleProps) {
  const isAI = message.sender === 'ai';
  
  return (
    <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`flex items-start max-w-[80%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
          ${isAI ? 'bg-purple-600' : 'bg-teal-600'} mr-2`}>
          {isAI ? <Bot size={18} /> : <User size={18} />}
        </div>
        <div className={`relative group min-w-fit ${
          isAI 
            ? 'bg-gradient-to-br from-purple-900/90 to-blue-900/90' 
            : 'bg-gradient-to-br from-teal-900/90 to-emerald-900/90'
        } rounded-lg p-4 mx-2 backdrop-blur-sm border border-white/10`}>
          {message.isLoading ? (
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          ) : (
            <>
              <p className="text-white/90 whitespace-pre-wrap">{message.content}</p>
              {isAI && (
                <button
                  onClick={onPlayToggle}
                  className="absolute mt-6 mr-6 -translate-x-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              )}
            </>
          )}
          {/* <span className="absolute text-nowrap bottom-1 right-2 text-xs text-white/50">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span> */}
        </div>
      </div>
    </div>
  );
}