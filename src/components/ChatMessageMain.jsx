import React, { useState, useEffect } from 'react';
import { AudioLines, Pause, Play } from 'lucide-react';

const ChatMessageMain = ({ message, userImage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    // Cleanup function to cancel any ongoing speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeak = () => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create new utterance
    const newUtterance = new SpeechSynthesisUtterance(message.text);
    newUtterance.rate = 1.3; 
    
    // Add event listeners
    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onpause = () => setIsPlaying(false);
    newUtterance.onresume = () => setIsPlaying(true);
    
    // Store utterance in state
    setUtterance(newUtterance);
    
    // Start speaking
    window.speechSynthesis.speak(newUtterance);
    setIsPlaying(true);
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

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  return (
    <div className={`flex items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {message.sender === 'user' && userImage ? (
        <img 
          src={userImage} 
          alt="User" 
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : message.sender === 'ai' && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center"> 
          <img className="w-8 h-8 rounded-full opacity-60" src="../../public/images/AIAvatar.png" alt="AI Avatar"/>
        </div>
      )}
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white'
            : 'bg-gradient-to-r from-slate-900 to-gray-800  text-gray-200'
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <p className="text-xs mt-1 opacity-60">{formattedTime}</p>
      </div>    
      <div className="flex gap-2 border border-gray-700 p-1 rounded-full">
        <button 
          className="p-1 rounded-full "
          onClick={handleSpeak}
          disabled={isPlaying}
        >
          <AudioLines size={15} className={`${isPlaying ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button 
          className="p-1 rounded-full "
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
  );
};

export default ChatMessageMain;