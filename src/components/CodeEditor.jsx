"use client"

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import EditorToolbar from "./EditorToolbar";
import { useCode } from "../hooks/CodeContext.jsx";
import { ChevronDown } from "lucide-react";

const CodeEditor = () => {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const previousCodeRef = useRef("");
  const { code, setCode, defaultCode } = useCode();
  const editorRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotification(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // This effect will run whenever 'code' changes
  useEffect(() => {
    console.log("Code state changed:", code?.substring(0, 50) + "...");
    
    if (code !== previousCodeRef.current && code !== defaultCode) {
      setShowNotification(true);
      
      // Ensure the editor gets updated with the new code
      if (editorRef.current && code) {
        if (!isTyping) {
          startTypingAnimation();
        }
      }
    }
  }, [code, defaultCode]);

  const startTypingAnimation = () => {
    if (!code || code === previousCodeRef.current) return;
    
    let currentCode = "";
    const codeToType = code;
    let index = 0;

    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (index < codeToType.length) {
        currentCode += codeToType.charAt(index);
        if (editorRef.current) {
          editorRef.current.setValue(currentCode);
          const lineCount = editorRef.current.getModel().getLineCount();
          editorRef.current.revealLine(lineCount);
        }
        index++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
        previousCodeRef.current = codeToType;
      }
    }, 10);

    return () => clearInterval(typeInterval);
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
    if (code) {
      editor.setValue(code);
      previousCodeRef.current = code;
    }
  };

  const handleEditorChange = (value) => {
    if (!isTyping) {
      setCode(value || "");
      previousCodeRef.current = value || "";
    }
  };

  return (
    <div className="relative h-full w-full">
      {showNotification && (
        <div
          ref={notificationRef}
          className="absolute top-5 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-lg opacity-50"></div>
          <div className="bg-blue-900 text-white px-3 py-1 rounded-lg shadow-lg flex flex-row items-center justify-center relative">
            <span className="text-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path
                  fillRule="evenodd"
                  d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5Z"
                  clipRule="evenodd"
                ></path>
              </svg>
              Secondmemory is thinking...
            </span>
          </div>
          <div className="absolute left-1/2 -bottom-4 transform -translate-x-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="size-6">
              <path d="M12 14l-6-6h12l-6 6z" />
            </svg>
          </div>
        </div>
      )}
      <div className="h-full w-full bg-gradient-to-b from-[#1C1C1C] to-[#0F1117] flex flex-col rounded-xl overflow-hidden">
        <EditorToolbar onFileUpload={(content) => setCode(content)} onClear={() => setCode(defaultCode)} />
        <div className="flex-1 rounded-xl overflow-hidden">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            value={code || defaultCode}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 20 },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
              readOnly: false,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;