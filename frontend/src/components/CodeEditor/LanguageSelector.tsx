import { LANGUAGE_TYPE } from "@/lib/constants";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface LanguageSelectorProps {
    languages: LANGUAGE_TYPE[];
    currentLanguage: LANGUAGE_TYPE;
    setCurrentLanguage: (language: LANGUAGE_TYPE) => void;
}

export default function LanguageSelector({ languages, currentLanguage, setCurrentLanguage }: LanguageSelectorProps) {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState<number>(-1); // Start with -1 for no focus
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleOpenSelect = () => {
        setIsSelectOpen((prev) => !prev);
        setFocusedIndex(-1); // Reset focus when opening or closing
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
        if (!isSelectOpen) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault();
                setFocusedIndex((prevIndex) => (prevIndex + 1) % languages.length); // Loop back to the top
                break;
            case "ArrowUp":
                event.preventDefault();
                setFocusedIndex((prevIndex) =>
                    prevIndex === -1 || prevIndex === 0 ? languages.length - 1 : prevIndex - 1
                ); // Loop to the bottom
                break;
            case "Enter":
                if (focusedIndex !== -1) {
                    setCurrentLanguage(languages[focusedIndex]);
                    setIsSelectOpen(false);
                }
                break;
            case "Escape":
                setIsSelectOpen(false);
                break;
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsSelectOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isSelectOpen && focusedIndex !== -1) {
            const items = dropdownRef.current?.querySelectorAll<HTMLButtonElement>("button");
            items?.[focusedIndex]?.focus();
        }
    }, [focusedIndex, isSelectOpen]);

    return (
        <div
            ref={dropdownRef}
            className="relative h-full w-fit flex flex-col items-start justify-start text-sm text-slate-800 dark:text-slate-300 z-50"
        >
            <button
                ref={buttonRef}
                onClick={handleOpenSelect}
                onKeyDown={handleKeyDown}
                aria-haspopup="listbox"
                aria-expanded={isSelectOpen}
                className="group inset-0 h-full w-full flex items-center justify-between gap-2"
            >
                {currentLanguage.name}
                {isSelectOpen ? (
                    <ChevronUp size={20} className="group-hover:scale-110 transition-transform" />
                ) : (
                    <ChevronDown size={20} className="group-hover:scale-110 transition-transform" />
                )}
            </button>
            {isSelectOpen && (
                <div
                    role="listbox"
                    aria-labelledby="language-selector"
                    tabIndex={-1}
                    onKeyDown={handleKeyDown}
                    className="absolute top-10 left-0 w-fit min-w-40 h-fit rounded-lg outline-primary flex flex-col justify-normal items-start bg-neutral-200 dark:bg-neutral-800 backdrop-blur-xl transition-all ease-linear duration-300 text-primary text-base"
                >
                    {languages.map((language, index) => (
                        <button
                            key={language.name}
                            role="option"
                            aria-selected={currentLanguage.name === language.name}
                            onClick={() => {
                                setCurrentLanguage(language);
                                localStorage.setItem("language",language.symbol.toLowerCase())
                                setIsSelectOpen(false);
                            }}
                            onFocus={() => setFocusedIndex(index)}
                            className={`h-10 w-full flex items-center justify-start px-4 gap-2 transition-colors font-semibold text-black dark:text-white hover:bg-sky-200 dark:hover:bg-gray-800 hover:text-blue-800 dark:hover:text-sky-300 ${
                                focusedIndex === index ? "bg-sky-200 dark:bg-gray-800" : ""
                            }`}
                        >
                            {currentLanguage.name === language.name && (
                                <Check size={16} className="text-blue-600 dark:text-sky-300" />
                            )}
                            {language.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
