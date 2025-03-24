import React, { useState, useRef } from 'react';
import axios from 'axios';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { AudioLines, Pause, Play, Github, FolderUp, X, Workflow, BrainCircuit } from 'lucide-react';
import { useCode } from '../hooks/CodeContext';

const LoadingMessage = () => (
  <div className="flex items-start space-x-4">
    <div className="w-8 h-8 rounded-full flex-shrink-0">
      <img
        className="w-8 h-8 rounded-full opacity-60"
        src="../../public/images/AIAvatar.png"
        alt="AI Avatar"
      />
    </div>
    <div className="flex-1 space-y-2">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 w-3/4 bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-1/2 bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);

const CodeChat = () => {
  const { code, updateCode } = useCode();
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI coding assistant. How can I help you today?", isUser: false }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [repoUrl, setRepoUrl] = useState('');
  const [githubConnected, setGithubConnected] = useState(false);
  const [codeContent, setCodeContent] = useState('');
  const [codeUploaded, setCodeUploaded] = useState(false);
  const fileInputRef = useRef(null);

  // API Function using async/await
  const sendSyntaxAnalysis = async (message) => {
    const url = "https://secondmemory-ai-codegenagent.onrender.com/syntax";
    
    const payload = {
      code: codeContent,
      query: message
    };
    
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Server response:", data);
      return data.details?.final_answer || "No answer received.";
    } catch (error) {
      console.error("Error making POST request:", error);
      return "Error processing syntax analysis.";
    }
  };
  
  const fetchGitHubRepoContent = async (repoUrl) => {
    try {
      // Convert repository URL to GitHub API endpoint
      const apiUrl = repoUrl
        .replace('github.com', 'api.github.com/repos')
        .replace(/\/$/, '') + '/contents'; // Remove trailing slash and add /contents
  
      const response = await axios.get(apiUrl);
      
      if (response.data) {
        // Create a file listing string
        const fileList = response.data
          .filter(item => item.type === "file") // Only get files
          .map(item => `📄 ${item.name}`)
          .join('\n');
  
        // Update code context with the file listing
        updateCode(`// Repository Contents:\n${fileList}`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error fetching GitHub content:', error);
      return false;
    }
  };
  const callRAGAgent = async (message) => {
    try {
      const response = await axios.post(
        "https://secondmemory-ai-codeqa-chromadb.onrender.com/query", 
        {
          github_url: repoUrl, 
          query: message
        }
      );
      
      return response.data.result;
    } catch (error) {
      console.error('RAG API error:', error);
      return "Sorry, I couldn't analyze the repository. Please check the URL and try again.";
    }
  };

  const handleSendMessage = async (message) => {
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    setIsLoading(true);

    try {
      let responseText;
      if (githubConnected) {
        responseText = await callRAGAgent(message);
      } else if (codeUploaded) {
        responseText = await sendSyntaxAnalysis(message);
      } else {
        responseText = "Please connect a GitHub repository or upload code first.";
      }

      setMessages(prev => [...prev, { text: responseText, isUser: false }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          text: "Sorry, I encountered an error processing your request.",
          isUser: false
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (text) => {
    window.speechSynthesis.cancel();
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 1.3;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice =>
      voice.name.toLowerCase().includes("female") || voice.lang.includes("en")
    );
    if (femaleVoice) newUtterance.voice = femaleVoice;

    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);

    setUtterance(newUtterance);
    window.speechSynthesis.speak(newUtterance);
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else if (utterance) {
      window.speechSynthesis.resume();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        updateCode(content);
        setCodeContent(content);
        setCodeUploaded(true);
        setGithubConnected(false);
      };
      reader.readAsText(file);
    }
  };


  const handleConnectGitHub = async (e) => {
    e.preventDefault();
    if (!repoUrl.includes('github.com')) {
      setMessages(prev => [...prev, {
        text: "Please enter a valid GitHub repository URL",
        isUser: false
      }]);
      return;
    }
  
    setIsLoading(true);
    const success = await fetchGitHubRepoContent(repoUrl);
    
    if (success) {
      setGithubConnected(true);
      setCodeUploaded(false);
      setIsModalOpen(false);
      setMessages(prev => [...prev, {
        text: "GitHub repository connected! Here's the file listing:",
        isUser: false
      }]);
    } else {
      setMessages(prev => [...prev, {
        text: "Github repository connected to RAG agent. Unable to load file content in the editor.",
        isUser: false
      }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full border-gray-800/50">
      {/* Header Controls */}
      <div className="flex flex-row justify-center items-center gap-2 p-3 border-b border-gray-700 w-full">
        <div className="flex items-center px-4 py-2 bg-gray-900/80 border border-blue-900 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors">
          <BrainCircuit size={18} />
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-5 py-2 bg-gray-900/80 border border-blue-900 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors ${githubConnected
            ? 'bg-[0F1A23] cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-700'
            }`}
          disabled={githubConnected}
        >
          <Github size={18} />
          {githubConnected ? 'Connected' : 'Connect GitHub'}
        </button>

        <button
          onClick={() => fileInputRef.current.click()}
          className={`flex items-center gap-2 px-5 py-2 bg-gray-900/80 border border-blue-900 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors ${codeUploaded
            ? 'bg-[0F1A23] cursor-not-allowed'
            : 'bg-gray-800 hover:bg-gray-700'
            }`}
        >
          <FolderUp size={18} />
          {codeUploaded ? 'Uploaded' : 'Upload Code'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".js,.ts,.jsx,.tsx,.py,.java,.html,.css"
        />
      </div>

      <div className="flex flex-row gap-1 p-1 pt-3">
        <button
          className={`flex items-center gap-1 px-4 py-1.5 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors ${codeUploaded ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
            <path d="M80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
          </svg>
          <span className="text-gray-300">Talk to Code</span>
        </button>

        <button
          className={`flex items-center gap-1 px-4 py-1.5 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors ${codeUploaded ? 'bg-blue-900/50 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700'
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
            <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z" />
          </svg>
          <span className="text-gray-300">Generate Code</span>
        </button>

        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 px-4 py-1.5 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm hover:bg-gray-800/80 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#D9D9D9"
            className="scale-90"
          >
            <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
          </svg>
          <span className="text-gray-300">New</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
        {isLoading && <LoadingMessage />}
      </div>

      {/* Input Area */}
      <div className="p-2 w-full">
        <div className="flex flex-row gap-1 items-center w-full">
          <div className="flex-grow">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>

          <div className="flex gap-2 flex-shrink-0 border p-2 border-gray-700 rounded-full">
            <button
              onClick={() => handleSpeak(messages[messages.length - 1]?.text)}
              disabled={isPlaying}
              className="p-1 hover:bg-gray-900 rounded-lg"
            >
              <AudioLines size={20} />
            </button>
            <button
              onClick={handlePauseResume}
              className="p-1 hover:bg-gray-800 rounded-lg"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* GitHub Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Connect GitHub Repository</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:bg-gray-700 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleConnectGitHub} className="space-y-4">
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="w-full p-2 bg-gray-900 rounded-lg border border-gray-700"
                required
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                Connect Repository
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeChat;