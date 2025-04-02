import React, { useState, useEffect } from 'react';
import { AudioLines, Pause, Play } from 'lucide-react';
import Typewriter from 'typewriter-effect/dist/core';

const ChatMessageMain = ({ message, userImage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [utterance, setUtterance] = useState(null);
  const [typewriterInstance, setTypewriterInstance] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (typewriterInstance) {
        typewriterInstance.stop();
      }
    };
  }, [typewriterInstance]);

  useEffect(() => {
    if (message.sender === 'ai' && message.text) {
      const element = document.getElementById(`typewriter-${message.timestamp}`);
      if (element) {
        const instance = new Typewriter(element, {
          delay: 30,
          cursor: '|',
          wrapperClassName: 'text-white',
          cursorClassName: 'text-blue-400',
        });

        setTypewriterInstance(instance);
        setIsTyping(true);

        let textToType = message.text;
        if (message.text.startsWith('{')) {
          try {
            const data = JSON.parse(message.text);
            textToType = data.response || message.text;
          } catch (e) {
            textToType = message.text;
          }
        }

        instance
          .typeString(textToType)
          .start()
          .callFunction(() => {
            setIsTyping(false);
          });
      }
    }
  }, [message]);

  const handleSpeak = (text) => {
    window.speechSynthesis.cancel();
    
    const newUtterance = new SpeechSynthesisUtterance(
      typeof text === 'string' ? text : JSON.stringify(text)
    );
    newUtterance.rate = 1.3;
    
    newUtterance.onstart = () => setIsPlaying(true);
    newUtterance.onend = () => setIsPlaying(false);
    newUtterance.onpause = () => setIsPlaying(false);
    newUtterance.onresume = () => setIsPlaying(true);
    
    setUtterance(newUtterance);
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

  const formatText = (text) => {
    if (typeof text !== 'string') return text;
    
    if (message.sender === 'ai') {
      return <div id={`typewriter-${message.timestamp}`} className="text-white"></div>;
    }
    
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      // Format numbers with % or +
      let formattedLine = line.replace(/(\d+[%+])/g, match => (
        `<span class="text-blue-600">${match}</span>`
      ));
      
      // Format bold text (both **text** and **text **)
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*(\s*)/g, (_, text, space) => (
        `<strong class="font-bold">${text}</strong>${space || ''}`
      ));
      
      // Handle bullet points
      if (line.startsWith('*')) {
        const bulletText = line.substring(1);
        return (
          <div key={index} className="flex items-start space-x-2 mb-2">
            <span className="text-blue-400 mt-1.5">•</span>
            <span className="text-white flex-1" dangerouslySetInnerHTML={{ __html: bulletText }} />
          </div>
        );
      }

      return (
        <div key={index} className="mb-2">
          <span className="text-white" dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      );
    });

    return <div className="space-y-1">{formattedLines}</div>;
  };

  const formatApiResponse = (text) => {
    try {
      const data = JSON.parse(text);
      return (
        <div className="space-y-4">
          <div id={`typewriter-${message.timestamp}`} className="text-white"></div>
          
          {!isTyping && data.intermediate_steps && data.intermediate_steps.length > 0 && (
            <div className="mt-6">
              <div className="font-medium text-lg text-gray-400 mb-4">Intermediate Steps:</div>
              <div className="space-y-6">
                {data.intermediate_steps.map((step, index) => (
                  <div key={index} className="relative">
                    {step.action && (
                      <div className="space-y-2">
                        <div className="flex items-baseline">
                          <span className="font-medium text-gray-400 mr-2">Action:</span>
                          <span className="text-blue-400">{step.action.tool}</span>
                        </div>
                        {step.action.tool_input && (
                          <div className="flex items-baseline">
                            <span className="text-gray-400 mr-2">Input:</span>
                            <span className="text-white" dangerouslySetInnerHTML={{ 
                              __html: step.action.tool_input.replace(/(\d+[%+])/g, match => 
                                `<span class="text-gray-900">${match}</span>`
                              )
                            }} />
                          </div>
                        )}
                      </div>
                    )}
                    {step.observation && (
                      <div className="mt-4">
                        <div className="font-medium text-gray-400 text-lg mb-2">Observation:</div>
                        <div className="border-l-2 border-gray-700 pl-4 space-y-2">
                          {step.observation.split('\n').map((line, i) => {
                            if (line.startsWith('From PDF Document:')) {
                              return (
                                <div key={i} className="py-1">
                                  <div className="text-blue-400">{line}</div>
                                </div>
                              );
                            }
                            return (
                              <div key={i} className="text-white" dangerouslySetInnerHTML={{ 
                                __html: line.replace(/(\d+[%+])/g, match => 
                                  `<span class="text-blue-600">${match}</span>`
                                )
                              }} />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } catch (e) {
      return <div className="text-white">{formatText(text)}</div>;
    }
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "N/A";

  const messageContent = typeof message.text === 'string' && message.text.startsWith('{')
    ? formatApiResponse(message.text)
    : <div className="text-white">{formatText(message.text)}</div>;

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
          <img className="w-8 h-8 rounded-full opacity-60" src="/images/AIAvatar.png" alt="AI Avatar"/>
        </div>
      )}
      <div
        className={`max-w-[84%] rounded-2xl px-4 py-2 ${
          message.sender === 'user'
            ? 'bg-gradient-to-r from-blue-600 to-blue-800'
            : 'bg-gradient-to-r from-slate-900 to-gray-800'
        }`}
      >
        <div className="text-sm">{messageContent}</div>
        <p className="text-xs mt-1 opacity-60 text-white">
          <span dangerouslySetInnerHTML={{ 
            __html: formattedTime.replace(/(\d+[%+])/g, match => 
              `<span class="text-gray-900">${match}</span>`
            )
          }} />
        </p>
      </div>    
      <div className="flex gap-2 border border-gray-700 p-1 rounded-full">
        <button 
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          onClick={() => handleSpeak(message.text)}
          disabled={isPlaying || isTyping}
        >
          <AudioLines size={15} className={`${isPlaying || isTyping ? 'text-gray-500' : 'text-gray-400'}`} />
        </button>
        <button 
          className="p-1 rounded-full hover:bg-gray-800 transition-colors"
          onClick={handlePauseResume}
          disabled={!utterance || isTyping}
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