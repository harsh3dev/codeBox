import { AlignLeft } from "lucide-react";
import { currentLanguageType } from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "@/lib/constants";
import { useEffect, useState } from "react";

interface CodeToolbarProps {
    currentLanguage: currentLanguageType;
    setCurrentLanguage: (language: currentLanguageType) => void;
    editorRef: any;
}
export default function CodeToolbar({ currentLanguage, setCurrentLanguage, editorRef } : CodeToolbarProps) {

  const [isFormatterAvailable, setIsFormatterAvailable] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const model = editorRef.current.getModel();
    const language = model?.getLanguageId();
    const hasFormatter = !!editorRef.current.getAction("editor.action.formatDocument");
    setIsFormatterAvailable(hasFormatter);
  }, [editorRef.current]);

  const handleFormatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <div className='h-10 w-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-between px-4'>
      <LanguageSelector 
        languages={LANGUAGES} 
        currentLanguage={currentLanguage} 
        setCurrentLanguage={setCurrentLanguage}
      />
      {/* {
        isFormatterAvailable && <button onClick={handleFormatCode} className='bg-gray-200 dark:bg-neutral-800/50 px-2 py-1 rounded-md'>
          <AlignLeft size={20} />
        </button>
      } */}
      {/* <button></button> */}
    </div>
  )
}
