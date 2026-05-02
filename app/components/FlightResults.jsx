'use client';
/**
 * FlightResults Component
 * 
 * Fetches and displays real-time or mocked flight data based on user destination 
 * and departure. Integrates with the Skyscanner API wrapper to present users
 * with live pricing, round-trip layouts, and booking links.
 */
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function FlightResults({ departure, destination, date, returnDate }) {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFlights() {
      if (!departure || !destination || !date) return;
      
      try {
        setLoading(true);
        let url = `/api/flights?departure=${encodeURIComponent(departure)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(date)}`;
        if (returnDate) {
          url += `&returnDate=${encodeURIComponent(returnDate)}`;
        }

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
           setError("Could not load live flight prices at this moment.");
           return;
        }
        
        setFlights(data.flights || []);
      } catch (err) {
        // Log softly to avoid triggering some dev overlays for expected network issues
        console.warn("Failed to fetch flights:", err);
        setError("Could not load live flight prices at this moment.");
      } finally {
        setLoading(false);
      }
    }

    fetchFlights();
  }, [departure, destination, date]);

  if (loading) {
    return (
      <div className="w-full mt-6 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-sm overflow-hidden animate-pulse">
        <div className="h-6 w-48 bg-[var(--line)] rounded-full mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-[var(--line)] rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--line)]"></div>
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-[var(--line)] rounded-md"></div>
                  <div className="h-3 w-24 bg-[var(--line)] rounded-md"></div>
                </div>
              </div>
              <div className="h-10 w-24 bg-[var(--line)] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || flights.length === 0) {
    return (
      <div className="w-full mt-8 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 text-center">
        <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">Flight Search</h3>
        <p className="text-sm text-[var(--muted)]">{error || "No direct or suitable flights found for this specific route and date."}</p>
      </div>
    );
  }

  const formatTime = (isoString) => {
    try {
      return new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch {
      return "--:--";
    }
  };

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <div className="w-full mt-8 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#35c6b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Live Flights
          </h3>
          <p className="text-xs text-[var(--muted)] mt-1 tracking-wide">
            Powered by Skyscanner
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent-2)] border border-[var(--accent)]/20 rounded-full font-bold">
          {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          {returnDate && ` - ${new Date(returnDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`}
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {flights.map((flight, idx) => (
          <div key={flight.id} className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6 bg-[var(--card)] hover:bg-[var(--card-strong)] transition-colors border border-[var(--line)] rounded-2xl sm:rounded-[1.5rem] shadow-sm relative group overflow-hidden">
            
            {/* Legs List */}
            <div className="flex-1 flex flex-col gap-4 sm:gap-5">
              {flight.legs?.map((leg, legIndex) => (
                <div key={legIndex} className="flex items-center gap-4 relative">
                  {/* Airline Logo */}
                  <div className="flex flex-col items-center justify-center gap-1 w-12 sm:w-16 shrink-0">
                    {leg.logoUrl ? (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full p-1 border border-[var(--line)] flex items-center justify-center overflow-hidden shadow-sm">
                        <img src={leg.logoUrl} alt={leg.airline} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--line-strong)] flex items-center justify-center text-[10px] sm:text-xs font-bold text-[var(--muted)] shadow-sm">
                        {leg.airline.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-bold text-[var(--muted)] text-center w-[120%] truncate px-1">
                      {leg.airline}
                    </span>
                  </div>
                  
                  {/* Flight Times & Line */}
                  <div className="flex-1 flex items-center gap-3 sm:gap-6">
                    <div>
                      <p className="text-base sm:text-lg font-black text-[var(--foreground)] leading-none">{formatTime(leg.departure.time)}</p>
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--muted)] mt-1">{leg.departure.displayCode}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center relative min-w-[60px]">
                      <span className="text-[9px] sm:text-[10px] text-[var(--muted)] font-medium mb-1">{formatDuration(leg.durationInMinutes)}</span>
                      <div className="w-full h-px bg-[var(--line-strong)] relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--accent-2)] bg-[var(--card)] px-1 transition-colors group-hover:bg-[var(--card-strong)]">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                        </div>
                      </div>
                      <span className="text-[9px] sm:text-[10px] text-[var(--accent-2)] font-bold mt-1">{leg.stopCount === 0 ? 'Direct' : `${leg.stopCount} Stop`}</span>
                    </div>

                    <div className="text-right">
                      <p className="text-base sm:text-lg font-black text-[var(--foreground)] leading-none">{formatTime(leg.arrival.time)}</p>
                      <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[var(--muted)] mt-1">{leg.arrival.displayCode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price & Action */}
            <div className="flex sm:flex-col items-center justify-between sm:justify-center sm:items-end sm:border-l sm:border-[var(--line)] sm:pl-5 shrink-0 gap-3 pt-4 sm:pt-0 border-t border-[var(--line)] sm:border-t-0 mt-2 sm:mt-0">
              <div className="flex flex-col items-start sm:items-end w-full">
                <span className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{flight.isRoundTrip ? 'Total return' : 'Total one-way'}</span>
                <span className="text-xl font-black text-[var(--foreground)]">{flight.price}</span>
              </div>
              <a href={flight.bookingUrl || "#"} target="_blank" rel="noopener noreferrer" className="bg-[#35c6b3] hover:bg-[#2eb09f] text-black font-bold text-sm px-5 py-2 rounded-lg transition-transform active:scale-95 shadow-sm inline-block text-center cursor-pointer w-full sm:w-auto">
                Book Flight
              </a>
            </div>
            
          </div>
        ))}
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent)]/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
