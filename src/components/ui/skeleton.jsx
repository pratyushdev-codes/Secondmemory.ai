// components/ui/skeleton.jsx
import React from 'react';

export const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse rounded-md bg-gray-700 ${className || ''}`} />
  );
};