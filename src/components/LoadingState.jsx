// components/LoadingState.jsx
import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const LoadingState = () => {
  return (
    <div className="space-y-8 w-full">
      {/* Google Results Loading */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-200">Web Results</h2>
        {[1, 2, 3].map((i) => (
          <Card key={`google-${i}`} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3 bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
                <Skeleton className="h-4 w-full bg-gray-700" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* YouTube Results Loading */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full bg-gray-700" />
          <h2 className="text-2xl font-bold text-gray-200">Video Results</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={`youtube-${i}`} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="w-full aspect-video bg-gray-700" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-2/3 bg-gray-700" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingState;