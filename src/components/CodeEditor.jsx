// CodeEditor.js
import React from 'react';
import Editor from '@monaco-editor/react';
import EditorToolbar from './EditorToolbar';
import { useCode } from '../hooks/CodeContext.jsx';

const CodeEditor = () => {
  const { code, setCode, defaultCode } = useCode();

  const handleFileUpload = (content) => {
    setCode(content);
  };

  const handleClear = () => {
    setCode(defaultCode);
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1C1C1C] to-[#0F1117] flex flex-col rounded-xl overflow-hidden">
      <EditorToolbar onFileUpload={handleFileUpload} onClear={handleClear} />
      <div className="flex-1 rounded-xl overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code || defaultCode}
          onChange={(value) => setCode(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            padding: { top: 20 },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;