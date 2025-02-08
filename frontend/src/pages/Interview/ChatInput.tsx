import React, { useState, useRef } from 'react';
import { Mic, Send } from 'lucide-react';
import { ReactMediaRecorder } from 'react-media-recorder';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ReactMediaRecorder
      audio
      render={({ status, startRecording, stopRecording }) => (
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-end gap-2 p-4 bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-lg">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 max-h-32 p-2 bg-transparent border-none outline-none resize-none text-white placeholder-white/50"
              rows={1}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={status === 'recording' ? stopRecording : startRecording}
                className={`p-2 rounded-full transition-colors ${
                  status === 'recording'
                    ? 'bg-red-600 animate-pulse'
                    : 'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Mic size={20} />
              </button>
              <button
                type="submit"
                disabled={isLoading || !message.trim()}
                className="p-2 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </form>
      )}
    />
  );
}