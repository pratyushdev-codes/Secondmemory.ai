import React, { useState } from 'react';

import ChatMessageMain from './ChatMessageMain';
import { useChatHandler } from '../hooks/useChatHandler';
import { File, Globe, PlusCircle as CirclePlus } from 'lucide-react';
import axios from 'axios';
import WebYTSearch from '../pages/WebYTSearch';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out" />
      <div
        className="relative bg-black rounded-lg p-6 max-w-lg w-full mx-4 transform transition-all duration-300 ease-in-out scale-100 opacity-100 border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

const LoadingMessage = () => (
  <div className="flex items-end gap-2">
    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"> 
      <img className="w-8 h-8 rounded-full opacity-60" src="/images/AIAvatar.png" alt="AI Avatar"/>
    </div>
    <div className="bg-gradient-to-r from-slate-900 to-gray-800 rounded-2xl px-4 py-2">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const ChatUI = ({ onSendMessage }) => {
  const { handleNewChat } = useChatHandler();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState('');
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [autoSearchEnabled, setAutoSearchEnabled] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "I'll analyze your Knowledge Base and help you understand it better. What specific aspects would you like to explore? For better experience select the Knowledge source.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const chatResponse = async (message) => {
    try {
      const response = await axios.post(
        "https://secondmemory-ai-multisourcerag.onrender.com/ask/",
        {
          question: message
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      return JSON.stringify(response.data);
    } catch (error) {
      console.error('Error getting response:', error);
      return 'Sorry, I encountered an error processing your request.';
    }
  };

  const summarizeUserChat = async (messageText) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClrQpl5bYxO3FpG5AfW6peJVna2D75U3Y`,
        {
          contents: [{
            parts: [{
              text: "This is the User prompt asked in my Chatbot, rephrase and shorten this prompt to 2-3 words (just make one response only, don't generate 2-3 options) , so that can save it to my User Chat History Database:" + messageText
            }]
          }]
        }
      );
      const summary = response.data.candidates[0].content.parts[0].text;
      setHistory(summary);
      return summary;
    } catch (error) {
      console.error("Error fetching User Chat History from API:", error.message);
      const errorSummary = "Sorry, something went wrong. Please try again!";
      setHistory(errorSummary);
      return errorSummary;
    }
  };

  const summarizeforgoogleSearch = async (messageText) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyClrQpl5bYxO3FpG5AfW6peJVna2D75U3Y`,
        {
          contents: [{
            parts: [{
              text: "This is a response from my server, just and shorten and generalize this response, so that the user can search it on Google for the perfect reference:" + messageText
            }]
          }]
        }
      );
      const summarygoogleChat = response.data.candidates[0].content.parts[0].text;
      console.log("Search query generated:", summarygoogleChat);
      setSearchQuery(summarygoogleChat);
      return summarygoogleChat;
    } catch (error) {
      console.error("Error fetching search summary from API:", error.message);
      return messageText; // Fall back to original message if summarization fails
    }
  };
  
  const sendUserchatHistory = async (summary) => {
    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ summary })
    };

    try {
      const res = await fetch('https://secondmemoryai-default-rtdb.firebaseio.com/userChatHistory.json', options);
      if (res.ok) {
        console.log("User Chat history Data dispatched to DB");
      } else {
        console.error("Error occurred while saving Chat History details to DB", res.statusText);
      }
    } catch (error) {
      console.error("Network error while saving chat history details to DB", error);
    }
  };


const handleSend = async (e) => {
  e.preventDefault();
  
  if (!newMessage.trim() || isLoading) return;
  
  let messageToSend = newMessage;
  
  if (activeButton === 'file') {
    messageToSend = "Answer to the user query from the uploaded PDFs: " + newMessage;
  } else if (activeButton === 'globe') {
    messageToSend = "Answer to the user query from uploaded Website source: " + newMessage;
  }

  setIsLoading(true);

  try {
    if (!firstMessageSent) {
      const summary = await summarizeUserChat(messageToSend);
      await sendUserchatHistory(summary);
      setFirstMessageSent(true);
    }

    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    handleNewChat();

    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    // Get AI response first
    const aiResponseText = await chatResponse(messageToSend);
    
    // Then generate search query based on the response
    const searchQueryText = await summarizeforgoogleSearch(aiResponseText);
    setSearchQuery(searchQueryText); // This will trigger the search in WebYTSearch component
    
    const aiMessage = {
      id: messages.length + 2,
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, aiMessage]);
    setActiveButton(null);
    
  } catch (error) {
    console.error('Error in handleSend:', error);
    const errorMessage = {
      id: messages.length + 2,
      text: "I apologize, but I encountered an error while processing your request. Please try again.",
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};


  const handleButtonClick = (buttonName) => {
    setActiveButton(activeButton === buttonName ? null : buttonName);
  };

  return (
    
    <div className="flex flex-col h-full">


      <div className="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-invisible">
      <WebYTSearch initialQuery={searchQuery} autoSearch={autoSearchEnabled} />
        {messages.map((message) => (
          <ChatMessageMain
            key={message.id}
            message={message}
       
          />
        ))}
        {isLoading && <LoadingMessage />}
      </div>

      <div className="p-4">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 bg-transparent border border-gray-500 rounded-full text-gray-300 transition-colors"
            onClick={() => window.location.reload()}
          >
            <CirclePlus className="h-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask Secondmemory..."
            className="flex-1 bg-transparent text-gray-300 rounded-full px-4 py-2 border border-gray-500"
            disabled={isLoading}
          />

          <button
            type="button"
            className={`py-2 px-3 bg-transparent border rounded-full text-gray-300 transition-colors ${
              autoSearchEnabled ? 'border-blue-400 bg-blue-900/30' : 'border-gray-500'
            }`}
            onClick={() => setAutoSearchEnabled(!autoSearchEnabled)}
            title={autoSearchEnabled ? "Auto-search enabled" : "Auto-search disabled"}
          >
            Source
          </button>
          
          <button
            type="button"
            className={`py-2 px-3 bg-transparent border rounded-full text-gray-300 transition-colors ${
              activeButton === 'file' ? 'border-blue-400 bg-blue-900/30' : 'border-gray-500'
            }`}
            onClick={() => handleButtonClick('file')}
          >
            <File className="h-5" />
          </button>

          <button
            type="button"
            className={`py-2 px-3 bg-transparent border rounded-full text-gray-300 transition-colors ${
              activeButton === 'globe' ? 'border-blue-400 bg-blue-900/30' : 'border-gray-500'
            }`}
            onClick={() => handleButtonClick('globe')}
          >
            <Globe className='h-5' />
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <div className="bg-blue-600 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="size-5">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        </form>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-gray-200 transition-delay-1500 bg-black">
          <h2 className="text-xl font-normal mb-4">Speak Now</h2>
          <div className="space-y-4">
            <img src="./images/AI Voice.gif" alt="Voice Assistant" className="w-full rounded-lg h-[180px]" />
            <button
              className="w-full bg-none hover:bg-gray-700 border border-gray-500 text-white font-medium py-2 px-4 rounded-2xl transition-colors"
              onClick={() => {
                console.log('Start recording');
              }}
            >
              Send
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatUI;