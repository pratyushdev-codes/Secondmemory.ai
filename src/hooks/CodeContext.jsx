// CodeContext.js
import React, { createContext, useState, useContext } from 'react';

const CodeContext = createContext();

export function CodeProvider({ children }) {
  const [code, setCode] = useState('');
  const defaultCode = `// Upload or Paste your Code here
function example() {
  console.log("Hello, World!");
}`;

  return (
    <CodeContext.Provider value={{ code, setCode, defaultCode }}>
      {children}
    </CodeContext.Provider>
  );
}

export function useCode() {
  return useContext(CodeContext);
}