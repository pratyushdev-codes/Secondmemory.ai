import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { useChatActivity } from '../hooks/useChatActivity';
import { ActivityTooltip } from './ActivityTooltip';

const Activity = () => {
  const activityData = useChatActivity();

  // Define the gradient
  const renderGradient = (
    <defs>
      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="10%" stopColor="#65CCC9" /> {/* Lighter blue */}
        <stop offset="30%" stopColor="#60A5FA" /> {/* Lighter blue */}
        <stop offset="100%" stopColor="#3B82F6" /> {/* Darker blue */}
      </linearGradient>
    </defs>
  );

  return (

      <div className="p-1">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9">
              <path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
            </svg>
            <h2 className="text-lg font-medium text-gray-200">Activity</h2>
          </div>
          <button className="text-gray-400 hover:text-cyan-400 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>

        {activityData.length === 0 ? (
          <div className="h-[180px] flex items-center justify-center text-gray-400">
            No activity data yet. Start chatting!
          </div>
        ) : (
          <div className="h-[180px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
              >
                {renderGradient}
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                  stroke="#374151"
                />
                <YAxis
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => Math.round(value)}
                  stroke="#374151"
                />
                <Tooltip content={<ActivityTooltip />} />
                <Bar
                  dataKey="count"
                  fill="url(#barGradient)"
                  opacity={0.9}
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

  );
};

export default Activity;
