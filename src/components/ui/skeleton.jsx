// components/ui/skeleton.jsx
import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse rounded-md bg-transparent border border-gray-600 ${className || ''}`} />
  );
};