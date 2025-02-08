import { useState, useEffect, useCallback } from 'react';
import { Routes, Route } from "react-router-dom";
import CodeLayout from './components/CodeLayout';
import Home from './pages/Home';
import { useEffect } from "react";

const useWebSocket = (url:string) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("WebSocket connection established.");
      setIsConnected(true);
      setSocket(ws);
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, data]);
      console.log("Message received:", data);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed.");
      setIsConnected(false);
      setSocket(null);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [url]);

  const sendMessage = useCallback((message) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, [socket]);

  return { isConnected, sendMessage, messages };
};

function App() {
  const interviewId = 2;
  const { isConnected, sendMessage, messages } = useWebSocket(
    `ws://localhost:8000/ws/interview/${interviewId}/`
  );

  // Example of how to send a message once connected
  useEffect(() => {
    if (isConnected) {
      sendMessage({
        answer: 'Hello, WebSocket!'
      });
    }
  }, [isConnected, sendMessage]);

  useEffect(() => {
    const interviewId = 123; 
    const socket = new WebSocket(`ws://localhost:8000/ws/interview/${interviewId}/`);
    
    socket.onopen = function (e) {
        console.log("WebSocket connection established.");
    };
    
    socket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log("Message received:", data.message);
    };
    
    socket.onclose = function (e) {
        console.log("WebSocket connection closed.");
    };
    
    socket.onerror = function (error) {
        console.error("WebSocket error:", error);
    };
  }, [])


  return (
    <main className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <div className="mb-4">
        Connection Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      
      {messages.length > 0 && (
        <div className="mb-4 p-4 bg-gray-100 rounded max-w-md w-full">
          <h2 className="text-lg font-semibold mb-2">Messages:</h2>
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              {msg.message}
            </div>
          ))}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code" element={<CodeLayout />} />
      </Routes>
    </main>
  );
}

export default App;