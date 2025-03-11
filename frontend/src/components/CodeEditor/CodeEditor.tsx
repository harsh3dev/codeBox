import { useEffect, useRef, useState } from "react";
import * as monaco from 'monaco-editor';
import Editor from '@monaco-editor/react';
import { useEditorMode } from "@/context/editor-mode-context";
import CodeToolbar from "./CodeToolbar";
import { LANGUAGES } from "@/lib/constants";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "@/lib/credentials";

export interface Language {
  name: string;
  defaultCode: string;
  symbol: string;
}

export default function CodeEditor() {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(LANGUAGES[0]);
  const { state } = useEditorMode();
  const editorRef = useRef<any>(null);

  const { slug } = useParams();
  console.log(slug, "slug");

  const { id } = useParams<{ id: string }>();
  console.log(id);

  const [problem, setProblem] = useState<any>(null);

  useEffect(() => {
    const fetchProblemBySlug = async (slug: string) => {
      try {
        const response = await axios.get(`${API_URL}/problem/?slug=${slug}`);
        setProblem(response.data);
        LANGUAGES.forEach(language => {
          localStorage.setItem(`code_${language.symbol.toLowerCase()}`, response.data.default_code_templates[`${language.symbol.toLowerCase()}`]);
        });
        setCode(response.data.default_code_templates[`${currentLanguage.symbol.toLowerCase()}`]);
        localStorage.setItem('language', currentLanguage.symbol.toLowerCase());
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (!id && slug) {
      fetchProblemBySlug(slug);
    }
  }, [slug]);

  useEffect(() => {
    const fetchProblemById = async (id: string) => {
      try {
        const response = await axios.post(`${API_URL}/interview/question/`, { id });
        setProblem(response.data);
        LANGUAGES.forEach(language => {
          localStorage.setItem(`code_${language.symbol.toLowerCase()}`, response.data.default_code_templates[`${language.symbol.toLowerCase()}`]);
        });
        setCode(response.data.default_code_templates[`${currentLanguage.symbol.toLowerCase()}`]);
        localStorage.setItem('problemId', response.data.id);
        localStorage.setItem('language', currentLanguage.symbol.toLowerCase());
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    if (!slug && id) {
      fetchProblemById(id);
    }
    console.log(id);
  }, [id]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const [code, setCode] = useState<string>(problem ? problem.default_code_templates[`${currentLanguage.symbol.toLowerCase()}`] : currentLanguage.defaultCode);

  const handleCodeChange = (value: string | undefined) => {
    if (value) {
      setCode(value);
      localStorage.setItem(`code_${currentLanguage.symbol.toLowerCase()}`, value);
    }
  };

  useEffect(() => {
    const storedCode = localStorage.getItem(`code_${currentLanguage.symbol.toLowerCase()}`);
    if (storedCode) {
      setCode(storedCode);
    } else {
      setCode(currentLanguage.defaultCode);
    }
  }, [currentLanguage]);

  return (
    <div className="h-[100vh] flex flex-col justify-start items-start inset-0">
      <CodeToolbar
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        editorRef={editorRef}
      />

      <Editor
        height="100%"
        defaultLanguage={currentLanguage.symbol.toLowerCase() === 'py' ? 'python' : currentLanguage.symbol.toLowerCase()}
        defaultValue={code}
        language={currentLanguage.symbol.toLowerCase() === 'py' ? 'python' : currentLanguage.symbol.toLowerCase()}
        value={code}
        onChange={handleCodeChange}
        width="100%"
        theme={state.codeTheme}
        className="insert-0"
        options={{ ...state.editorOptions, lineNumbers: state.editorOptions.lineNumbers as monaco.editor.LineNumbersType }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
}