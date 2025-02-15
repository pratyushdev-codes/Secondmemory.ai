import React from 'react';
import { CenterLogo, ProviderLogo } from '../components/Logo';
import { Grid } from '../components/Grid';
import { Brain, Bot , MessagesSquare, Code, Github } from 'lucide-react';

export default function TechUI() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full rounded-3xl bg-[#111111] p-12 relative overflow-hidden">
        <Grid />

        <div className="text-center mb-20 relative">
          <p className="text-gray-400 uppercase tracking-wider text-sm mb-4">SECONDMEMORY.ai</p>
          <h1 className="text-4xl font-semibold mb-4">Single copilot for all your Knowledge</h1>
        </div>

        <div className="relative h-[400px]">
          <CenterLogo />

            <div className="absolute left-1/4 top-1/4 -translate-x-1/2 -translate-y-1/2 animate-float-1 text-gray-400">
            <Github size={48} />
          </div>

            <div className="absolute right-1/4 top-1/4 translate-x-1/2 -translate-y-1/2 animate-float-2 text-gray-400">
            <Code size={48} />
          </div>
          
          <div className="absolute left-1/4 bottom-1/4 -translate-x-1/2 translate-y-1/2 animate-float-3 text-gray-400">
            <MessagesSquare size={48} />
          </div>

          {/* <div className="absolute left-1/3 bottom-1/2 -translate-x-1/2 translate-y-1/2 animate-float-3 text-gray-400">
            <Bot size={48} />
          </div> */}

          <div className="absolute right-1/4 bottom-1/4 translate-x-1/2 translate-y-1/2 animate-float-4 text-gray-400">
            <Brain size={48} />
          </div>
        </div>

        <div className="text-center mt-8 relative">
          <p className="text-xl text-gray-400">
            Improve your Productivity, Code Quality ,Debug Code using RAG and AI Agents!
          </p>
        </div>
      </div>
    </div>
  );
}
