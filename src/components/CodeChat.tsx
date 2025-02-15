import React, { useState, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Settings, AudioLines, Pause, Play } from 'lucide-react';
import logo from "../../public/images/supermemoryailogo.svg";
import { ChatGrid } from './ChatGrid';

const CodeChat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your AI coding assistant. How can I help you today?", isUser: false }
  ]);

  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, { text: message, isUser: true }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "I understand you need assistance. I'm analyzing your request and will help you with your coding needs.",
        isUser: false
      }]);
    }, 1000);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [isPaused, setIsPaused] = useState(false); // Track pause state

  useEffect(() => {
    // Cleanup function to cancel any ongoing speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = (text) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create a new utterance with the provided text
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.rate = 1.3; // Speed of speech
    
    // Set voice to female if available
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => voice.name.includes("female") || voice.lang.includes("en"));
    if (femaleVoice) {
      newUtterance.voice = femaleVoice;
    }

    // Add event listeners for speech events
    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onpause = () => {
      setIsPlaying(false);
      setIsPaused(true); // Track if paused
    };
    newUtterance.onresume = () => {
      setIsPlaying(true);
      setIsPaused(false); // Track if resumed
    };
    
    // Store the utterance in state
    setUtterance(newUtterance);

    // Start speech synthesis
    window.speechSynthesis.speak(newUtterance);
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else if (utterance) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col h-full border-gray-800/50">
      {/* Header */}
      <div className='flex flex-row gap-1 p-3'>
        <div className="flex items-center gap-1 px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm cursor-pointer">
          <span className='scale-0.1'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
              <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
            </svg>
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-300">Talk to Code</span>
        </div>

        <div className="flex items-center gap-1 px-4 py-2 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm cursor-pointer">
          <span className='scale-0.4'>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
              <path d="M320-240 80-480l240-240 57 57-184 184 183 183-56 56Zm320 0-57-57 184-184-183-183 56-56 240 240-240 240Z"/>
            </svg>
          </span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-300">Generate Code</span>
        </div>
        <div className="flex gap-2 px-3 rounded-full border border-gray-600 ">
        <button
          className="hover:bg-gray-700"
          onClick={() => handleSpeak(messages[messages.length - 1].text)} // Speak the latest message
          disabled={isPlaying}
        >
          <AudioLines size={15} className={`${isPlaying ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button
        className='hover:bg-gray-700'
          onClick={handlePauseResume}
          disabled={!utterance}
        >
          {isPlaying ? (
            <Pause size={14} className="text-gray-400" />
          ) : (
            <Play size={14} className="text-gray-400" />
          )}
        </button>
      </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent relative">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isUser={message.isUser}
          />
        ))}
      </div>

      {/* Speech Buttons */}


      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default CodeChat;