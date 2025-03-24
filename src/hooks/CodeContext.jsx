"use client"

import { createContext, useState, useContext, useEffect } from "react"

const CodeContext = createContext()

export function CodeProvider({ children }) {
  const [code, setCode] = useState("")
  const defaultCode = `// Upload or Paste your Code here
function example() {
  console.log("Hello, World!");
}`

  // Improved updateCode function that ensures state update
  const updateCode = (newCode) => {
    if (newCode && typeof newCode === 'string' && newCode.trim() !== '') {
      console.log("Updating code:", newCode.substring(0, 50) + "..."); // Log for debugging
      setCode(newCode);
    } else {
      console.warn("Invalid code update attempted");
    }
  };

  return (
    <CodeContext.Provider value={{ 
      code, 
      setCode, 
      updateCode, 
      defaultCode 
    }}>
      {children}
    </CodeContext.Provider>
  )
}

export function useCode() {
  const context = useContext(CodeContext);
  if (!context) {
    throw new Error("useCode must be used within a CodeProvider");
  }
  return context;
}