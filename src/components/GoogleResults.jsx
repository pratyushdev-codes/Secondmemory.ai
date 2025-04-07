// components/GoogleResults.jsx
import React from 'react';
import { Card, CardContent } from "./ui/card";

const GoogleResults = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-200">Web Results</h2>
      {results.map((result, index) => (
        <Card key={index} className="result-card overflow-hidden">
          <CardContent className="p-4">
            <a 
              href={result.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <p className="text-sm text-gray-400 mb-1">{result.displayLink}</p>
              <h3 
                className="text-lg font-semibold text-blue-400 hover:underline mb-2"
                dangerouslySetInnerHTML={{ __html: result.htmlTitle }} 
              />
              <p 
                className="text-gray-300 text-sm" 
                dangerouslySetInnerHTML={{ __html: result.htmlSnippet }} 
              />
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default GoogleResults;