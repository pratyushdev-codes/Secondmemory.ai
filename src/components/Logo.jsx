import React from 'react';
import { Paperclip } from 'lucide-react';
import logo from "../../public/images/supermemoryailogo.svg";
export const CenterLogo = () => (
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black p-6 rounded-2xl shadow-lg z-10">
    <div className="w-20 h-20 flex items-center justify-center">
      <img src={logo}/>
    </div>
  </div>
);

export const ProviderLogo = ({ src, alt, className }) => (
  <div className={className}>
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
      <img src={src} alt={alt} className="w-8 h-8" />
    </div>
  </div>
);
