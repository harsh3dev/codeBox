import { Routes, Route } from "react-router-dom";
import CodeLayout from './components/CodeLayout';
import Home from './pages/Home';
import Interview from './pages/Interview/Interview';


function App() {
  return (
    <main className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/code" element={<CodeLayout />} />
        <Route path="/interview/:id" element={<Interview />} />
      </Routes>
    </main>
  );
}

export default App;