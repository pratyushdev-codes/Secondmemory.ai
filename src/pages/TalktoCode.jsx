import React, { useState } from 'react';
import CodeChat from '../components/CodeChat';
import CodeEditor from '../components/CodeEditor';
import { Terminal, ShieldAlert } from 'lucide-react';
import logo from '../../public/images/supermemoryailogo.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../public/images/3.jpg';
function TalktoCode() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [code, setCode] = useState(`// Upload or Paste your Code here
function example() {
  console.log("Hello, World!");
}`);

// Handle file upload
  const handleFileUpload = (content) => setCode(content);

// Handle clear
  const handleClear = () => setCode('');

// Navigate to chat
  const handleChatClick = () => navigate('/Chat');

// Submit repository URL
  const handleSubmitRepo = (e) => {
    e.preventDefault();
    console.log('Repository URL:', repoUrl);
    setIsModalOpen(false);
    setRepoUrl('');
  };

// Send code to API for analysis
  const AgenticAIAPIsendCode = async (code) => {
    try {
      const response = await axios.post('https://your-api-url/code', { code, query: "Analyze this code" });
      return response.data;
    } catch (error) {
      console.error('Error sending code:', error);
      return { details: 'Error analyzing code' };
    }
  };

// Send user query to API
  const AgenticAIAPIsendQuery = async (userQuery) => {
    try {
      const response = await axios.post(
        'https://f0ty8t8j18.execute-api.us-east-1.amazonaws.com/default/codegen_agentiai_secondmemory', 
        { query: userQuery, code: code }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending query:', error);
      return { details: 'Error fetching response' };
    }
  };

// Analyze code based on user query
  const handleCodeAnalysis = async (query) => {
    try {
      return await AgenticAIAPIsendQuery(query);
    } catch (error) {
      console.error('Error analyzing code:', error);
      return { details: 'Error analyzing code' };
    }
  };

// Send request to API for explanation
  const handleSendToAPI = async () => {
    try {
      const response = await AgenticAIAPIsendCode(code);
      console.log('API Response:', response);
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat hidden lg:block">
      <div className="flex flex-col lg:flex-row h-screen text-gray-100 p-4 lg:p-8 gap-3">
        {/* Left Section - Chat */}
        <div className="w-1/3 flex flex-col gap-4 h-full relative">
          <div className="relative">
            <p
              className="text-4xl px-3 shadow-lg flex items-center"
              style={{
                background: "linear-gradient(to bottom, #6b7280, #a2a2a2)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Select codebase <ShieldAlert className="w-6 h-6 text-gray-400 ml-2" />
            </p>
            {isHovered && (
              <div className="absolute left-0 top-full mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 w-[300px]">
                <p>Codebase will automatically be deleted after 10 mins due to Compute Costs.</p>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="h-full rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm bg-black border border-gray-700/50">
            <div className="h-full flex flex-col">
              <div className="bg-gradient-to-b from-black to-gray-900 border-gray-800/50 opacity-85 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                <CodeChat
                  messages={chatHistory}
                  onSendMessage={async (userQuery) => {
                    setChatHistory(prev => [...prev, { text: userQuery, isUser: true }]);
                    const response = await handleCodeAnalysis(userQuery);
                    setChatHistory(prev => [...prev, { text: response.details, isUser: false }]);
                    return response;
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Code & Header */}
        <div className="flex-1 bg-cover bg-center flex flex-col space-y-6 rounded-3xl p-3" style={{ backgroundImage: `url(${backgroundImage})` }}>
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-light text-transparent bg-gradient-to-r from-[#3398DB] via-[#DDE6E8] to-[#DDE6E8] bg-clip-text">
              Chat with Your Codebase.
            </h1>
            <p className="text-gray-300 text-base lg:text-lg">
              Deeply integrated, context-aware AI assistance.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-4">
                {/* Talk to Code Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm">
                  <img src={logo} alt="Logo" className="h-5" />
                  <span className="text-gray-300">/</span>
                  <Terminal size={18} className="text-blue-400" />
                  <span className="text-gray-300">Talk to Code</span>
                </div>

                {/* Date Badge */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#D9D9D9"
                  >
                    <path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                  </svg>
                  <span className="text-gray-300">
                    {new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>


              {/* Chat Button */}
              <button className="relative group w-full lg:w-auto" onClick={handleChatClick}>
                <div className="absolute transition-all duration-300 opacity-50 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-full blur-lg group-hover:opacity-100 group-hover:-inset-1"></div>
                <span className="relative flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-900 text-gray-300 rounded-full hover:text-white transition-colors w-full lg:w-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#D9D9D9"
                  >
                    <path d="M880-80 720-240H320q-33 0-56.5-23.5T240-320v-40h440q33 0 56.5-23.5T760-440v-280h40q33 0 56.5 23.5T880-640v560ZM160-473l47-47h393v-280H160v327ZM80-280v-520q0-33 23.5-56.5T160-880h440q33 0 56.5 23.5T680-800v280q0 33-23.5 56.5T600-440H240L80-280Zm80-240v-280 280Z" />
                  </svg>
                  Chat
                </span>
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <CodeEditor code={code} onFileUpload={handleFileUpload} onClear={handleClear} />
        </div>
      </div>
    </div>
  );
}

export default TalktoCode;




// Code Ai Agent API URL :- https://secondmemory-ai-codegenagent.onrender.com/code

// Code QNA Backedn API https://secondmemory-ai-codeqa.onrender.com/query