"use client"

const UltimateAI = () => {
  return (
    <div className="w-full relative bg-black text-white p-8 rounded-xl overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-dot-gray-700" />

      {/* Content container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Video background with text overlay */}
        <div className="relative rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
          {/* Video element - autoplay, loop, muted, no controls */}
          <video
            className="w-full h-full object-cover opacity-50" // Reduced opacity to 50%
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              display: "block",
              filter: "hue-rotate(200deg) contrast(120%) brightness(90%)",
            }}
            controls={false}
            playsInline
            src="../../public/images/familiar-black.mp4"
          />

          {/* Text overlay with gradient background for better readability */}
          <div className="absolute inset-0 flex flex-col items-start justify-start text-left p-3 bg-black/50">
            {/* Moved to top left by changing alignment classes */}
            <div className="flex items-center gap-2 text-white font-lg mb-4 mt-4 ml-4">
              <div className="h-2 w-8 bg-white rounded-full" />
              <span>Introducing</span><span className="text-blue-700 font-lg ">Secondmemory.ai</span>
            </div>

            {/* Center the main content */}
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-tight tracking-tight mb-4 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-center">
                The Ultimate Multisource RAG and AI Agents that you need.
              </h1>

              <p className="text-gray-200 text-lg md:text-xl max-w-3xl text-center">
                Leverage the power of advanced retrieval augmented generation with our seamless AI agent integration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UltimateAI

