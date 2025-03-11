import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send } from 'lucide-react';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  isEnd: boolean;
}

export function ChatInput({ onSendMessage, isLoading, isEnd }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState("");

  // Reference to store the SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Function to start recording
  const startRecording = () => {
    setIsRecording(true);
    // Create a new SpeechRecognition instance and configure it
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    // Event handler for speech recognition results
    recognitionRef.current.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Update the message with both final and interim transcripts
      setMessage(finalTranscript + ' ' + interimTranscript);
    };


    // Start the speech recognition
    recognitionRef.current.start();
  };

  // Cleanup effect when the component unmounts
  useEffect(() => {
    return () => {
      // Stop the speech recognition if it's active
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Function to stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      // Stop the speech recognition and mark recording as complete
      recognitionRef.current.stop();
      setRecordingComplete(true);
    }
  };

  // Toggle recording state and manage recording actions
  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  // Function to adjust the height of the textarea
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`; // 128px is the max height
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

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
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative flex items-end gap-2 p-4 bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-lg">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 max-h-32 p-2 bg-transparent border-none outline-none resize-none text-white placeholder-white/50 overflow-y-auto"
          rows={1}
          maxLength={500}
          disabled={isLoading || isEnd}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleToggleRecording}
            disabled={isLoading || isEnd}
            className={`p-2 rounded-full transition-colors ${isRecording
              ? 'bg-red-600 animate-pulse'
              : 'bg-purple-600 hover:bg-purple-700'
              }`}
          >
            <Mic size={20} />
          </button>
          <button
            type="submit"
            disabled={isLoading || !message.trim() || isEnd}
            className="p-2 bg-teal-600 hover:bg-teal-700 rounded-full transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-2 left-4 text-muted-foreground text-gray-500 dark:text-gray-400 text-[8px] mt-4">
        {message.length}/500
      </div>
    </form>
  );
}