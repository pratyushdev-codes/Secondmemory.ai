import React, { useRef, useEffect, useContext } from 'react';
import { Bot } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import Typewriter from 'typewriter-effect/dist/core';
import ReactMarkdown from 'react-markdown';
import logo from "../../public/images/supermemoryailogo.svg";
import { useCode } from '../hooks/CodeContext.jsx';

const ChatMessage = ({ message, isUser }) => {
  const { setCode } = useCode();
  const { user } = useUser();
  const typewriterRef = useRef(null);

  // Function to extract code blocks
  const extractCode = (text) => {
    // First, check for code blocks with triple backticks
    const tripleBacktickRegex = /```(?:\w+)?\s*([\s\S]+?)```/g;
    let tripleMatch;
    
    while ((tripleMatch = tripleBacktickRegex.exec(text)) !== null) {
      const codeContent = tripleMatch[1].trim();
      if (codeContent && codeContent.length > 0) {
        // Use timeout to ensure typing effect starts after message is displayed
        setTimeout(() => setCode(codeContent), 500);
        return; // Use the first match
      }
    }
    // First, try to match the format: `language code`
    const languageCodeRegex = /`(python|java|c\+|c|javascript|rust)\s+([\s\S]+?)`/g;
    let match;
    
    while ((match = languageCodeRegex.exec(text)) !== null) {
      const code = match[2].trim();
      if (code && code.length > 0) {
        setTimeout(() => setCode(code), 500);
        return;
      }
    }
    
    // Check for just language names in backticks
    const languageNameRegex = /`(python|java|c\+\+|c|javascript|rust)`/g;
    let langMatch;
    
    while ((langMatch = languageNameRegex.exec(text)) !== null) {
      const language = langMatch[1].trim();
      if (language && language.length > 0) {
        // Set the code editor with just the language name or a template
        setTimeout(() => setCode(`// ${language} code editor activated`), 500);
        return;
      }
    }
    
    const codeRegex = /`([^`]+)`/g;
    const matches = text.match(codeRegex);
    if (matches && matches.length > 0) {
      // Get the last code block without the backticks
      const lastCode = matches[matches.length - 1].replace(/`/g, '').trim();
      if (lastCode && lastCode.length > 0) {
        setTimeout(() => setCode(lastCode), 500);
      }
    }
  };

  useEffect(() => {
    if (!isUser && typewriterRef.current) {
      typewriterRef.current.innerHTML = '';
      
      // Extract and set code blocks
      extractCode(message);
      
      // Format special cases before typewriter
      let formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Add line break before numbers with spaces
        .replace(/\s(\d+)/g, '\n\n$1')
        // Handle text within curly braces
        .replace(/\{(.*?)\}/g, '<em>$1</em>');
      
      // Handle parentheses with backticks (e.g. "(`text`)")
      formattedMessage = formattedMessage.replace(
        /\((`[^`]+`)\)/g, 
        '<span class="text-blue-400">($1)</span>'
      );
      
      // Handle text within backticks with special case for "# text"
      formattedMessage = formattedMessage.replace(
        /`(# [^`]+)`/g, 
        '<code class="text-blue-400 font-bold">$1</code>'
      );
      
      // Handle normal backtick content
      formattedMessage = formattedMessage.replace(
        /`([^`]+)`/g, 
        '<code class="text-blue-500">$1</code>'
      );
      
      // Handle double hashtags
      formattedMessage = formattedMessage.replace(
        /##\s(.*?)(?:\n|$)/g, 
        '\n\n<h3 class="text-blue-400 font-bold">$1</h3>\n'
      );
      
      const typewriter = new Typewriter(typewriterRef.current, {
        loop: false,
        delay: 10,
        autoStart: true,
        html: true
      });
      
      typewriter
        .typeString(formattedMessage)
        .callFunction(() => {
          const cursor = typewriterRef.current.querySelector('.Typewriter__cursor');
          if (cursor) {
            cursor.style.display = 'none';
          }
        })
        .start();
    }
  }, [message, isUser, setCode]);

  // Helper function to process text without ReactMarkdown
  const processText = (text) => {
    // Replace parentheses with backticks pattern with styled spans
    const processedText = text.replace(
      /\((`[^`]+`)\)/g,
      (match, codeContent) => {
        return `<span class="text-blue-400">(${codeContent})</span>`;
      }
    );
    
    return processedText;
  };

  const renderMessage = (text) => {
    if (isUser) {
      return text;
    }
    
    // Extract and set code blocks
    extractCode(text);
    
    // Process special cases for markdown rendering
    const processedText = text
      // Add line break before numbers with spaces
      .replace(/\s(\d+)/g, '\n\n$1')
      // Handle text within curly braces
      .replace(/\{(.*?)\}/g, '_$1_')
      // Handle special heading format
      .replace(/# ([^\n]+)(?:\n|$)/g, '<span class="text-blue-400 font-bold">$1</span>')
      // Handle double hashtags (convert to markdown heading)
      .replace(/##\s(.*?)(?:\n|$)/g, '\n\n### $1\n');
    
    return (
      <ReactMarkdown
        components={{
          code: ({ node, inline, children }) => {
            if (inline) {
              // Check if content starts with "# " for special styling
              const content = String(children);
              if (content.startsWith('# ')) {
                return <code className="text-blue-400 font-bold">{children}</code>;
              }
              
              // Get the original string from the source text
              const originalText = node.position?.start ? 
                text.substring(
                  Math.max(0, node.position.start.offset - 5),
                  Math.min(text.length, node.position.end.offset + 5)
                ) : '';
              
              // Check if this code is within parentheses
              if (originalText.match(/\([^)]*`[^`]*`[^)]*\)/)) {
                return <code className="text-blue-400">{children}</code>;
              }
              
              return <code className="text-blue-500">{children}</code>;
            }
            return (
              <pre className="bg-gray-800/50 p-4 rounded-lg overflow-x-auto">
                <code>{children}</code>
              </pre>
            );
          },
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic text-blue-300">{children}</em>,
          h3: ({ children }) => <h3 className="text-blue-400 font-bold my-4">{children}</h3>
        }}
      >
        {processedText}
      </ReactMarkdown>
    );
  };

  return (
    <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''} mb-6`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
          : 'bg-black'
      } shadow-lg ring-2 ring-gray-800/50`}>
        {isUser ? (
          user?.profileImageUrl ? (
            <img 
              className="w-10 h-10 rounded-full" 
              src={user.profileImageUrl} 
              alt="User Profile"
            />
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white">
              {user?.firstName?.[0] || '?'}
            </div>
          )
        ) : (
          <img 
            className="w-8 h-8 rounded-full opacity-60" 
            src="../../public/images/AIAvatar.png" 
            alt="AI Avatar"
          />
        )}
      </div>
      <div className={`group relative max-w-[90%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-2 shadow-md ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl' 
            : 'border border-gray-600 p-6 rounded-3xl text-gray-100'
        }`}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {isUser ? message : <span ref={typewriterRef}>{renderMessage(message)}</span>}
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export default ChatMessage;