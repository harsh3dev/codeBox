import React, { createContext, useContext, useReducer, ReactNode } from 'react';

type CodeTheme = 'vs-dark' | 'vs-light';

interface State {
  codeTheme: CodeTheme;
}

type Action = { type: 'SET_CODE_THEME'; payload: CodeTheme }

const initialState: State = {
  codeTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'vs-dark' : 'vs-light',
};

const EditorModeContext = createContext<
  | {
      state: State;
      dispatch: React.Dispatch<Action>;
    }
  | undefined
>(undefined);

function editorModeReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CODE_THEME':
      return { ...state, codeTheme: action.payload };
    default:
      return state;
  }
}

export function EditorModeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorModeReducer, initialState);

  return (
    <EditorModeContext.Provider value={{ state, dispatch }}>{children}</EditorModeContext.Provider>
  );
}

export function useEditorMode() {
  const context = useContext(EditorModeContext);
  if (context === undefined) {
    throw new Error('useEditorMode must be used within a EditorModeProvider');
  }
  return context;
}
