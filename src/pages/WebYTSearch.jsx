import { useState, useEffect } from "react";
import { toast } from "sonner";
import YouTubeResults from "../components/YouTubeResults";
import LoadingState from "../components/LoadingState";
import { fetchYouTubeResults } from "../utils/SearchAPI.jsx";

const WebYTSearch = ({ initialQuery = "", autoSearch = true }) => {
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Auto-search when initialQuery changes (from a new user message)
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== "" && autoSearch) {
      handleSearch(initialQuery);
    }
  }, [initialQuery, autoSearch]);

  const handleSearch = async (query) => {
    if (!query || query.trim() === "") return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Fetch YouTube results only
      const youtubeData = await fetchYouTubeResults(query);
      setYoutubeResults(youtubeData);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("An error occurred while searching. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Status indicator */}
      {autoSearch && initialQuery && !isLoading && (
        <div className="text-xs px-4 py-1 text-gray-400">
       
        </div>
      )}

      {/* Results section */}
      <div className="w-full overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {hasSearched && youtubeResults.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg font-medium text-gray-300">No results found</p>
                <p className="text-sm text-gray-400">Try searching for something else</p>
              </div>
            ) : (
              <div className="px-4 w-full">
                <YouTubeResults results={youtubeResults} />
                <div className="text-xs px-1 py-1 text-gray-400">
                Auto-searching based on your query
                </div>
              </div>
            )}
          </>
        )}

        {!hasSearched && (
          <div className="text-center py-2">
            <p className="text-lg font-medium text-gray-300">Search for anything to see YouTube results</p>
            <p className="text-sm text-gray-400">Enter your query in the chat to discover videos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebYTSearch;