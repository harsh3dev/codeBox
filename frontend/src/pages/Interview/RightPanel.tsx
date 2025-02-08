import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { Message } from "./types";
import ActionButtons from "@/components/Testcases/ActionButtons";

export default function RightPanel() {
    const [messages, setMessages] = useState<Message[]>([
        {
          id: '1',
          content: "Hello! I'm your interviewer today. Before we begin please introduce yourself!",
          sender: 'ai',
          timestamp: new Date()
        }
      ]);
      const [isLoading, setIsLoading] = useState(false);
      const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
      const chatEndRef = useRef<HTMLDivElement>(null);
      const synth = window.speechSynthesis;
    
      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);
    
      const handleMessageInput = async (userMessage: string) => {
        setIsLoading(true);
        const newMessage: Message = {
          id: Date.now().toString(),
          content: userMessage,
          sender: 'user',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
    
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
    
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "That's a great approach! Let's break down the problem further...",
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      };
    
      const handlePlayToggle = (messageId: string, content: string) => {
        if (playingMessageId === messageId) {
          synth.cancel();
          setPlayingMessageId(null);
        } else {
          synth.cancel();
          const utterance = new SpeechSynthesisUtterance(content);
          utterance.onend = () => setPlayingMessageId(null);
          setPlayingMessageId(messageId);
          synth.speak(utterance);
        }
      };
  return (
      <div className="flex flex-col w-full h-full min-h-screen bg-white dark:bg-neutral-900 rounded-lg shadow">
        <ActionButtons />
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map(message => (
                  <MessageBubble
                      key={message.id}
                      message={message}
                      isPlaying={playingMessageId === message.id}
                      onPlayToggle={() => handlePlayToggle(message.id, message.content)}
                  />
              ))}
              {isLoading && (
                  <MessageBubble
                      message={{
                          id: 'loading',
                          content: '',
                          sender: 'ai',
                          timestamp: new Date(),
                          isLoading: true
                      }}
                      isPlaying={false}
                      onPlayToggle={() => { }}
                  />
              )}
              <div ref={chatEndRef} />
          </div>
          <div className="mt-4">
              <ChatInput onSendMessage={handleMessageInput} isLoading={isLoading} />
          </div>
      </div>
  )
}
