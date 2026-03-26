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
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  
  // State for Navigation
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [selectedTrip, setSelectedTrip] = useState<any | null>(null);

  // State for Updating Trips
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [editDestination, setEditDestination] = useState("");

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
  // Permanently removes the record from Supabase. The RLS "Users can delete their own trips"
  // policy guarantees that malicious users cannot arbitrarily delete records belonging to others.
  const deleteTrip = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmDelete = window.confirm("Are you sure you want to permanently delete this trip from your history?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
      
      setTrips(prev => prev.filter(t => t.id !== id));
      if (selectedTrip?.id === id) setSelectedTrip(null);
      
      if (favorites[id]) {
        const newFavs = { ...favorites };
        delete newFavs[id];
        setFavorites(newFavs);
        localStorage.setItem("travelyx_favorites", JSON.stringify(newFavs));
      }
    } catch (err: any) {
      alert("Failed to delete trip: " + err.message);
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
      budget_estimate = {}
    } = selectedTrip.itinerary_data;

    return (
      <div className="w-full min-h-screen relative p-6 md:p-10 flex flex-col items-center bg-[#f8fafc] overflow-x-hidden pt-12 md:pt-20">
        <div className="absolute top-0 left-0 w-full h-[250px] bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-700 rounded-b-[3rem] shadow-xl z-0 overflow-hidden border-b-4 border-indigo-400/20"></div>
        
        <div className="w-full max-w-5xl z-10 mb-6 flex justify-between items-end">
          <button 
            onClick={() => setSelectedTrip(null)}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-white/20 transition-all font-bold shadow-lg"
          >
            ← Back to Trip Planner
          </button>
        </div>

        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-3xl border border-white/80 rounded-[2rem] shadow-[0_20px_50px_rgba(30,30,80,0.08)] p-6 md:p-10 z-10">
          <div className="mb-6">
            <p className="font-black text-indigo-900 text-3xl mb-2">{destination}, {country}</p>
            <p className="mb-4 text-slate-600 leading-relaxed font-medium text-lg">{overview}</p>
            {local_event_or_festival && <p className="text-purple-600 font-bold mb-3 flex items-center gap-2 bg-purple-50 inline-flex p-2 rounded-xl border border-purple-100"><span className="text-2xl">🎉</span> {local_event_or_festival}</p>}
            <div className="mt-2">
                 <p className="text-sm font-bold text-slate-500 bg-slate-100 inline-block px-4 py-2 rounded-full uppercase tracking-widest border border-slate-200 shadow-sm">
                   <span className="text-slate-400 mr-2">🌤</span>Best Time to Visit: <span className="text-slate-800 ml-1">{best_time_to_visit}</span>
                 </p>
            </div>
          </div>

          <div className="mb-10 mt-8">
              <h3 className="font-extrabold text-slate-800 text-2xl mb-8 flex items-center gap-3 border-b-2 border-slate-100 pb-4">
                <svg className="w-7 h-7 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg> 
                Daily Itinerary
              </h3>
              <div className="relative border-l-4 border-indigo-100 ml-5 md:ml-6 pb-2">
                {itinerary.length > 0 ? itinerary.map((day: any, idx: number) => {
                  const dayNum = day.day ?? (idx + 1);
                  const morning = day.morning ?? ["Free time"];
                  const afternoon = day.afternoon ?? ["Free time"];
                  const evening = day.evening ?? ["Free time"];
                  return (
                    <div key={dayNum} className="mb-12 relative pl-10 md:pl-12">
                      <div className="absolute left-[-22px] top-0 bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-8 ring-[#ffffff] text-lg">
                        {dayNum}
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
                          <h4 className="font-black text-indigo-950 text-xl tracking-tight">Day {dayNum}</h4>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                             <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <h5 className="font-black text-orange-600 mb-3 uppercase tracking-widest text-xs flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-sm"></div> Morning</h5>
                                <ul className="list-none space-y-2 text-slate-800 font-medium text-sm leading-relaxed">
                                  {morning.map((act: string, i: number) => <li key={i} className="flex gap-2.5 items-start"><span className="text-orange-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                                </ul>
                             </div>
                             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <h5 className="font-black text-emerald-600 mb-3 uppercase tracking-widest text-xs flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> Afternoon</h5>
                                <ul className="list-none space-y-2 text-slate-800 font-medium text-sm leading-relaxed">
                                  {afternoon.map((act: string, i: number) => <li key={i} className="flex gap-2.5 items-start"><span className="text-emerald-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                                </ul>
                             </div>
                             <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <h5 className="font-black text-indigo-600 mb-3 uppercase tracking-widest text-xs flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> Evening</h5>
                                <ul className="list-none space-y-2 text-slate-800 font-medium text-sm leading-relaxed">
                                  {evening.map((act: string, i: number) => <li key={i} className="flex gap-2.5 items-start"><span className="text-indigo-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
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

          <div className="bg-slate-50 border-2 border-slate-200 p-8 rounded-[2rem] shadow-sm relative overflow-hidden">
              <p className="font-black text-slate-800 mb-6 text-2xl flex items-center gap-3">💰 Estimated Budget Breakdown</p>
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
      <div className="min-h-screen bg-slate-900 flex flex-col md:flex-row">
        {/* Left Sidebar: Saved Trips */}
        <aside className="w-full md:w-[350px] bg-slate-950 border-r border-slate-800 p-6 flex flex-col h-screen overflow-y-auto shrink-0 shadow-2xl z-20 custom-scrollbar-dark relative">
           <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-950 z-30 pb-2 pt-2">
             <h2 className="text-xl md:text-2xl font-black text-white bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400">My Trips</h2>
             <button 
                onClick={fetchTrips} 
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group ml-2"
                title="Refresh Trips"
             >
                <svg className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
           </div>
           
           <div className="flex gap-2 mb-6 bg-slate-900 p-1.5 rounded-xl border border-slate-800 shrink-0 sticky top-14 z-30">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                All History
              </button>
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'favorites' ? 'bg-amber-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                ★ Favorites
              </button>
           </div>

           {loading ? (
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-28 bg-slate-800/80 rounded-2xl"></div>
                <div className="h-28 bg-slate-800/80 rounded-2xl"></div>
              </div>
           ) : displayedTrips.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center mt-10 p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-2xl mb-4">{activeTab === 'favorites' ? '⭐' : '🧳'}</div>
                <p className="text-slate-300 font-medium">No trips {activeTab === 'favorites' ? 'favorited' : 'saved'} yet.</p>
             </div>
           ) : (
             <div className="flex flex-col gap-4 pb-10">
               {displayedTrips.map(trip => (
                 <div 
                   key={trip.id} 
                   onClick={() => setSelectedTrip(trip)}
                   className={`relative p-5 rounded-2xl shadow-lg border transition-all hover:-translate-y-1 group cursor-pointer ${
                     selectedTrip?.id === trip.id 
                       ? 'bg-indigo-900 border-indigo-500 shadow-indigo-500/20' 
                       : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50 shadow-black/20'
                   }`}
                 >
                    {/* Action Buttons (visible on hover) */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                      <button 
                        onClick={(e) => startEdit(trip, e)}
                        className="text-slate-500 hover:text-blue-400 p-2 rounded-lg hover:bg-blue-500/10"
                        title="Rename Trip"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button 
                        onClick={(e) => deleteTrip(trip.id, e)}
                        className="text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10"
                        title="Delete Trip Permanently"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
                          <span className="text-slate-600 hover:text-amber-200 text-2xl block leading-none">☆</span>
                        )}
                      </button>

                      <div className="flex-1">
                        {editingTripId === trip.id ? (
                          <div className="flex items-center gap-1 mb-2 bg-slate-900 border border-slate-700 p-1 rounded-lg z-30 relative" onClick={e => e.stopPropagation()}>
                            <input 
                              type="text" 
                              value={editDestination} 
                              onChange={(e) => setEditDestination(e.target.value)}
                              className="bg-transparent text-white px-2 py-1 outline-none font-bold text-sm w-[110px]"
                              autoFocus
                            />
                            <button onClick={(e) => saveEdit(trip.id, e)} className="text-emerald-400 p-1 hover:bg-emerald-400/20 rounded" title="Save">✓</button>
                            <button onClick={(e) => {e.stopPropagation(); setEditingTripId(null);}} className="text-red-400 p-1 hover:bg-red-400/20 rounded" title="Cancel">✖</button>
                          </div>
                        ) : (
                          <p className={`font-bold text-lg leading-tight mb-2 truncate max-w-[150px] ${selectedTrip?.id === trip.id ? 'text-indigo-200' : 'text-white'}`}>
                            {trip.destination}
                          </p>
                        )}
                        <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-500/20 uppercase tracking-widest inline-block">
                          Budget: €{trip.budget}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-xs mt-4 flex items-center gap-1.5 border-t border-slate-700/50 pt-3">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      Saved on {new Date(trip.created_at).toLocaleDateString()}
                    </p>
                 </div>
               ))}
             </div>
           )}
        </aside>
        
        <main className="flex-1 w-full h-screen overflow-y-auto bg-[#f8fafc]">
          {selectedTrip ? renderTripView() : <AIForm />}
        </main>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar-dark::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}} />
    </ProtectedRoute>
  );
}
