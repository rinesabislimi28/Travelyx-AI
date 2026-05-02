"use client";
/**
 * InteractiveDay Component
 * 
 * Renders a single day's itinerary in a clean, interactive timeline format.
 * Groups events by morning, afternoon, and evening blocks for readability.
 */
import React, { useState } from 'react';

export default function InteractiveDay({ dayNum, morning, afternoon, evening }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const times = [
    { id: 'morning', title: 'Morning', data: morning || ["Free time"], color: 'var(--accent)' },
    { id: 'afternoon', title: 'Afternoon', data: afternoon || ["Free time"], color: 'var(--accent-2)' },
    { id: 'evening', title: 'Evening', data: evening || ["Free time"], color: 'var(--foreground)' }
  ];

  const getPosition = (index) => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 1) % 3) return 'right';
    if (index === (activeIndex - 1 + 3) % 3) return 'left';
    return 'hidden';
  };

  const minSwipeDistance = 50;

  // Touch Events
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  // Mouse Events
  const onMouseDown = (e) => {
    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };
  const onMouseMove = (e) => {
    if (!isDragging) return;
    setTouchEnd(e.clientX);
  };

  const handleSwipeEnd = () => {
    setIsDragging(false);
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setActiveIndex((prev) => (prev + 1) % 3);
    }
    if (isRightSwipe) {
      setActiveIndex((prev) => (prev - 1 + 3) % 3);
    }
    
    // Reset
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-4 sm:p-5 lg:p-6 mb-6 shadow-sm overflow-hidden">
      <h3 className="text-xl font-bold text-[var(--foreground)] mb-6 text-center md:text-left">Day {dayNum}</h3>
      
      <div 
        className={`relative w-full h-[320px] md:h-[380px] lg:h-auto flex lg:grid lg:grid-cols-3 lg:gap-4 items-center justify-center ${isDragging ? 'cursor-grabbing' : ''}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleSwipeEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleSwipeEnd}
        onMouseLeave={handleSwipeEnd}
      >
        {times.map((time, index) => {
          const position = getPosition(index);
          const isCenter = position === 'center';
          
          let styles = '';
          if (position === 'center') {
            styles = 'translate-x-0 scale-100 z-30 opacity-100 shadow-[0_20px_40px_rgba(0,0,0,0.12)]';
          } else if (position === 'left') {
            styles = '-translate-x-[65%] md:-translate-x-[85%] scale-[0.85] z-20 opacity-50 hover:opacity-80 cursor-pointer shadow-md';
          } else if (position === 'right') {
            styles = 'translate-x-[65%] md:translate-x-[85%] scale-[0.85] z-20 opacity-50 hover:opacity-80 cursor-pointer shadow-md';
          }

          return (
            <div
              key={time.id}
              onClick={() => {
                if (!isCenter) setActiveIndex(index);
              }}
              className={`
                absolute lg:relative w-[80%] max-w-[320px] md:max-w-[400px] lg:w-full lg:max-w-none h-full lg:h-[380px] rounded-[1.4rem] border border-[var(--line-strong)] bg-[var(--background)]
                transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${styles}
                lg:translate-x-0 lg:scale-100 lg:opacity-100 lg:hover:opacity-100 lg:z-10 lg:shadow-sm lg:hover:-translate-y-1 lg:hover:shadow-md
              `}
            >
              <div className="relative h-full w-full flex flex-col">
                {/* Full Content (Visible only in center or ALWAYS on desktop) */}
                <div className={`flex flex-col h-full p-5 sm:p-6 transition-opacity duration-500 lg:opacity-100 lg:pointer-events-auto lg:select-auto ${isCenter ? 'opacity-100 delay-200' : 'opacity-0 select-none pointer-events-none'}`}>
                  <p 
                    className={`text-sm uppercase tracking-[0.24em] font-bold mb-4 ${time.id === 'evening' ? 'opacity-70' : ''}`}
                    style={{ color: time.id === 'evening' ? 'var(--foreground)' : time.color }}
                  >
                    {time.title}
                  </p>
                  
                  <div className="flex-1 overflow-y-auto custom-scroll pr-2">
                    <ul className="space-y-3 text-sm leading-7 text-[var(--muted)]">
                      {time.data.map((item, i) => (
                        <li key={i} className="flex gap-3 group">
                          <span className="text-[var(--muted)] opacity-50 mt-1 group-hover:opacity-100 group-hover:text-[#35c6b3] transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          </span>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 transition-colors hover:text-[#35c6b3] cursor-pointer decoration-[var(--line-strong)] hover:underline underline-offset-4"
                            title="View exact location on Map"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Side Title (Visible only when not center, HIDDEN on desktop) */}
                <div 
                  className={`absolute inset-0 flex lg:hidden items-center justify-center transition-opacity duration-500
                  ${!isCenter ? 'opacity-100 delay-200' : 'opacity-0 pointer-events-none select-none'}
                  `}
                >
                  <p 
                    className={`text-[11px] sm:text-xs uppercase tracking-[0.3em] font-bold whitespace-nowrap -rotate-90 ${time.id === 'evening' ? 'opacity-70' : ''}`}
                    style={{ color: time.id === 'evening' ? 'var(--foreground)' : time.color }}
                  >
                    TAP TO OPEN {time.title.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Floating Navigation Arrows for Mobile */}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev - 1 + 3) % 3);
          }}
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)]/90 backdrop-blur-md border border-[var(--line-strong)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] lg:hidden text-[var(--foreground)] hover:bg-[var(--card)] active:scale-90 transition-all"
          aria-label="Previous time"
        >
          <svg className="w-6 h-6 ml-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex((prev) => (prev + 1) % 3);
          }}
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background)]/90 backdrop-blur-md border border-[var(--line-strong)] shadow-[0_8px_30px_rgba(0,0,0,0.5)] lg:hidden text-[var(--foreground)] hover:bg-[var(--card)] active:scale-90 transition-all"
          aria-label="Next time"
        >
          <svg className="w-6 h-6 mr-[-2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </div>
    </div>
  );
}
