import { currentLanguageType } from "./CodeEditor";
import LanguageSelector from "./LanguageSelector";
import { LANGUAGES } from "@/lib/constants";

interface CodeToolbarProps {
    currentLanguage: currentLanguageType;
    setCurrentLanguage: (language: currentLanguageType) => void;
}
export default function CodeToolbar({ currentLanguage, setCurrentLanguage } : CodeToolbarProps) {
  return (
    <div className='h-10 w-full bg-gray-100 dark:bg-neutral-900 flex items-center justify-between px-4'>
      <LanguageSelector 
        languages={LANGUAGES} 
        currentLanguage={currentLanguage} 
        setCurrentLanguage={setCurrentLanguage}
      />
    </div>
  )
}
