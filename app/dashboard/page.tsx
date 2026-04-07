"use client";

import { useEffect, useState } from "react";
import AIForm from "../ai/AIForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../../lib/supabaseClient";

type ItineraryDay = {
  day?: number;
  morning?: string[];
  afternoon?: string[];
  evening?: string[];
};

type TripBudgetEstimate = {
  total_trip_cost?: number;
};

type TripItineraryData = {
  destination?: string;
  country?: string;
  overview?: string;
  local_event_or_festival?: string;
  best_time_to_visit?: string;
  itinerary?: ItineraryDay[];
  budget_estimate?: TripBudgetEstimate;
  user_budget?: number | string | null;
  departure?: string;
};

type TripRecord = {
  id: string;
  destination: string;
  budget: string | number;
  created_at: string;
  itinerary_data?: TripItineraryData;
};

export default function DashboardPage() {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"all" | "favorites">("all");
  const [selectedTrip, setSelectedTrip] = useState<TripRecord | null>(null);
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editDestination, setEditDestination] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const fetchTrips = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
    if (data && !error) setTrips(data);
    setLoading(false);
  };

  useEffect(() => {
    const savedFavs = localStorage.getItem("travelyx_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (error) {
        console.error(error);
      }
    }
    fetchTrips();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavs);
    localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      const { error } = await supabase.from("trips").delete().eq("id", tripToDelete);
      if (error) throw error;

      setTrips((prev) => prev.filter((trip) => trip.id !== tripToDelete));
      if (selectedTrip?.id === tripToDelete) setSelectedTrip(null);

      if (favorites[tripToDelete]) {
        const newFavs = { ...favorites };
        delete newFavs[tripToDelete];
        setFavorites(newFavs);
        localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to delete trip: " + message);
    } finally {
      setTripToDelete(null);
    }
  };

  const startEdit = (trip: TripRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTripId(trip.id);
    setEditDestination(trip.destination);
  };

  const saveEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editDestination.trim()) return setEditingTripId(null);

    try {
      const { error } = await supabase.from("trips").update({ destination: editDestination.trim() }).eq("id", id);
      if (error) throw error;

      setTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, destination: editDestination.trim() } : trip)));
      if (selectedTrip?.id === id) {
        setSelectedTrip({ ...selectedTrip, destination: editDestination.trim() });
      }
      setEditingTripId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to update trip: " + message);
    }
  };

  const displayedTrips = activeTab === "favorites" ? trips.filter((trip) => favorites[trip.id]) : trips;
  const selectedTripId = selectedTrip?.id ?? null;

  const renderTripView = () => {
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
              <button onClick={() => setSelectedTrip(null)} className="button-secondary">
                Back to planner
              </button>
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="text-sm leading-7 text-slate-300 sm:text-base">{overview}</p>
              {local_event_or_festival && <div className="status-info mt-4">{local_event_or_festival}</div>}
              <p className="mt-4 inline-flex rounded-full border border-white/10 bg-slate-950/30 px-4 py-2 text-sm text-slate-300">
                Best time to visit: <span className="ml-2 font-bold text-white">{best_time_to_visit}</span>
              </p>
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

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-slate-950/30 p-5 sm:p-6">
              <p className="text-xl font-bold text-white">Budget overview</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="metric-card">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your budget</p>
                  <p className="mt-2 text-3xl font-bold text-[#ffd166]">EUR {userBudgetNumber}</p>
                </div>
                <div className="metric-card">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Estimated cost</p>
                  <p className="mt-2 text-3xl font-bold text-white">EUR {totalSpent}</p>
                </div>
                <div className={`metric-card ${remaining >= 0 ? "border-emerald-400/20 bg-emerald-400/10" : "border-red-400/20 bg-red-400/10"}`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Remaining</p>
                  <p className={`mt-2 text-3xl font-bold ${remaining >= 0 ? "text-[#35c6b3]" : "text-rose-300"}`}>EUR {remaining}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className={selectedTrip ? "min-h-screen overflow-x-hidden" : "min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden"}>
        {selectedTrip ? (
          renderTripView()
        ) : (
          <div className="flex min-h-screen flex-col overflow-x-hidden lg:h-screen lg:flex-row lg:overflow-hidden">
            {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-50 w-[90vw] max-w-[370px] border-r border-white/10 bg-[#07101d]/98 p-4 backdrop-blur-xl transition-transform duration-300 lg:static lg:h-screen lg:w-[360px] lg:max-w-none lg:translate-x-0 lg:overflow-hidden ${
                isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Travel history</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Saved trips</h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={fetchTrips} className="button-secondary px-3 py-2 text-sm">
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="rounded-full border border-white/15 bg-white/8 px-3 py-2 text-sm font-black text-white shadow-lg lg:hidden"
                      aria-label="Close history"
                    >
                      X
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 rounded-full border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${activeTab === "all" ? "bg-white text-slate-950" : "text-slate-300"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${activeTab === "favorites" ? "bg-white text-slate-950" : "text-slate-300"}`}
                  >
                    Favorites
                  </button>
                </div>

                <div className="trip-scroll split-scroll mt-4 flex-1 space-y-3 overflow-y-auto pr-1 pb-4">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-28 rounded-[1.4rem] border border-white/10 bg-white/5" />
                      <div className="h-28 rounded-[1.4rem] border border-white/10 bg-white/5" />
                    </div>
                  ) : displayedTrips.length === 0 ? (
                    <div className="status-info">No trips found in this section yet.</div>
                  ) : (
                    displayedTrips.map((trip) => {
                      const data = trip.itinerary_data || {};
                      const userBudgetNumber = Number(data.user_budget) || Number(trip.budget) || 0;
                      const totalSpent = Number(data.budget_estimate?.total_trip_cost) || 0;

                      return (
                        <div
                          key={trip.id}
                          onClick={() => {
                            setSelectedTrip(trip);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`cursor-pointer rounded-[1.5rem] border p-4 ${
                            selectedTripId === trip.id
                              ? "border-[#ff855f]/50 bg-[#ff855f]/10"
                              : "border-white/10 bg-white/5 hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              onClick={(e) => toggleFavorite(trip.id, e)}
                              className={`mt-0.5 text-lg ${favorites[trip.id] ? "text-[#ffd166]" : "text-slate-500"}`}
                              title="Toggle favorite"
                            >
                              {favorites[trip.id] ? "★" : "☆"}
                            </button>

                            <div className="flex-1">
                              {editingTripId === trip.id ? (
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input value={editDestination} onChange={(e) => setEditDestination(e.target.value)} className="field px-3 py-2 text-sm" />
                                  <button onClick={(e) => saveEdit(trip.id, e)} className="button-primary px-3 py-2 text-sm">
                                    Save
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-lg font-bold text-white">{trip.destination || "Saved trip"}</p>
                                  <p className="mt-1 text-sm text-slate-400">
                                    {data.departure ? `${data.departure} to ` : ""}
                                    {data.destination || trip.destination || "Destination"}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
                            <span>{new Date(trip.created_at).toLocaleDateString("en-GB")}</span>
                            <span>{data.itinerary?.length || 0} days</span>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Budget</p>
                              <p className="mt-1 text-lg font-bold text-white">EUR {userBudgetNumber}</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-3">
                              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Cost</p>
                              <p className="mt-1 text-lg font-bold text-white">EUR {totalSpent}</p>
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button onClick={(e) => startEdit(trip, e)} className="button-secondary px-3 py-2 text-xs">
                              Rename
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setTripToDelete(trip.id); }} className="button-secondary px-3 py-2 text-xs">
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-x-hidden lg:h-screen lg:overflow-hidden">
              <div className="lg:hidden px-3 pt-3">
                <button type="button" onClick={() => setIsMobileSidebarOpen(true)} className="button-secondary w-full justify-center border-white/20 bg-white/10">
                  Open saved trips
                </button>
              </div>
              <AIForm onTripGenerated={fetchTrips} />
            </main>
          </div>
        )}

        {tripToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setTripToDelete(null)} />
            <div className="panel relative w-full max-w-md rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-rose-300">Delete trip</p>
              <h3 className="mt-3 text-2xl font-bold text-white">Are you sure?</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                This will permanently remove the selected itinerary from your saved trips.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setTripToDelete(null)} className="button-secondary flex-1">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="button-danger flex-1">
                  Delete trip
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
