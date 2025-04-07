"use client";
import React, { useState } from "react";
import { Search } from "lucide-react";
import SearchResults from "./SearchResult";

export default function SearchContainer() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    googleResults: [],
    youtubeResults: [],
    isLoading: false,
  });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setSearchResults((prev) => ({ ...prev, isLoading: true }));
    setError(""); // Clear any previous errors
    
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      setSearchResults({
        googleResults: data.googleResults || [],
        youtubeResults: data.youtubeResults || [],
        isLoading: false,
        showResults: true,
      });
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults({
        googleResults: [],
        youtubeResults: [],
        isLoading: false,
        showResults: true,
        error: error.message
      });
    }
  };
  
  const filteredResults = () => {
    switch (activeTab) {
      case "google":
        return { googleResults: searchResults.googleResults, youtubeResults: [] };
      case "youtube":
        return { googleResults: [], youtubeResults: searchResults.youtubeResults };
      default:
        return { googleResults: searchResults.googleResults, youtubeResults: searchResults.youtubeResults };
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full px-10 py-2 bg-transparent text-gray-300 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            disabled={searchResults.isLoading}
          >
            {searchResults.isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-500 text-red-200 rounded-md">
          {error}
        </div>
      )}

      {(searchResults.googleResults.length > 0 || searchResults.youtubeResults.length > 0) && (
        <div className="mt-4">
          <div className="border-b border-gray-700">
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-gray-300 hover:text-white border-b-2 ${activeTab === "all" ? "border-blue-500" : "border-transparent"}`}
              >
                All Results
              </button>
              <button 
                onClick={() => setActiveTab("google")}
                className={`px-4 py-2 text-gray-300 hover:text-white border-b-2 ${activeTab === "google" ? "border-blue-500" : "border-transparent"}`}
              >
                Google
              </button>
              <button 
                onClick={() => setActiveTab("youtube")}
                className={`px-4 py-2 text-gray-300 hover:text-white border-b-2 ${activeTab === "youtube" ? "border-blue-500" : "border-transparent"}`}
              >
                YouTube
              </button>
            </div>
          </div>

          <div className="mt-4">
            <SearchResults 
              googleResults={filteredResults().googleResults} 
              youtubeResults={filteredResults().youtubeResults} 
            />
          </div>
        </div>
      )}
    </div>
  );
}