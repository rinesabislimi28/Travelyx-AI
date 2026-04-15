import React from "react";
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
  } = selectedTrip.itinerary_data;

  const userBudgetNumber = Number(user_budget) || Number(selectedTrip.budget) || Number(budget_estimate?.total_trip_cost) || 0;
  const totalSpent = Number(budget_estimate?.total_trip_cost) || 0;
  const remaining = userBudgetNumber - totalSpent;

  return (
    <div className="min-h-screen px-3 py-4 sm:px-4 sm:py-5">
      <div className="shell">
        <div className="panel rounded-[2rem] p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">Saved itinerary</p>
              <h2 className="section-title mt-3 text-3xl font-bold text-white sm:text-4xl">
                {destination}, {country}
              </h2>
              {departure && <p className="mt-3 text-sm text-slate-400">Departure: {departure}</p>}
            </div>
            <button onClick={onClose} className="button-primary mt-4 sm:mt-0 shadow-xl px-6">
              ← Back to planner
            </button>
          </div>

          <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
            <p className="text-sm leading-7 text-slate-300 sm:text-base">{overview}</p>
            {local_event_or_festival && <div className="status-info mt-4">{local_event_or_festival}</div>}
            <p className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-slate-300">
              Best time to visit: <span className="ml-2 font-bold text-white">{best_time_to_visit}</span>
            </p>
          </div>

          {/* Budget Overview Moved to Top */}
          <div className="mt-6 rounded-[1.6rem] border border-[#ffd166]/20 bg-[#ffd166]/5 p-5 sm:p-6 shadow-[0_0_30px_rgba(255,209,102,0.05)]">
            <p className="text-xl font-bold text-white">Budget overview</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="metric-card bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your budget</p>
                <p className="mt-2 text-3xl font-bold text-[#ffd166]">EUR {userBudgetNumber}</p>
              </div>
              <div className="metric-card bg-slate-950/40">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Estimated cost</p>
                <p className="mt-2 text-3xl font-bold text-white">EUR {totalSpent}</p>
              </div>
              <div className={`metric-card ${remaining >= 0 ? "border-emerald-400/20 bg-emerald-400/10" : "border-red-400/20 bg-red-400/10"}`}>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Remaining</p>
                <p className={`mt-2 text-3xl font-bold ${remaining >= 0 ? "text-[#35c6b3]" : "text-rose-300"}`}>EUR {remaining}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {itinerary.length > 0 ? (
              itinerary.map((day: ItineraryDay, idx: number) => {
                const dayNum = day.day ?? idx + 1;
                const morning = day.morning ?? ["Free time"];
                const afternoon = day.afternoon ?? ["Free time"];
                const evening = day.evening ?? ["Free time"];

                return (
                  <div key={dayNum} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                    <h3 className="text-xl font-bold text-white">Day {dayNum}</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      <div className="rounded-[1.2rem] border border-[#ffd166]/20 bg-[#ffd166]/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#ffe3a1]">Morning</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                          {morning.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[1.2rem] border border-[#35c6b3]/20 bg-[#35c6b3]/10 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-[#9ff0e5]">Afternoon</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                          {afternoon.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/10 bg-slate-950/35 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Evening</p>
                        <ul className="mt-3 space-y-2 text-sm leading-7 text-slate-200">
                          {evening.map((item: string, i: number) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="status-info">No itinerary available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
