import { useState, useEffect } from "react";
import { toast } from "sonner";
import youtubeResult from "../components/youtubeResult.jsx";
import LoadingState from "../components/LoadingState.jsx";
import { fetchYouTubeResults } from "../utils/SearchAPI.jsx";
import { Info } from "lucide-react";

const WebYTSearch = ({ initialQuery = "", autoSearch = true }) => {
  const [youtubeResults, setYoutubeResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingSearch, setPendingSearch] = useState(false);

  // Only trigger search when initialQuery is properly set from the server response
  useEffect(() => {
    if (initialQuery && initialQuery.trim() !== "" && autoSearch) {
      // Set a flag to indicate we're waiting for a valid search query
      if (!pendingSearch) {
        setPendingSearch(true);
        // Add a small delay to ensure we're using the finalized query from the server
        const searchTimer = setTimeout(() => {
          handleSearch(initialQuery);
          setPendingSearch(false);
        }, 800); // Wait for server response to be processed
        
        return () => clearTimeout(searchTimer);
      }
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
      {autoSearch && initialQuery && (
        <div className="text-xs px-4 text-gray-400 flex items-center mb-2">
          {isLoading ? (
            <span>Searching for related content...</span>
          ) : (
            hasSearched && youtubeResults.length > 0 && (
              <span></span>
            )
          )}
        </div>
      )}

      {/* Results section */}
      <div className="w-full overflow-hidden">
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {hasSearched && youtubeResults.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400">No results found for this query</p>
              </div>
            ) : (
              <div className="px-4 w-full">
                <youtubeResult results={youtubeResults} />
                <span className="text-gray-400 text-sm">Found {youtubeResults.length} related videos</span>
              </div>
            )}
          </>
        )}

        {!hasSearched && !pendingSearch && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-400">Enter your query in the chat to discover videos</p>
          </div>
        )}
        
        {pendingSearch && !isLoading && (
          <div className="text-center py-2">
            <p className="text-sm text-gray-400">Preparing search query...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebYTSearch;
