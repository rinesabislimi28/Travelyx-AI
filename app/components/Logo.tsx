import React from 'react';

export default function Logo({ className = "w-full h-full" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="travelyx-main" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#35c6b3" />
          <stop offset="1" stopColor="#1e9e8b" />
        </linearGradient>
        <linearGradient id="travelyx-accent" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffb938" />
          <stop offset="1" stopColor="#ff855f" />
        </linearGradient>
      </defs>

      {/* AI Network Line (Top-Left to Bottom-Right) */}
      <path 
        d="M6 6L18 18" 
        stroke="url(#travelyx-main)" 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
      {/* AI Nodes on the network line */}
      <circle cx="6" cy="6" r="2.5" fill="#09090b" stroke="url(#travelyx-main)" strokeWidth="1.5" />
      <circle cx="18" cy="18" r="2.5" fill="#09090b" stroke="url(#travelyx-main)" strokeWidth="1.5" />
      
      {/* Flight Path Line (Bottom-Left to Center) */}
      <path 
        d="M6 18L13 11" 
        stroke="url(#travelyx-accent)" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeDasharray="4 4"
      />
      
      {/* The Paper Plane taking off to Top-Right */}
      <path 
        d="M22 2L12 6.5L16 9L18 13L22 2Z" 
        fill="url(#travelyx-accent)" 
        stroke="#09090b"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path 
        d="M16 9L14 14L18 13L16 9Z" 
        fill="#ff7a59" 
        opacity="0.9" 
      />
      
      {/* Center glowing node where paths cross */}
      <circle cx="12" cy="12" r="3" fill="#09090b" />
      <circle cx="12" cy="12" r="1.5" fill="#ffb938" className="animate-pulse" />
    </svg>
  );
}
