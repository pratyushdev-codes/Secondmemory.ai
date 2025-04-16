import { Youtube, Info } from "lucide-react"
const youtubeResult = ({ results = [] }) => {
  if (!results || results.length === 0) {
    return null
  }

  return (
<div className="w-full">
  <div className="flex flex-row items-start space-x-4 px-2 py-2">
    <div className="flex items-center space-x-2 border border-[#666] rounded-full px-4 py-2 w-[29%]">
      <Youtube className="text-gray-400" />
      <span className="text-gray-400 text">Youtube Results</span>
    </div>

    <div className="flex items-center space-x-2 text-base text-gray-400 mt-2">
      <Info className="w-3 h-3" />
      <span>Auto-searching based on your query</span>
    </div>
  </div>




      {/* Container with fixed width and proper overflow handling */}
      <div className="w-full py-3">
        {/* Horizontal scrollable container that doesn't expand parent */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-2 max-w-full">
          {/* Fixed width content container with flex layout */}
          <div className="flex gap-3 pb-2">
            {results.map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-none w-[240px] bg-transparent rounded-xl overflow-hidden shadow-md border border-gray-600 hover:border-gray-600 transition-colors"
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnailUrl || "/placeholder.svg"}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80 rounded-lg"
                  />
                </div>

                <div className="p-3">
                  <h3 className="font-medium text-xs md:text-sm text-gray-200 line-clamp-2 mb-1">{video.title}</h3>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-400 truncate">{video.channelTitle}</p>

                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default youtubeResult

