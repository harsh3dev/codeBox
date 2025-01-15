import { Routes, Route } from "react-router-dom"
import CodeLayout from './components/CodeLayout';
import Home from './pages/Home';

function App() {

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
