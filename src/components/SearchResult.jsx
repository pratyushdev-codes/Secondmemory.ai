// components/SearchResults.jsx
import React from "react";
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";

const SearchResults = ({ googleResults = [], youtubeResults = [] }) => {
  return (
    <div className="space-y-6">
      {googleResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-200">Google Results</h2>
          <div className="space-y-4">
            {googleResults.map((result, index) => (
              <Card key={index}>
                <CardContent>
                  <a 
                    href={result.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium"
                  >
                    {result.title}
                    <ExternalLink size={16} />
                  </a>
                  <p className="text-gray-300 text-sm mt-1">{result.snippet}</p>
                  <p className="text-gray-400 text-xs mt-2">{result.link}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {youtubeResults.length > 0 && (
        <div className="space-y-4">
          
          <h2 className="text-lg px-1 font-medium text-gray-200"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h480q33 0 56.5 23.5T720-720v180l160-160v440L720-420v180q0 33-23.5 56.5T640-160H160Zm0-80h480v-480H160v480Zm0 0v-480 480Z"/></svg>  YouTube Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {youtubeResults.map((result, index) => (
              <Card key={index}>
                <CardContent>
                  <a 
                    href={result.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {result.thumbnail ? (
                      <img 
                        src={result.thumbnail} 
                        alt={result.title} 
                        className="w-full rounded-md mb-2" 
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-700 rounded-md mb-2 flex items-center justify-center">
                        <span className="text-gray-400">No thumbnail</span>
                      </div>
                    )}
                    <h3 className="text-blue-400 hover:text-blue-300 font-medium line-clamp-2">{result.title}</h3>
                  </a>
                  <p className="text-gray-300 text-sm mt-1 line-clamp-2">{result.description}</p>
                  <p className="text-gray-400 text-xs mt-2">{result.channelTitle}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {googleResults.length === 0 && youtubeResults.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No results found. Try another search term.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;