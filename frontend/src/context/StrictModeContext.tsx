import React, { createContext, useContext, useState, ReactNode } from 'react';

type StrictModeContextType = {
  strictMode: boolean;
  toggleStrictMode: () => void;
};

const StrictModeContext = createContext<StrictModeContextType | undefined>(undefined);

export const StrictModeProvider = ({ children }: { children: ReactNode }) => {
  const [strictMode, setStrictMode] = useState<boolean>(false);

  const toggleStrictMode = () => {
    setStrictMode((prev) => !prev);
  };

  return (
    <StrictModeContext.Provider value={{ strictMode, toggleStrictMode }}>
      {children}
    </StrictModeContext.Provider>
  );
};

export const useStrictMode = () => {
  const context = useContext(StrictModeContext);
  if (!context) {
    throw new Error('useStrictMode must be used within a StrictModeProvider');
  }
  return context;
};
