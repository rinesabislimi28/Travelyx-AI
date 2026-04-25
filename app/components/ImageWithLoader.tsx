"use client";

import { useState, useEffect } from "react";

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function ImageWithLoader({ src, alt, className = "", containerClassName = "" }: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    // Only show the loading spinner if the image takes longer than 300ms to load
    const timer = setTimeout(() => {
      if (!isLoaded && !hasError) {
        setShowSpinner(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isLoaded, hasError]);

  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-800 ${containerClassName}`}>
      {/* Skeleton / Offline Placeholder */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          {!hasError ? (
            showSpinner && (
              <div className="flex flex-col items-center gap-3 animate-fade-in">
                <svg className="h-8 w-8 animate-spin text-[var(--muted)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-xs uppercase tracking-widest text-[var(--muted)]">Loading visual...</p>
              </div>
            )
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--muted)]">
              <svg className="h-8 w-8 text-rose-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-widest">Image unavailable</p>
              <p className="text-[10px]">Please check your network</p>
            </div>
          )}
        </div>
      )}

      {/* Actual Image */}
      {!hasError && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          className={`transition-opacity duration-200 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
      )}
    </div>
  );
}
