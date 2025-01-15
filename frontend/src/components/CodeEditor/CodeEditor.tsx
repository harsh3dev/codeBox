import CodeToolbar from "./CodeToolbar";
import { useEffect, useState } from "react";
import { LANGUAGES } from "@/lib/constants";
import Editor from '@monaco-editor/react';
import { useEditorMode } from "@/context/editor-mode-context";

export type currentLanguageType = {
  name: string;
  defaultCode: string;
}
export default function CodeEditor() {
  const [currentLanguage, setCurrentLanguage] = useState<currentLanguageType>(LANGUAGES[0]);
  const { state } = useEditorMode();
  const [code, setCode] = useState<string>(LANGUAGES[0].defaultCode);

  useEffect(() => {
    setCode(currentLanguage.defaultCode);
  }, [currentLanguage])

  useEffect(() => { console.log(currentLanguage) }, [currentLanguage])
  return (
    <div className="h-[100vh] flex flex-col justify-start items-start inset-0">
      <CodeToolbar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
      />

      <Editor
        height="100%"
        defaultLanguage={currentLanguage.name === 'C++' ? 'cpp' : currentLanguage.name.toLowerCase()}
        defaultValue={currentLanguage.defaultCode}
        language={currentLanguage.name === 'C++' ? 'cpp' : currentLanguage.name.toLowerCase()}
        value={code}
        width={'100%'}
        theme={state.codeTheme}
        className="insert-0"
        options={{
          cursorStyle: "line",
          minimap: { enabled: false },
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
