import React from 'react';
import { Code2, Terminal } from 'lucide-react';

function Features() {
  return (
    <div className="min-h-screen bg-[black] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full flex gap-4">
        {/* Left Column */}
        <div className="flex-1 space-y-4">
          {/* Top Left Card */}
          <div className="bg-black/30 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 h-[300px]">
            <div className="flex items-center gap-3 mb-4">
              <Terminal className="text-purple-400" size={24} />
              <h2 className="text-2xl font-light text-white">{`{ Developer Tools }`}</h2>
            </div>
            <p className="text-gray-300">
              Write, Understand, Query, Improve and Debug Code with AI Agents.
            </p>
          </div>

          {/* Bottom Left Card */}
          <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 h-[300px]">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="text-purple-400" size={24} />
              <h2 className="text-2xl font-light text-white">Let&apos;s Build Together</h2>
            </div>
            <p className="text-gray-300">
              Innovate new solutions with RAG Engines in context to your Second Memory and build them for Real World!
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 h-[616px] sm:block hidden">
            <div className="h-full flex flex-col">
              <h2 className="text-2xl font-light text-white mb-4">Fetching Data from Firebase</h2>
              <div className="flex-1 bg-black/30 rounded-lg p-4 font-mono text-sm text-purple-300">
                <div className="mb-4">
                  <span className="text-gray-500">// Fetch data from Firebase</span>
                  <div>
                    <span className="text-pink-500">const</span>
                    <span className="text-purple-300"> fetchData </span>
                    <span className="text-white">=</span>
                    <span className="text-pink-500"> async</span>
                    {/* <span className="text-white"> () => {'{'}</span> */}
                  </div>
                  <div className="ml-4">
                    <span className="text-pink-500">try</span>
                    <span className="text-white"> {'{'}</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-pink-500">const</span>
                    <span className="text-purple-300"> db </span>
                    <span className="text-white">=</span>
                    <span className="text-blue-400"> getDatabase</span>
                    <span className="text-white">(</span>
                    <span className="text-orange-300">firebaseapp</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="ml-8 mt-2">
                    <span className="text-gray-500">// Fetch website data</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-pink-500">const</span>
                    <span className="text-purple-300"> websiteRef </span>
                    <span className="text-white">=</span>
                    <span className="text-blue-400"> ref</span>
                    <span className="text-white">(</span>
                    <span className="text-purple-300">db</span>
                    <span className="text-white">,</span>
                    <span className="text-orange-300"> &apos;/websiteData&apos;</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-pink-500">const</span>
                    <span className="text-purple-300"> websiteSnapshot </span>
                    <span className="text-white">=</span>
                    <span className="text-pink-500"> await</span>
                    <span className="text-blue-400"> get</span>
                    <span className="text-white">(</span>
                    <span className="text-purple-300">websiteRef</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="ml-8 mt-2">
                    <span className="text-gray-500">// Update tree data</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-blue-400">setTreeData</span>
                    <span className="text-white">((</span>
                    <span className="text-purple-300">prevData</span>
                    {/* <span className="text-white">) => {'{'}</span> */}
                  </div>
                  <div className="ml-12">
                    <span className="text-pink-500">const</span>
                    <span className="text-purple-300"> newData </span>
                    <span className="text-white">= [...</span>
                    <span className="text-purple-300">prevData</span>
                    <span className="text-white">];</span>
                  </div>
                  <div className="ml-12">
                    <span className="text-pink-500">return</span>
                    <span className="text-purple-300"> newData</span>
                    <span className="text-white">;</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-white">{'});'}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-white">{'}'}</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-pink-500">catch</span>
                    <span className="text-white"> (</span>
                    <span className="text-purple-300">error</span>
                    <span className="text-white">) {'{'}</span>
                  </div>
                  <div className="ml-8">
                    <span className="text-blue-400">console</span>
                    <span className="text-white">.</span>
                    <span className="text-blue-400">error</span>
                    <span className="text-white">(</span>
                    <span className="text-purple-300">error</span>
                    <span className="text-white">);</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-white">{'}'}</span>
                  </div>
                  <div>
                    <span className="text-white">{'};'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;