import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig.js";
import {
  MessageSquare,
  Terminal,
  LogOut,
  Link,
  Plus,
  History, 
  Chrome,
  X,
  Loader2
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
// import { useClerk } from '@clerk/clerk-react';
import axios from 'axios';

// Simple URL validation function
const isValidUrl = (urlString) => {
  try {
    return Boolean(new URL(urlString));
  } catch(e) {
    return false;
  }
};

const handleSignOut = async () => {
  try {
    await signOut(auth);
        console.log("User Signed Out")
  } catch (error) {
    console.log("Error signing out", error);  
  }
};

const ChatHistoryItem = ({ title }) => (
  <div className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-lg cursor-pointer transition-all duration-200 group">
    <History className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
    <span className="text-sm font-medium truncate group-hover:text-gray-300 transition-colors">
      {title.length > 18 ? title.substring(0, 23) + "..." : title}
    </span>
  </div>
);

const Sidebar = ({ isOpen, onClose }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  // const { signOut } = useClerk();

  // Close sidebar on route change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);

  // Fetch chat history from Firebase every 10 seconds
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(
          'https://secondmemoryai-default-rtdb.firebaseio.com/userChatHistory.json'
        );
        if (response.data) {
          // Assuming the data is an object with keys, convert it to an array
          const chats = Object.values(response.data);
          setChatHistory(chats);
        } else {
          setChatHistory([]);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    // Fetch immediately on mount
    fetchChatHistory();

    // Set interval to fetch every 10 seconds
    const intervalId = setInterval(() => {
      fetchChatHistory();
    }, 10000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleClick = () => {
    navigate('/talktocode');
  };

  const sendWebData = async (e) => {
    e.preventDefault();


    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Start loading state
    setIsLoading(true);
    const loadingToastId = toast.loading("Processing website...", {
      duration: 10000, // 10 seconds timeout
      style: {
        background: '#333',
        color: '#fff',
      }
    });

    try {
      // First, show chunking toast
      toast.loading("Creating semantic chunks...", {
        id: 'chunk-toast',
        duration: 10000,
        style: {
          background: '#333',
          color: '#fff',
        }
      });

      const options = {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: [url],
          chunk_size: 512,  // Optional: customize chunk size
          overlap: 50       // Optional: customize overlap
        })
      };

      const res = await fetch(
        'https://secondmemory-ai-multisourcerag.onrender.com/process-websites/', 
        options
      );

      const data = await res.json();

      // Clear the chunking toast
      toast.dismiss('chunk-toast');

      if (res.ok) {
        // Successful processing
        toast.success(`Added ${data.processed_urls.length} website(s) to Knowledge Base`, {
          id: loadingToastId,
          duration: 3000,
          style: {
            background: '#4BB543',
            color: '#fff',
          }
        });
      } else {
        // Handle error case
        toast.error("Failed to process website", {
          id: loadingToastId
        });
      }
    } catch (error) {
      console.error("Error processing website:", error);
      toast.error("An error occurred", {
        id: loadingToastId
      });
    } finally {
      setIsLoading(false);
      setUrl('');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate('/');
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out");
    }
  };


  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-70 h-screen 
        bg-gradient-to-b from-gray-900 to-black border-r border-gray-800/50 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Close button for mobile */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 flex flex-col min-h-0">
          {/* Header Section */}
          <div className="p-6 space-y-6">
            <div className='flex flex-row gap-2'>
             



            <button
  onClick={() => window.open('https://github.com/pratyushdev-codes/SecondMemory.ai_Extension', '_blank')}
  className="w-full flex items-center justify-center gap-2 text-ascent-1 p-2 px-3 bg-gray-900/80 border border-gray-700 rounded-full backdrop-blur-sm text-[#409DDB]"
>
  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#409DDB">
    <path d="M439-82q-76-8-141.5-42.5t-113.5-88Q136-266 108.5-335T81-481q0-155 102.5-268.5T440-880v80q-121 17-200 107.5T161-481q0 121 79 211.5T439-162v80Zm40-198L278-482l57-57 104 104v-245h80v245l103-103 57 58-200 200Zm40 198v-80q43-6 82.5-23t73.5-43l58 58q-47 37-101 59.5T519-82Zm158-652q-35-26-74.5-43T520-800v-80q59 6 113 28.5T733-792l-56 58Zm112 506-56-57q26-34 42-73.5t22-82.5h82q-8 59-30 113.5T789-228Zm8-293q-6-43-22-82.5T733-677l56-57q38 45 61 99.5T879-521h-82Z" />
  </svg>
  Download Extension
</button>
            </div>

            <h1 className="text-lg font-semibold text-gray-400 px-2" style={{
              background: "linear-gradient(to bottom, #6b7280, white)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>AI Assistants</h1>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-blue-700 text-gray-300 rounded-xl transition-all duration-200" onClick={() => window.location.reload(false)}>
                <MessageSquare className="w-5 h-5" />
                <span className="font-medium">New Chat</span>
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800/50 hover:bg-gray-800 text-gray-300 rounded-xl transition-all duration-200" onClick={handleClick}>
                <Terminal className="w-5 h-5" />
                <span className="font-medium">Code Assistant</span>
              </button>
            </div>

            {/* URL Input Form */}
            <form onSubmit={sendWebData} className="space-y-4">
              <h1 className="text-lg font-semibold text-gray-400 px-2" style={{
                background: "linear-gradient(to bottom, #6b7280, white)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Memory Bank</h1>
              <div className="space-y-3">
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter website URL"
                    className="w-full bg-gray-800/30 border border-gray-700 rounded-xl text-gray-300 pl-11 pr-4 py-2.5 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                </div>
                <button
                  type="submit"
                  className={`
                    w-full flex items-center justify-center gap-2 
                    rounded-xl text-gray-300 py-2.5 transition-all duration-200
                    ${isLoading 
                      ? 'bg-gray-700 cursor-not-allowed' 
                      : 'bg-gray-800/50 hover:bg-gray-800'
                    }
                  `}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="font-medium">Processing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="font-medium">Add to Memory</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Recent Chats - Scrollable Area */}
          <div className="flex-1 overflow-y-auto overflow-x-auto px-4 py-6 scrollbar-invisible">
            <h1 className="text-lg font-semibold text-gray-400 px-2 mb-4" style={{
              background: "linear-gradient(to bottom, #6b7280, white)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>Recent Chats</h1>
            <div className="space-y-1 scrollbar-invisible">
              {chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  // Assuming each chat is an object with a "summary" property.
                  <ChatHistoryItem key={index} title={chat.summary} />
                ))
              ) : (
                <p className="text-gray-500 text-sm">No recent chats available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Always visible at bottom */}
        <div className="p-4 border-t border-gray-800/50 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-white/5 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 group-hover:text-red-400 transition-colors" />
            <span className="font-medium group-hover:text-gray-300 transition-colors">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;