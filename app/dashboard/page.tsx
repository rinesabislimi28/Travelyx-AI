"use client";
import { useEffect, useState } from "react";
import AIForm from "../ai/AIForm";
import ProtectedRoute from "../components/ProtectedRoute";
import { supabase } from "../../lib/supabaseClient";

/**
 * Dashboard Page Component 
 * ------------------------
 * Displays a Sidebar of saved trips from the Supabase Database 
 * and the main AI Form side-by-side. 
 * Includes ALL CRUD Operations: Create (in AIForm), Read, Update, Delete.
 */
export default function DashboardPage() {
  // ----------------------------
  // CORE STATE MANAGEMENT
  // ----------------------------
  const [trips, setTrips] = useState<any[]>([]); // Stores the array of generated trips from Supabase
  const [loading, setLoading] = useState(true); // Loading indicator for async operations
  const [favorites, setFavorites] = useState<Record<string, boolean>>({}); // LocalStorage-persisted favorites
  
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all'); // Toggles sidebar filter
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null); // The currently viewed trip itinerary
  
  // Editing & Deletion States (CRUD operations)
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editDestination, setEditDestination] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false); // Controls responsive drawer
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  // ----------------------------
  // READ OPERATION (CRUD)
  // ----------------------------
  // Fetches trips via Supabase SDK. Note that due to Row Level Security (RLS)
  // policies enabled on the database, the user session implicitly filters the query.
  // There is no need to write '.eq('user_id', current_user)' because Postgres 
  // enforces this securely at the database engine level.
  const fetchTrips = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // FETCH trips via Supabase (RLS ensures user only sees their own)
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTrips(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedFavs = localStorage.getItem("travelyx_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) { console.error(e); }
    }
    fetchTrips();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = { ...favorites, [id]: !favorites[id] };
    setFavorites(newFavs);
    localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));
  };

  // ----------------------------
  // DELETE OPERATION (CRUD)
  // ----------------------------
  const requestDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTripToDelete(id);
  };

  const confirmDelete = async () => {
    if (!tripToDelete) return;

    try {
      const { error } = await supabase.from('trips').delete().eq('id', tripToDelete);
      if (error) throw error;

      setTrips(prev => prev.filter(t => t.id !== tripToDelete));
      if (selectedTrip?.id === tripToDelete) setSelectedTrip(null);

      if (favorites[tripToDelete]) {
        const newFavs = { ...favorites };
        delete newFavs[tripToDelete];
        setFavorites(newFavs);
        localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));
      }
    } catch (err: any) {
      alert("Failed to delete trip: " + err.message);
    } finally {
      setTripToDelete(null);
    }
  };

  // ----------------------------
  // UPDATE OPERATION (CRUD)
  // ----------------------------
  // Updates the specific destination name field while preserving the JSON itinerary data.
  const startEdit = (trip: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTripId(trip.id);
    setEditDestination(trip.destination);
  };

  const saveEdit = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editDestination.trim()) return setEditingTripId(null);

    try {
      const { error } = await supabase.from('trips').update({ destination: editDestination }).eq('id', id);
      if (error) throw error;

      setTrips(prev => prev.map(t => t.id === id ? { ...t, destination: editDestination } : t));
      setEditingTripId(null);

      if (selectedTrip?.id === id) {
        setSelectedTrip({ ...selectedTrip, destination: editDestination });
      }
    } catch (err: any) {
      alert("Failed to update trip: " + err.message);
    }
  };

  // ----------------------------
  // RENDER HELPERS
  // ----------------------------
  // Filters trips dynamically based on the currently selected tab (All vs Favorites)
  const displayedTrips = activeTab === 'favorites' ? trips.filter(t => favorites[t.id]) : trips;

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
      user_budget = null
    } = selectedTrip.itinerary_data;

    const userBudgetNumber = Number(user_budget) || Number(selectedTrip.budget) || Number(budget_estimate?.total_trip_cost) || 0;
    const totalSpent = Number(budget_estimate?.total_trip_cost) || 0;
    const remaining = userBudgetNumber - totalSpent;

    return (
      <div className="w-full min-h-screen relative p-6 md:p-10 flex flex-col items-center bg-[#f8fafc] overflow-x-hidden pt-12 md:pt-20">
        <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-700 rounded-b-[3rem] shadow-xl z-0 overflow-hidden border-b-4 border-indigo-400/20"></div>

        <div className="w-full max-w-5xl z-10 mb-6 flex justify-between items-end px-2 md:px-0">
          <button
            onClick={() => setSelectedTrip(null)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-white/20 transition-all font-bold shadow-lg"
          >
            ← Back to Trip Planner
          </button>
        </div>

        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-3xl border border-white/80 rounded-[1.5rem] md:rounded-[2rem] shadow-[0_20px_50px_rgba(30,30,80,0.08)] p-4 sm:p-6 md:p-10 z-10">
          <div className="mb-4 md:mb-6">
            <p className="font-black text-indigo-900 text-2xl md:text-3xl mb-2">{destination}, {country}</p>
            <p className="mb-4 text-slate-600 leading-relaxed font-medium text-base md:text-lg">{overview}</p>
            {local_event_or_festival && <p className="text-purple-600 font-bold mb-4 flex items-center gap-2 bg-purple-50 flex-wrap p-2.5 rounded-xl border border-purple-100 text-sm md:text-base"><span className="text-xl md:text-2xl">🎉</span> {local_event_or_festival}</p>}
            <div className="mt-2">
              <p className="text-xs md:text-sm font-bold text-slate-500 bg-slate-100 inline-flex px-3 py-1.5 md:px-4 md:py-2 rounded-full uppercase tracking-wider md:tracking-widest border border-slate-200 shadow-sm items-center gap-1.5 w-fit">
                <span className="text-slate-400">🌤</span><span className="hidden sm:inline">Best Time to Visit:</span> <span className="text-slate-800">{best_time_to_visit}</span>
              </p>
            </div>
          </div>

          <div className="mb-8 md:mb-10 mt-6 md:mt-8">
            <h3 className="font-extrabold text-slate-800 text-xl md:text-2xl mb-6 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" /></svg>
              Daily Itinerary
            </h3>
            <div className="relative border-l-4 border-indigo-100 ml-3 md:ml-6 pb-2">
              {itinerary.length > 0 ? itinerary.map((day: any, idx: number) => {
                const dayNum = day.day ?? (idx + 1);
                const morning = day.morning ?? ["Free time"];
                const afternoon = day.afternoon ?? ["Free time"];
                const evening = day.evening ?? ["Free time"];
                return (
                  <div key={dayNum} className="mb-8 md:mb-12 relative pl-6 md:pl-12">
                    <div className="absolute left-[-18px] md:left-[-22px] top-0 bg-indigo-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 md:ring-8 ring-[#ffffff] text-sm md:text-lg">
                      {dayNum}
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 md:px-6 md:py-4">
                        <h4 className="font-black text-indigo-950 text-lg md:text-xl tracking-tight">Day {dayNum}</h4>
                      </div>
                      <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-orange-100/60 relative overflow-hidden transition-all hover:shadow-md">
                            <h5 className="font-black text-orange-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-500 shadow-sm"></div> Morning</h5>
                            <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                              {morning.map((act: string, i: number) => <li key={i} className="flex gap-2 items-start"><span className="text-orange-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                            </ul>
                          </div>
                          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-emerald-100/60 relative overflow-hidden transition-all hover:shadow-md">
                            <h5 className="font-black text-emerald-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> Afternoon</h5>
                            <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                              {afternoon.map((act: string, i: number) => <li key={i} className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                            </ul>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-indigo-100/60 relative overflow-hidden transition-all hover:shadow-md">
                            <h5 className="font-black text-indigo-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> Evening</h5>
                            <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                              {evening.map((act: string, i: number) => <li key={i} className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : <p className="text-slate-500 italic pl-6">No itinerary available.</p>}
            </div>
          </div>

          <div className="bg-slate-50 border-2 border-slate-200 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm relative overflow-hidden">
            <p className="font-black text-slate-800 mb-6 text-2xl flex items-center gap-3">💰 Estimated Budget Breakdown</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Your Budget</span> 
                <span className="font-black text-3xl text-indigo-600">€{userBudgetNumber}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Total Spent</span> 
                <span className="font-black text-3xl text-slate-800">€{totalSpent}</span>
              </div>
              <div className={`p-5 rounded-2xl shadow-sm border flex flex-col items-center justify-center ${remaining >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <span className={`text-sm font-bold uppercase tracking-widest mb-1 text-center ${remaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>Remaining Funds</span> 
                <span className={`font-black text-3xl ${remaining >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {remaining >= 0 ? `€${remaining}` : `-€${Math.abs(remaining)}`}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-700 font-medium mb-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:border-indigo-200">
                <span className="text-lg">✈️ Flight Estimates</span> <span className="font-black text-xl">€{budget_estimate?.flight ?? 0}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center transition-all hover:border-indigo-200">
                <span className="text-lg">🏨 Hotel Estimates</span> <span className="font-black text-xl">€{budget_estimate?.hotel_total ?? 0}</span>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center md:col-span-2 transition-all hover:border-indigo-200">
                <span className="text-lg">🍽 Daily Expenses</span> <span className="font-black text-xl">€{budget_estimate?.daily_expenses_total ?? 0}</span>
              </div>
            </div>
            <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-lg">
              <span className="font-black text-slate-300 text-lg sm:text-xl md:text-2xl uppercase tracking-wider mb-2 sm:mb-0">Total Estimated Trip Cost</span>
              <span className="font-black text-4xl text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl">€{budget_estimate?.total_trip_cost ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#fafcff] flex flex-col lg:flex-row overflow-hidden relative font-sans">
        {/* Dynamic Vibrant Mesh Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-400/30 blur-[120px] rounded-full animate-blob mix-blend-multiply"></div>
          <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-sky-400/30 blur-[120px] rounded-full animate-blob animation-delay-2000 mix-blend-multiply"></div>
        </div>
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => setIsMobileSidebarOpen(false)}></div>
        )}

        {/* Left Sidebar: Saved Trips */}
        <aside className={`fixed lg:relative top-0 left-0 w-full sm:w-[350px] lg:w-[420px] h-screen glass-panel p-5 lg:p-6 flex flex-col overflow-y-auto shrink-0 border-r border-slate-200/50 shadow-[4px_0_40px_rgba(30,30,90,0.05)] z-50 transition-transform duration-500 custom-scrollbar-light ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <div className="flex items-center justify-between mb-5 sticky top-0 bg-white z-30 pb-3 pt-1 border-b border-transparent">
            <h2 className="text-xl md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-700 to-purple-600 tracking-tight">Travel History</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={fetchTrips}
                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors border border-slate-200 group shadow-sm"
                title="Refresh Trips"
              >
                <svg className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden p-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-500 rounded-full transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/50 p-4 rounded-xl shadow-sm shrink-0 leading-relaxed relative overflow-hidden">
            <div className="absolute top-[-15px] right-[-15px] text-6xl opacity-20 drop-shadow-sm">🌍</div>
            <h3 className="text-indigo-800 font-black mb-1.5 flex items-center gap-2 text-[15px] tracking-tight">Ready for your next adventure?</h3>
            <p className="text-indigo-600/80 text-[13px] font-semibold">
              {trips.length > 0 
                ? `${trips.length} amazing trips saved! Planning to depart soon? The world is yours to explore — live the moment!`
                : `You haven't saved any trips yet. It's the perfect time to start planning your dream holiday!`
              }
            </p>
          </div>

          <div className="flex gap-2 mb-5 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 shrink-0 z-30 shadow-inner">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg text-[13px] font-extrabold transition-all tracking-wide ${activeTab === 'all' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              All History
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 flex justify-center items-center gap-1.5 py-1.5 rounded-lg text-[13px] font-extrabold transition-all tracking-wide ${activeTab === 'favorites' ? 'bg-white text-amber-600 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ★ Favorites
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar-light relative z-0 pb-10">
            {loading ? (
              <div className="flex flex-col gap-4 animate-pulse pt-2">
                <div className="h-28 bg-slate-100 rounded-[1.25rem]"></div>
                <div className="h-28 bg-slate-100 rounded-[1.25rem]"></div>
              </div>
            ) : displayedTrips.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center mt-6 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center text-2xl mb-4">{activeTab === 'favorites' ? '⭐' : '🧳'}</div>
                <p className="text-slate-500 font-bold">No trips {activeTab === 'favorites' ? 'favorited' : 'saved'} yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
              {displayedTrips.map(trip => {
                const iData = trip.itinerary_data || {};
                const userBudgetNumber = Number(iData.user_budget) || Number(trip.budget) || Number(iData.budget_estimate?.total_trip_cost) || 0;
                const totalSpent = Number(iData.budget_estimate?.total_trip_cost) || 0;
                const remaining = userBudgetNumber - totalSpent;
                const days = iData.itinerary?.length || 3;

                return (
                <div
                  key={trip.id}
                  onClick={() => {
                    setSelectedTrip(trip);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`relative p-5 rounded-[1.25rem] border transition-all hover:-translate-y-1 group cursor-pointer overflow-hidden ${selectedTrip?.id === trip.id
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-[0_8px_20px_rgba(99,102,241,0.08)]'
                      : 'bg-white hover:bg-slate-50 border-slate-200 shadow-sm hover:shadow-md'
                    }`}
                >
                  {selectedTrip?.id === trip.id && <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>}
                  
                  {/* Action Buttons (visible on hover) */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                    <button
                      onClick={(e) => startEdit(trip, e)}
                      className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 bg-white shadow-sm border border-slate-100 transition-colors"
                      title="Rename Trip"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button
                      onClick={(e) => requestDelete(trip.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 bg-white shadow-sm border border-slate-100 transition-colors"
                      title="Delete Trip Permanently"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>

                  <div className="flex items-start mb-2 pr-16 z-0 relative">
                    <button
                      onClick={(e) => toggleFavorite(trip.id, e)}
                      className="focus:outline-none transform hover:scale-110 transition-transform pt-0.5 mr-3 shrink-0 z-10"
                      title={favorites[trip.id] ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      {favorites[trip.id] ? (
                        <span className="text-amber-400 text-2xl drop-shadow-md block leading-none">★</span>
                      ) : (
                        <span className="text-slate-300 hover:text-amber-200 text-2xl block leading-none">☆</span>
                      )}
                    </button>

                    <div className="flex-1">
                      {editingTripId === trip.id ? (
                        <div className="flex items-center gap-1.5 mb-2 bg-slate-50 border border-slate-200 p-1.5 rounded-lg z-30 relative shadow-inner" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editDestination}
                            onChange={(e) => setEditDestination(e.target.value)}
                            className="bg-white border border-slate-200 rounded text-slate-800 px-2 py-1 outline-none font-bold text-sm w-[110px] focus:ring-2 focus:ring-indigo-500/20"
                            autoFocus
                          />
                          <button onClick={(e) => saveEdit(trip.id, e)} className="text-emerald-600 bg-emerald-50 border border-emerald-100 p-1 hover:bg-emerald-100 rounded transition-colors" title="Save"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></button>
                          <button onClick={(e) => { e.stopPropagation(); setEditingTripId(null); }} className="text-red-500 bg-red-50 border border-red-100 p-1 hover:bg-red-100 rounded transition-colors" title="Cancel"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      ) : (
                        <h3 className="font-extrabold text-slate-800 text-[16px] leading-tight flex items-center gap-2 flex-wrap mb-1">
                          {trip.itinerary_data?.departure?.split(',')[0]} 
                          {trip.itinerary_data?.departure && <svg className="w-4 h-4 text-indigo-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                          <span className="text-indigo-700">{trip.destination?.split(',')[0] || "Trip"}</span>
                        </h3>
                      )}
                      
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                       <span className="flex items-center gap-1.5">
                         <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         {new Date(trip.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year:'numeric'})}
                       </span>
                       <span className="flex items-center gap-1.5"><span className="text-slate-400 text-sm">⏱</span> {days} Days</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="bg-slate-50 rounded-lg p-1.5 flex flex-col items-center border border-slate-100 shadow-inner">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Budget</span>
                        <span className="text-[12px] text-indigo-600 font-black">€{userBudgetNumber}</span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-1.5 flex flex-col items-center border border-slate-100 shadow-inner">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Cost</span>
                        <span className="text-[12px] text-slate-700 font-black">€{totalSpent}</span>
                      </div>
                      <div className={`${remaining >= 0 ? 'bg-emerald-50' : 'bg-red-50'} rounded-lg p-1.5 flex flex-col items-center border ${remaining >= 0 ? 'border-emerald-100' : 'border-red-100'} shadow-inner`}>
                        <span className={`text-[9px] uppercase font-black tracking-widest ${remaining >= 0 ? 'text-emerald-500' : 'text-red-400'}`}>Left</span>
                        <span className={`text-[12px] font-black ${remaining >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {remaining >= 0 ? `€${remaining}` : `-€${Math.abs(remaining)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )})}
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 w-full lg:h-screen overflow-y-auto bg-[#f8fafc] flex flex-col relative">
          {/* Mobile Header Trigger */}
          <div className="lg:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-30 shadow-sm">
            <h1 className="text-slate-800 font-black text-xl flex items-center gap-2 tracking-tight"><span className="text-indigo-600">✈️</span> Travelyx</h1>
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 p-2 px-4 rounded-xl flex items-center gap-2 text-sm font-bold shadow-sm transition-all"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
              My Trips
              {trips.length > 0 && <span className="bg-white text-indigo-700 font-black px-2 py-0.5 rounded-full text-[10px] ml-1 shadow-sm border border-indigo-50">{trips.length}</span>}
            </button>
          </div>
          
          <div className="flex-1 w-full relative">
            {selectedTrip ? renderTripView() : <AIForm onTripGenerated={fetchTrips} />}
          </div>
        </main>

        {/* Delete Confirmation Modal */}
        {tripToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setTripToDelete(null)}></div>
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 overflow-hidden transform transition-all scale-100 opacity-100 animate-fade-in-up">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                <span className="text-3xl">🗑️</span>
              </div>
              <h3 className="text-xl font-black text-center text-slate-800 mb-2">Delete Trip?</h3>
              <p className="text-sm font-medium text-slate-500 text-center mb-6 px-2">
                Are you sure you want to permanently delete this trip? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setTripToDelete(null)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-3 rounded-xl transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-red-500/30"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar-light::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-light::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .custom-scrollbar-light::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}} />
    </ProtectedRoute>
  );
}
