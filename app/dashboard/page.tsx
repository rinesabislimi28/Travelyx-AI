"use client";
/**
 * Dashboard Page
 * 
 * The core premium dashboard for authenticated users. It manages saved trips and displays the
 * AI form generator interface. Serves as the primary parent component for managing user
 * travel states and rendering the mobile-friendly sidebar.
 */
import { useEffect, useState } from "react";
import AIForm from "../ai/AIForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../../lib/supabaseClient";
import TripView from "./TripView";
import Logo from "../components/Logo";
import Link from "next/link";

export type ItineraryDay = {
  day?: number;
  morning?: string[];
  afternoon?: string[];
  evening?: string[];
};

export type TripBudgetEstimate = {
  flight?: number;
  hotel_total?: number;
  daily_expenses_total?: number;
  total_trip_cost?: number;
};

export type TripItineraryData = {
  destination?: string;
  country?: string;
  overview?: string;
  local_event_or_festival?: string;
  best_time_to_visit?: string;
  itinerary?: ItineraryDay[];
  budget_estimate?: TripBudgetEstimate;
  user_budget?: number | string | null;
  departure?: string;
  formData?: any;
};

export type TripRecord = {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Traveler");

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn("Unable to load Supabase session:", sessionError.message);
        setLoading(false);
        return;
      }

      const user = sessionData.session?.user;

      if (!user) {
        setLoading(false);
        return;
      }
    
      if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
        localStorage.setItem("travelyx_avatar", user.user_metadata.avatar_url);
      }
      
      setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Traveler");
      const { data, error } = await supabase.from("trips").select("*").order("created_at", { ascending: false });
      if (error) console.warn("Unable to load trips:", error.message);
      if (data && !error) {
        setTrips(data);
        // Sync DB favorites with local state
        const dbFavs: Record<string, boolean> = {};
        data.forEach(trip => {
          if (trip.is_favorite) dbFavs[trip.id] = true;
        });
        
        // Merge with local ones just in case
        setFavorites(prev => ({ ...prev, ...dbFavs }));
      }
    } catch (error) {
      console.warn("Supabase request failed:", error);
    } finally {
      setLoading(false);
    }
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
    const savedAvatar = localStorage.getItem("travelyx_avatar");
    if (savedAvatar && !avatarUrl) setAvatarUrl(savedAvatar);
    
    fetchTrips();
  }, []);

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFavorite = !favorites[id];
    const newFavs = { ...favorites, [id]: isNowFavorite };
    setFavorites(newFavs);
    localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));

    // Try saving to DB (fails silently if SQL column not added yet)
    try {
      await supabase.from("trips").update({ is_favorite: isNowFavorite }).eq("id", id);
      setTrips(prev => prev.map(t => t.id === id ? { ...t, is_favorite: isNowFavorite } : t));
    } catch (err) {
      console.warn("Favorite not saved to DB", err);
    }
  };

  const confirmDelete = async () => {
    if (!tripToDelete || isDeleting) return;

    setIsDeleting(true);
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
      setIsDeleting(false);
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
    if (!editDestination.trim() || isSavingEdit) return setEditingTripId(null);

    setIsSavingEdit(true);
    try {
      const tripToEdit = trips.find((t) => t.id === id);
      const newDestination = editDestination.trim();
      
      let newItineraryData = tripToEdit?.itinerary_data ? { ...tripToEdit.itinerary_data } : {};
      newItineraryData.destination = newDestination;

      const { error } = await supabase.from("trips").update({ 
        destination: newDestination,
        itinerary_data: newItineraryData
      }).eq("id", id);
      
      if (error) throw error;

      setTrips((prev) => prev.map((trip) => (trip.id === id ? { ...trip, destination: newDestination, itinerary_data: newItineraryData } : trip)));
      if (selectedTrip?.id === id) {
        setSelectedTrip({ ...selectedTrip, destination: newDestination, itinerary_data: newItineraryData });
      }
      setEditingTripId(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      alert("Failed to update trip: " + message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const displayedTrips = activeTab === "favorites" ? trips.filter((trip) => favorites[trip.id]) : trips;
  const selectedTripId = selectedTrip?.id ?? null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen overflow-x-hidden lg:h-screen lg:overflow-hidden">
        {selectedTrip && (
          <div className="fixed inset-0 z-[60] bg-background overflow-y-auto">
            <TripView selectedTrip={selectedTrip} onClose={() => setSelectedTrip(null)} />
          </div>
        )}
        <div className={`flex min-h-screen flex-col overflow-x-hidden lg:h-screen lg:flex-row lg:overflow-hidden ${selectedTrip ? "hidden" : ""}`}>
          {isMobileSidebarOpen && (
              <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
            )}

            <aside
              className={`fixed inset-y-0 left-0 z-50 w-[90vw] max-w-[370px] border-r border-[var(--line)] bg-background/98 p-4 backdrop-blur-xl transition-transform duration-300 lg:static lg:h-screen lg:w-[360px] lg:max-w-none lg:translate-x-0 lg:overflow-hidden ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center gap-3 select-none mb-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-md border border-[#27272a] bg-[#09090b]">
                    <Logo className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="display-font text-2xl font-bold tracking-tight text-[var(--foreground)] leading-none mb-1">Travelyx</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[var(--muted)] leading-none">Travel AI Studio</p>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--muted)]">Travel history</p>
                    <h2 className="mt-1 text-lg font-bold text-foreground">Saved trips</h2>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button type="button" onClick={fetchTrips} className="button-secondary px-3 py-2 text-sm">
                      Refresh
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="rounded-full border border-[var(--line-strong)] bg-[var(--card-strong)] px-3 py-2 text-sm font-black text-foreground shadow-lg lg:hidden"
                      aria-label="Close history"
                    >
                      X
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 rounded-full border border-[var(--line)] bg-[var(--card)] p-1">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${activeTab === "all" ? "bg-foreground text-background" : "text-[var(--muted)]"}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("favorites")}
                    className={`flex-1 rounded-full px-4 py-2 text-sm font-bold ${activeTab === "favorites" ? "bg-foreground text-background" : "text-[var(--muted)]"}`}
                  >
                    Favorites
                  </button>
                </div>

                <div className="trip-scroll split-scroll mt-4 flex-1 space-y-3 overflow-y-auto pr-1 pb-4">
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-28 rounded-[1.4rem] border border-[var(--line)] bg-[var(--card)]" />
                      <div className="h-28 rounded-[1.4rem] border border-[var(--line)] bg-[var(--card)]" />
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
                          className={`cursor-pointer rounded-[1.5rem] border p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${selectedTripId === trip.id
                              ? "border-[#ff855f]/50 bg-[#ff855f]/10"
                              : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--line-strong)]"
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <button
                              onClick={(e) => toggleFavorite(trip.id, e)}
                              className={`mt-0.5 text-lg ${favorites[trip.id] ? "text-[#ffd166]" : "text-[var(--muted)]"}`}
                              title="Toggle favorite"
                            >
                              {favorites[trip.id] ? "★" : "☆"}
                            </button>

                            <div className="flex-1">
                              {editingTripId === trip.id ? (
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                  <input 
                                    value={editDestination} 
                                    onChange={(e) => setEditDestination(e.target.value)} 
                                    className="field px-3 py-2 text-sm" 
                                    disabled={isSavingEdit}
                                  />
                                  <button 
                                    onClick={(e) => saveEdit(trip.id, e)} 
                                    className="button-primary px-3 py-2 text-sm"
                                    disabled={isSavingEdit}
                                  >
                                    {isSavingEdit ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              ) : (
                                <>
                                  <p className="text-lg font-bold text-foreground">{trip.destination || "Saved trip"}</p>
                                  <p className="mt-1 text-sm text-[var(--muted)]">
                                    {data.departure ? `${data.departure} to ` : ""}
                                    {data.destination || trip.destination || "Destination"}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                            <span>{new Date(trip.created_at).toLocaleDateString("en-GB")}</span>
                            <span>{data.itinerary?.length || 0} days</span>
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-2 sm:p-3 flex flex-col justify-center">
                              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] line-clamp-1">Budget</p>
                              <p className="mt-1 text-sm font-bold text-foreground">€{userBudgetNumber}</p>
                            </div>
                            <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-2 sm:p-3 flex flex-col justify-center">
                              <p className="text-[10px] uppercase tracking-[0.1em] text-[var(--muted)] line-clamp-1">Cost</p>
                              <p className="mt-1 text-sm font-bold text-foreground">€{totalSpent}</p>
                            </div>
                            <div className={`rounded-2xl border ${userBudgetNumber - totalSpent < 0 ? 'border-[#ff5964]/30 bg-[#ff5964]/10' : 'border-[#35c6b3]/30 bg-[#35c6b3]/10'} p-2 sm:p-3 flex flex-col justify-center`}>
                              <p className={`text-[10px] uppercase tracking-[0.1em] ${userBudgetNumber - totalSpent < 0 ? 'text-[#ff5964]' : 'text-[#35c6b3]'} line-clamp-1`}>Left</p>
                              <p className={`mt-1 text-sm font-bold ${userBudgetNumber - totalSpent < 0 ? 'text-[#ff5964]' : 'text-[#35c6b3]'}`}>€{Math.abs(userBudgetNumber - totalSpent)}</p>
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

                <div className="mt-auto pt-4 border-t border-[var(--line-strong)] shrink-0">
                  <Link href="/profile" className="flex items-center gap-3 p-3 rounded-[1.2rem] bg-[var(--card)] border border-[var(--line)] hover:border-[#35c6b3]/50 transition-all group">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--card-strong)] text-lg font-bold text-[var(--foreground)] border border-[var(--line)] group-hover:border-[#35c6b3]">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        "T"
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[var(--foreground)] truncate">{userName}</p>
                      <p className="text-[10px] uppercase tracking-wider text-[var(--muted)] truncate">Manage Settings</p>
                    </div>
                    <svg className="w-4 h-4 text-[var(--muted)] group-hover:text-[#35c6b3] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1 overflow-x-hidden lg:h-screen lg:overflow-y-auto trip-scroll">
              <div className={`lg:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-xl border-b border-[var(--line-strong)] px-4 py-3 shadow-sm transition-transform duration-300 ${isMobileSidebarOpen ? '-translate-y-full' : 'translate-y-0'}`}>
                <button 
                  type="button" 
                  onClick={() => setIsMobileSidebarOpen(true)} 
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#35c6b3] border border-[#35c6b3] px-4 py-3 text-sm font-black text-black shadow-[0_0_25px_rgba(53,198,179,0.4)] transition-transform active:scale-[0.98] hover:shadow-[0_0_35px_rgba(53,198,179,0.6)] animate-[pulse_2s_infinite]"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                  OPEN SAVED TRIPS
                </button>
              </div>
              <div className="lg:hidden h-[72px]"></div>
              <AIForm onTripGenerated={fetchTrips} />
            </main>
          </div>

        {tripToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" onClick={() => !isDeleting && setTripToDelete(null)} />
            <div className="panel relative w-full max-w-md rounded-[2rem] p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-rose-300">Delete trip</p>
              <h3 className="mt-3 text-2xl font-bold text-foreground">Are you sure?</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                This will permanently remove the selected itinerary from your saved trips.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => setTripToDelete(null)} disabled={isDeleting} className="button-secondary flex-1">
                  Cancel
                </button>
                <button onClick={confirmDelete} disabled={isDeleting} className="button-danger flex-1">
                  {isDeleting ? "Deleting..." : "Delete trip"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
