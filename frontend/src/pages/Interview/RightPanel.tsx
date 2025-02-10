import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { Message } from "./types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

export default function RightPanel({interview_id}: {interview_id: string}) {
    const [messages, setMessages] = useState<Message[]>([]);
      const [isLoading, setIsLoading] = useState(false);
      const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
      const chatEndRef = useRef<HTMLDivElement>(null);
      const synth = window.speechSynthesis;
      const ws = useRef<WebSocket | null>(null);
    
      useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, [messages]);

      const handleAIMessage = (event: MessageEvent) => {
        setIsLoading(false);
        const content = JSON.parse(event.data).message;
        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: content,
            sender: 'ai',
            timestamp: new Date()
        };
        console.log(event);
        setMessages(prev => {
            const updatedMessages = [...prev, aiMessage];
            localStorage.setItem(`messages_${interview_id}`, JSON.stringify(updatedMessages));
            return updatedMessages;
        });
    };

      useEffect(() => {
        const savedMessages = localStorage.getItem(`messages_${interview_id}`);
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
            ws.current = new WebSocket(`ws://localhost:8000/ws/interview/${interview_id}/`);
            ws.current.onopen = () => console.log('WebSocket connection established');
            ws.current.onmessage = handleAIMessage;
            ws.current.onclose = () => console.log('WebSocket connection closed');
            ws.current.onerror = (error) => console.error('WebSocket error:', error);
        } else {
            ws.current = new WebSocket(`ws://localhost:8000/ws/interview/${interview_id}/`);
            ws.current.onopen = () => console.log('WebSocket connection established');
            ws.current.onmessage = handleAIMessage;
            ws.current.onclose = () => console.log('WebSocket connection closed');
            ws.current.onerror = (error) => console.error('WebSocket error:', error);

            return () => {
                ws.current?.close();
            };
        }
    }, [interview_id]);


      const sendMessageViaWebSocket = (userMessage: string) => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({"answer": userMessage}));
        } else {
          console.error('WebSocket is not open');
        }
      };
    
      const handleMessageInput = async (userMessage: string) => {
        setIsLoading(true);
        const newMessage: Message = {
            id: Date.now().toString(),
            content: userMessage,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => {
            const updatedMessages = [...prev, newMessage];
            localStorage.setItem(`messages_${interview_id}`, JSON.stringify(updatedMessages));
            return updatedMessages;
        });

        sendMessageViaWebSocket(userMessage);
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
      <ScrollArea className="flex flex-col w-full h-full min-h-screen bg-white dark:bg-neutral-900 rounded-lg shadow">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pt-8">
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
      </ScrollArea>
  )
}
