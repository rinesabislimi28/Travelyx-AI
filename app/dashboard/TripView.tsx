/**
 * TripView Component
 * 
 * A detailed view for displaying a saved itinerary. It renders the full daily breakdown,
 * flight results, route map links, and the financial cost-estimation block.
 */
import React from "react";
import InteractiveDay from "../components/InteractiveDay";
import FlightResults from "../components/FlightResults";
import { TripRecord, ItineraryDay } from "./page";

interface TripViewProps {
  selectedTrip: TripRecord | null;
  onClose: () => void;
}

export default function TripView({ selectedTrip, onClose }: TripViewProps) {
  if (!selectedTrip || !selectedTrip.itinerary_data) return null;

  const {
    destination = "Unknown",
    country = "Unknown",
    overview = "No overview provided.",
    local_event_or_festival,
    best_time_to_visit = "N/A",
    itinerary = [],
    budget_estimate = {},
    user_budget = null,
    departure = "",
    travelStyle,
    companionsText,
    duration,
    displayDate,
  } = selectedTrip.itinerary_data as any;

  const userBudgetNumber = Number(user_budget) || Number(selectedTrip.budget) || Number(budget_estimate?.total_trip_cost) || 0;
  const totalSpent = Number(budget_estimate?.total_trip_cost) || 0;
  const remaining = userBudgetNumber - totalSpent;

  const defaultFlightDateStr = React.useMemo(() => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], []);
  const defaultFlightTimeMs = React.useMemo(() => Date.now() + 30 * 24 * 60 * 60 * 1000, []);

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-5">
      <div className="shell">
        <div className="panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">Saved itinerary</p>
              <h2 className="section-title mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                {destination.includes(country) || country === "Unknown" ? destination : `${destination}, ${country}`}
              </h2>
              {departure && <p className="mt-3 text-sm text-[var(--muted)]">Departure: {departure} • {itinerary.length} days</p>}
            </div>
            <button onClick={onClose} className="button-primary mt-4 sm:mt-0 shadow-xl px-6">
              ← Back to planner
            </button>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-[var(--line)] bg-[var(--card)] p-5 sm:p-6">
            <p className="text-sm leading-7 text-[var(--muted)] sm:text-base">{overview}</p>
            {local_event_or_festival && <div className="status-info mt-4">{local_event_or_festival}</div>}
            
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <div className="inline-block rounded-2xl border border-[var(--line-strong)] bg-[var(--background)] px-5 py-3 text-sm text-[var(--muted)] shadow-sm leading-relaxed">
                Best time to visit: <span className="ml-1 font-bold text-[var(--foreground)]">{best_time_to_visit}</span>
              </div>
              
              {travelStyle && (
                <span className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                  {travelStyle}
                </span>
              )}
              
              {companionsText && (
                <span className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                  {companionsText}
                </span>
              )}
              
              {displayDate && (
                <span className="inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--background)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                  {displayDate}
                </span>
              )}
            </div>
          </div>

          {/* Route Map Section */}
          {departure && destination && (
            <div className="mt-6 mb-2 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-sm overflow-hidden relative group">
              <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2335c6b3\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></div>
              <div className="relative z-10 flex flex-col md:flex-row gap-5 items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center justify-center md:justify-start gap-2">
                    <svg className="w-5 h-5 text-[#35c6b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    Your Travel Route
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted)] max-w-md text-center md:text-left">
                    Ready to go? Open the live map to see the complete journey from <span className="font-bold text-[var(--foreground)]">{departure}</span> to <span className="font-bold text-[var(--foreground)]">{destination.includes(country) || country === "Unknown" ? destination : `${destination}, ${country}`}</span>, including precise directions and travel options.
                  </p>
                </div>
                <a 
                  href={`http://maps.apple.com/?saddr=${encodeURIComponent(departure)}&daddr=${encodeURIComponent(destination)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 rounded-full bg-[#35c6b3] px-6 py-3 text-sm font-black text-black transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(53,198,179,0.4)] active:scale-95"
                >
                  View Route on Apple Maps
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
              </div>
            </div>
          )}

          {/* Flights Section */}
          {departure && destination && (
            <div className="mt-6 mb-2">
              <FlightResults 
                departure={departure} 
                destination={destination} 
                date={
                  selectedTrip.itinerary_data?.formData?.dateType === "exact" && selectedTrip.itinerary_data?.formData?.dateRange?.from
                    ? new Date(selectedTrip.itinerary_data.formData.dateRange.from).toISOString().split('T')[0]
                    : (selectedTrip.itinerary_data?.formData?.fixedDate || defaultFlightDateStr)
                }
                returnDate={
                  selectedTrip.itinerary_data?.formData?.dateType === "exact" && selectedTrip.itinerary_data?.formData?.dateRange?.to
                    ? new Date(selectedTrip.itinerary_data.formData.dateRange.to).toISOString().split('T')[0]
                    : (selectedTrip.itinerary_data?.formData?.dateType === "flexible" && selectedTrip.itinerary_data?.formData?.duration)
                      ? new Date(new Date(selectedTrip.itinerary_data.formData.fixedDate || defaultFlightTimeMs).getTime() + selectedTrip.itinerary_data.formData.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                      : undefined
                }
              />
            </div>
          )}

          {/* Financial Analysis Dashboard */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[var(--foreground)]">Financial Analysis</h3>
              <span className="text-[10px] uppercase tracking-[0.2em] px-3 py-1 bg-[var(--card)] border border-[var(--line-strong)] rounded-full text-[var(--muted)]">Cost Overview</span>
            </div>

            <div className="rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-sm overflow-hidden relative transition-all hover:shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] mb-1">Your Budget</p>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">€{userBudgetNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] mb-1">Estimated Cost</p>
                  <p className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">€{totalSpent}</p>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-medium text-[var(--muted)]">Remaining Balance</p>
                  <p className={`text-xl sm:text-2xl font-black ${remaining < 0 ? 'text-[#ff5964]' : 'text-[var(--accent-2)]'}`}>
                    {remaining < 0 ? '-' : '+'}€{Math.abs(remaining)}
                  </p>
                </div>
                <div className="w-full h-2 rounded-full bg-[var(--line)] overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${remaining < 0 ? 'bg-[#ff5964]' : 'bg-[var(--accent-2)]'}`} 
                    style={{ width: `${Math.min((totalSpent / (userBudgetNumber || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-5 border-t border-[var(--line-strong)] relative z-10">
                <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)] mb-4">Cost Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--background)] border border-[var(--line)] transition-all hover:-translate-y-1 hover:shadow-md cursor-default">
                    <span className="text-sm text-[var(--muted)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span> Flights
                    </span>
                    <span className="font-bold text-[var(--foreground)]">€{budget_estimate?.flight ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--background)] border border-[var(--line)] transition-all hover:-translate-y-1 hover:shadow-md cursor-default">
                    <span className="text-sm text-[var(--muted)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#ff7a59]"></span> Hotel
                    </span>
                    <span className="font-bold text-[var(--foreground)]">€{budget_estimate?.hotel_total ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--background)] border border-[var(--line)] transition-all hover:-translate-y-1 hover:shadow-md cursor-default">
                    <div className="text-sm text-[var(--muted)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--accent-2)]"></span> 
                      <div>
                        Daily
                        <p className="text-[9px] uppercase tracking-wider opacity-60">Food, Taxi, Tickets</p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--foreground)]">€{budget_estimate?.daily_expenses_total ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="mt-3 text-xs text-[var(--muted)] opacity-80 text-center">* Estimates are AI-generated based on season & availability.</p>
          </div>



          <div className="mt-6 space-y-4">
            {itinerary.length > 0 ? (
              itinerary.map((day: ItineraryDay, idx: number) => {
                const dayNum = day.day ?? idx + 1;
                const morning = day.morning ?? ["Free time"];
                const afternoon = day.afternoon ?? ["Free time"];
                const evening = day.evening ?? ["Free time"];

                return (
                  <InteractiveDay 
                    key={dayNum} 
                    dayNum={dayNum} 
                    morning={morning} 
                    afternoon={afternoon} 
                    evening={evening} 
                  />
                );
              })
            ) : (
              <div className="status-info">No itinerary available.</div>
            )}
          </div>
          
          <div className="mt-8 text-center border-t border-[var(--line-strong)] pt-8 pb-4 transition-all duration-500 hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 flex items-center justify-center gap-2">
              Adventure awaits! 
              <span className="inline-block animate-[bounce_2s_infinite]">🌍</span>
              <span className="inline-block animate-[bounce_2s_infinite_0.3s]">✈️</span>
            </h3>
            <p className="text-[var(--muted)] text-sm max-w-2xl mx-auto leading-relaxed">
              This personalized itinerary is your starting point. Feel free to explore, discover hidden gems, and make this journey uniquely yours. Have a wonderful, safe, and unforgettable trip to <span className="font-bold text-[var(--foreground)]">{destination}</span>!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
