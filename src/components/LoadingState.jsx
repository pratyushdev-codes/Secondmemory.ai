// components/LoadingState.jsx
import React from 'react';
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const LoadingState = () => {
  return (
    <div className="space-y-8 w-full">


      
      {/* YouTube Results Loading */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full bg-transparent" />
          <h2 className="text-base font-bold text-gray-200 border-gray-400">Video Results</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={`youtube-${i}`} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="w-full aspect-video bg-transparent border border-gray-400" />
                <div className="p-4 space-y-2">

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