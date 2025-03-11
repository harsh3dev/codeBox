import { useEffect, useRef, useState } from "react";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { Message } from "./types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useStrictMode } from "@/context/StrictModeContext";
import axios from "axios";
import { API_URL } from "@/lib/credentials";

interface ChatPanelProps {
  interview_id: string;
  remainingTime: number;
  isComplete: boolean;
}

export default function ChatPanel({ interview_id, remainingTime, isComplete }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const synth = window.speechSynthesis;
  const ws = useRef<WebSocket | null>(null);
  const { toggleStrictMode } = useStrictMode();

  useEffect(() => {
    const savedMessages = localStorage.getItem(`messages_${interview_id}`); // TODO: also check if the interview data has chat history
    if (!isComplete) {
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
    } else {
      ws.current?.close();
      if (savedMessages)
        setMessages(JSON.parse(savedMessages));
    }
  }, [interview_id]);

  useEffect(() => {
    const completeInterview = async () => {
      const response = await axios.post(`${API_URL}/code/complete/`, {
        interview_id: interview_id
      });
      console.log(response.data);
    }
    const generateFeedback = async () => {
      const response = await axios.post(`${API_URL}/code/feedback/`, {
        interview_id: interview_id
      });
      console.log(response.data, "feedback");
    }

    if (remainingTime === 0 && !isComplete) {
      console.log("Feedback Method Called, Complete Interview Called")
      ws.current?.close();
      console.log("iscomplete", isComplete);
      toggleStrictMode();
      completeInterview();
      generateFeedback();
    }
  }, [remainingTime]);


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
    console.log("AI Message:", event);
    setMessages(prev => {
      const updatedMessages = [...prev, aiMessage];
      localStorage.setItem(`messages_${interview_id}`, JSON.stringify(updatedMessages));
      return updatedMessages;
    });
  };


  const sendMessageViaWebSocket = (userMessage: string) => {
    const language = localStorage.getItem('language');
    const code = localStorage.getItem(`code_${language}`);
    const showCode = localStorage.getItem('showCode');
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      if (code && showCode === 'true') {
        ws.current.send(JSON.stringify({ "answer": userMessage, "remaining_time": remainingTime, "code": code }));
        console.log({ "answer": userMessage, "remaining_time": remainingTime, "code": code })
      } else {
        ws.current.send(JSON.stringify({ "answer": userMessage, "remaining_time": remainingTime }));
        console.log({ "answer": userMessage, "remaining_time": remainingTime })
      }
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
    <ScrollArea className="relative flex flex-col justify-between w-full h-full bg-white dark:bg-neutral-900 rounded-lg shadow">
      {/* <button onClick={handleComplete}>complete</button> */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar pt-8 pb-10 ">
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
      <div className=" w-full">
        <ChatInput onSendMessage={handleMessageInput} isLoading={isLoading} isEnd={remainingTime === 0} />
      </div>
    </ScrollArea>
  )
}

/**
 * handleAIMessage function is used to handle the message received from the AI.
 * sendMessageViaWebSocket function is used to send the user message to the AI via WebSocket.
 * handleMessageInput function is used to handle the message input by the user.
 */
