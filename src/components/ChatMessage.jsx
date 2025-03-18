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

  useEffect(() => {
    if (!isUser && typewriterRef.current) {
      typewriterRef.current.innerHTML = '';
      
      // Format special cases before typewriter
      const formattedMessage = message
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Add line break before numbers with spaces
        .replace(/\s(\d+)/g, '\n\n$1')
        // Handle text within curly braces
        .replace(/\{(.*?)\}/g, '<em>$1</em>')
        // Handle text within backticks
        .replace(/`(.*?)`/g, '<code class="text-blue-500">$1</code>')
        // Handle double hashtags
        .replace(/##\s(.*?)(?:\n|$)/g, '\n\n<h3 class="text-blue-400 font-bold">$1</h3>\n');
      
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
  }, [message, isUser]);

  const renderMessage = (text) => {
    if (isUser) {
      return text;
    }
    
    // Process special cases for markdown rendering
    const processedText = text
      // Add line break before numbers with spaces
      .replace(/\s(\d+)/g, '\n\n$1')
      // Handle text within curly braces
      .replace(/\{(.*?)\}/g, '_$1_')
      // Handle text within backticks
      .replace(/`(.*?)`/g, '`$1`')
      // Handle double hashtags (convert to markdown heading)
      .replace(/##\s(.*?)(?:\n|$)/g, '\n\n### $1\n');
    
    return (
      <ReactMarkdown
        components={{
          code: ({ node, inline, children }) => {
            if (inline) {
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
        <div className={`rounded-2xl px-4 py-4 shadow-md ${
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