import React, { useState } from 'react';
import { useClerk } from '@clerk/clerk-react';
import ChatMessageMain from './ChatMessageMain';
import { useChatHandler } from '../hooks/useChatHandler';
import { File } from 'lucide-react';
import axios from 'axios';

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

const ChatUI = ({ onSendMessage }) => {
  const { handleNewChat } = useChatHandler();
  const { user } = useClerk();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState('');
  const [firstMessageSent, setFirstMessageSent] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can I help you today?",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 2,
      text: "I'll analyze your Knowledge Base and help you understand it better. What specific aspects would you like to explore? For better experience select the Knowledge source.",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const chatResponse = async (message) => {
    try {
      const response = await axios.post(
        "https://1jxc2ie9a6.execute-api.us-east-1.amazonaws.com/default/secondmemory_rag_2",
        {
          chat: message
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

  // Modified to return the summary for the first user message
  const summarizeUserChat = async (messageText) => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyClrQpl5bYxO3FpG5AfW6peJVna2D75U3Y`,
        {
          contents: [{
            parts: [{
              text: "This is the User prompt asked in my Chatbot, rephrase and shorten this prompt, so that can save it to my User Chat History Database:" + messageText
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

  // Modified to accept a summary parameter
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
    if (newMessage.trim()) {
      // Process first message: summarize and save to Firebase
      if (!firstMessageSent) {
        const summary = await summarizeUserChat(newMessage);
        await sendUserchatHistory(summary);
        setFirstMessageSent(true);
      }

      // Add the user message
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

      // Show loading state while fetching AI response
      setIsLoading(true);
      try {
        const aiResponseText = await chatResponse(newMessage);
        const aiMessage = {
          id: messages.length + 2,
          text: aiResponseText,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
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
    }
  };

  const handleButtonClick = (buttonName) => {
    setActiveButton(activeButton === buttonName ? null : buttonName);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessageMain 
            key={message.id} 
            message={message} 
            userImage={user?.imageUrl}
          />
        ))}
        {isLoading && (
          <div className="text-gray-400 italic">Secondmemory is thinking...</div>
        )}
      </div>

      <div className="p-4">
        <div className='gap-2 flex flex-row'>
          <button className='px-4 py-1 bg-transparent rounded-full backdrop-blur-lg text-blue-400'>Source</button>
          <button 
            className={`px-3 py-1 bg-transparent border rounded-full text-gray-300 transition-colors ${
              activeButton === 'file' ? 'border-blue-400' : 'border-gray-500'
            }`}
            onClick={() => handleButtonClick('file')}
          >
            <File className="h-5"/>
          </button>
          <button 
            className={`px-3 py-1 bg-transparent border rounded-full text-gray-300 transition-colors ${
              activeButton === 'globe' ? 'border-blue-400' : 'border-gray-500'
            }`}
            onClick={() => handleButtonClick('globe')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
              <path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z"/>
            </svg>
          </button>
        </div>
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask your query..."
            className="flex-1 bg-transparent text-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            <div className="bg-gray-900 rounded-full p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd"></path>
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
