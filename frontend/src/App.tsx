import { Routes, Route } from "react-router-dom"
import CodeLayout from './components/CodeLayout';
import Home from './pages/Home';
import { useEffect } from "react";

function App() {

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
    <main className='w-full h-full min-h-screen flex items-center justify-center'>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/code" element={<CodeLayout />} />
    </Routes>
    </main>
  );
}

export default App;
