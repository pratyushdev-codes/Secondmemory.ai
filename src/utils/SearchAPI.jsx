const API_KEY = "AIzaSyCTm47xNBSlOKG8PHpkufZ28XrZhPtvkq0"; 
const GOOGLE_SEARCH_ENGINE_ID = "YOUR_SEARCH_ENGINE_ID"; // You'll need to replace this with your actual Google Custom Search Engine ID

export const fetchGoogleResults = async (query) => {
  try {
    // Add proper error handling for missing search engine ID
    if (GOOGLE_SEARCH_ENGINE_ID === "YOUR_SEARCH_ENGINE_ID") {
      console.error("Search Engine ID not configured");
      return [];
    }
    
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=3`
    );
    
    console.log(`Searching Google for: ${query}`);
    
    // Check status before proceeding
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Google API error:", errorData);
      throw new Error(`Google search failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Google results:", error);
    return [];
  }
};

export const fetchYouTubeResults = async (query) => {
  try {
const response = await fetch(
  `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=3&q=${encodeURIComponent(query)}&type=video&key=${API_KEY}`
);

    
    // Add logging to help with debugging
    console.log(`Searching YouTube for: ${query}`);
    
    // Check status before proceeding
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("YouTube API error:", errorData);
      throw new Error(`YouTube search failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the results to a more usable format
    const formattedResults = (data.items || []).map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.medium?.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`
    }));
    
    return formattedResults;
  } catch (error) {
    console.error("Error fetching YouTube results:", error);
    return [];
  }
};