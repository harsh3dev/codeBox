import { Routes, Route } from "react-router-dom";
import CodeLayout from './components/CodeLayout';
import Home from './pages/Home';
import Interview from './pages/Interview/Interview';
import ProblemLists from "./pages/Problems/ProblemLists";
import Login from "./pages/login";
import Signup from "./pages/signup";
import { StrictModeProvider } from '@/context/StrictModeContext';
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/authContext";
import { Toaster } from 'react-hot-toast';
import { useEditorMode } from "./context/editor-mode-context";
import Profile from "./pages/Profile";
import AuthenticatedRoute from "./lib/AuthenticatedRoute";

function App() {
  const { state } = useEditorMode();

  return (
    <StrictModeProvider>
      <AuthProvider>
        <TooltipProvider>
          <main className="w-full h-full min-h-screen flex flex-col items-center justify-center">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/problems" element={<ProblemLists />} />
              <Route path="/code/:slug" element={<CodeLayout />} />
              <Route element={<AuthenticatedRoute />}>
                <Route path="/interview/:id" element={
                  <Interview />
                } />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route element={<AuthenticatedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </main>
          <Toaster toastOptions={{
            style: {
              background: state.codeTheme === 'vs-dark' ? '#333' : '#fff',
              color: state.codeTheme === 'vs-dark' ? '#fff' : '#000',
            },
          }} />
        </TooltipProvider>
      </AuthProvider>
    </StrictModeProvider>
  );
}

export default App;