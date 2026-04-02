"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * AIForm Component — Travelyx-AI
 * ---------------------------------
 * Full-featured UI for AI travel planning:
 * - Completely English UI
 * - Stunning intuitive UI with inspiration cards 
 * - Output generation & trip saving
 * - Full A-Z destinations list
 * - Visually stunning timeline layout for itinerary
 */
export default function AIForm({ onTripGenerated = () => {} }) {
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    duration: "3",
    budget: "",
    travelStyle: "Cultural"
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const responseEndRef = useRef(null);
  const [userName, setUserName] = useState("Traveler");
  const [userId, setUserId] = useState(null);

  // ----------------------------
  // FETCH USER INFO
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.full_name) {
        setUserName(data.user.user_metadata.full_name);
      }
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  // ----------------------------
  // AUTO SCROLL TO LAST MESSAGE
  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------
  // AUTO CLEAR ERROR AFTER 5s
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  // ----------------------------
  // LOGOUT HANDLER
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // ----------------------------
  // RESET HANDLER
  const handleReset = () => {
    setMessages([]);
    setError(null);
    setFormData({
      departure: "",
      destination: "",
      duration: "3",
      budget: "",
      travelStyle: "Cultural"
    });
  };

  // ----------------------------
  // COMPREHENSIVE DESTINATION LIST
  const coreDestinations = [
    // All Countries
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
    "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
    "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
    "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda",
    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
    "Yemen", "Zambia", "Zimbabwe",
    // Major Global Cities & Hubs
    "Amsterdam", "Bali", "Barcelona", "Berlin", "Dubai", "Istanbul", "London", "Los Angeles", "Madrid", "Miami", "Milan", "Munich", "New York", "Paris", "Prague", "Rome", "Seoul", "Sydney", "Tokyo", "Venice", "Vienna", "Zurich", "Santorini", "Phuket"
  ];
  
  const validDestinations = [...new Set(coreDestinations)].sort((a, b) => a.localeCompare(b));

  // ----------------------------
  // INSPIRATION CARD HANDLER
  const handleInspirationClick = (dest, style, budget) => {
    setFormData({
      departure: formData.departure || "New York",
      destination: dest,
      duration: "5",
      budget: budget,
      travelStyle: style
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ----------------------------
  // FORM SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.departure) return setError("❌ Please select a departure location.");
    if (!formData.destination) return setError("❌ Please select a destination.");
    if (formData.departure === formData.destination) return setError("❌ Departure and Destination cannot be the same.");
    if (!formData.budget) return setError("❌ Please enter a budget.");
    if (isNaN(formData.budget) || Number(formData.budget) < 1) return setError("❌ Budget must be a valid positive number.");

    // Structure the comprehensive prompt mapped directly to system instructions.
    // This string relies on the LLM (Llama 3 via Groq) understanding the context
    // and strictly outputting matching JSON formats.
    const prompt = `Create a detailed ${formData.duration}-day ${formData.travelStyle} itinerary departing from ${formData.departure} and traveling to ${formData.destination} with a budget of ${formData.budget} euros. Make sure the total JSON output covers exactly ${formData.duration} days.`;
    const userDisplay = `🛫 ${formData.departure} ➔ 🛬 ${formData.destination} | ⏱ ${formData.duration} Days | 💰 ${formData.budget}€ | 🎨 ${formData.travelStyle}`;

    // Add user message to UI state for chat display
    setMessages(prev => [...prev.slice(-49), { role: "user", content: userDisplay }]);
    setError(null);
    setLoading(true);

    try {
      // Execute REST POST request specifically to our internal Next.js App Route helper
      // Located at /api/chat which securely calls the Groq AI API server-side
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) throw new Error("🔒 Authentication Error: You are not logged in. Please refresh or log in again.");
        if (res.status === 500) throw new Error("⚠️ Server Error: The travel AI engine encountered an error while processing.");
        if (res.status === 400) throw new Error("📝 Input Error: " + (data?.error || "Invalid request. Please correct your inputs."));
        throw new Error(data?.error || `Error ${res.status}: Request failed.`);
      }

      let aiContent = data?.result ?? "No result returned.";

      if (typeof aiContent === "object" && aiContent !== null) {
        // Inject departure context into the returned object to store appropriately
        aiContent.departure = formData.departure;
        data.result.user_budget = formData.budget;
        aiContent.user_budget = formData.budget;
        
        const {
          destination = "Unknown",
          country = "Unknown",
          overview = "No overview provided.",
          local_event_or_festival,
          best_time_to_visit = "N/A",
          itinerary = [],
          budget_estimate = {},
          user_budget = formData.budget
        } = aiContent;

        const userBudgetNumber = Number(user_budget) || Number(budget_estimate?.total_trip_cost) || 0;
        const totalSpent = Number(budget_estimate?.total_trip_cost) || 0;
        const remaining = userBudgetNumber - totalSpent;

        aiContent = (
          <div className="w-full">
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

            {/* TIMELINE ITINERARY */}
            <div className="mb-8 md:mb-10 mt-6 md:mt-8">
              <h3 className="font-extrabold text-slate-800 text-xl md:text-2xl mb-6 flex items-center gap-3 border-b-2 border-slate-100 pb-4"><svg className="w-6 h-6 md:w-7 md:h-7 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"/></svg> Daily Itinerary</h3>
              <div className="relative border-l-4 border-indigo-100 ml-3 md:ml-6 pb-2">
                {itinerary.length > 0 ? itinerary.map((day, idx) => {
                  const dayNum = day.day ?? (idx + 1);
                  const morning = day.morning ?? ["Free time"];
                  const afternoon = day.afternoon ?? ["Free time"];
                  const evening = day.evening ?? ["Free time"];
                  return (
                    <div key={dayNum} className="mb-8 md:mb-12 relative pl-6 md:pl-12">
                      {/* Timeline Dot */}
                      <div className="absolute left-[-18px] md:left-[-22px] top-0 bg-indigo-600 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold shadow-lg ring-4 md:ring-8 ring-[#ffffff] text-sm md:text-lg">
                        {dayNum}
                      </div>
                      
                      {/* Day Card */}
                      <div className="bg-white border border-slate-200 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 group">
                        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 md:px-6 md:py-4 flex justify-between items-center">
                          <h4 className="font-black text-indigo-950 text-lg md:text-xl tracking-tight">Day {dayNum}</h4>
                        </div>
                        <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-5">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                             {/* Morning */}
                             <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-orange-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <div className="absolute top-2 right-3 text-3xl md:text-4xl opacity-10 drop-shadow-sm">🌅</div>
                                <h5 className="font-black text-orange-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-orange-500 shadow-sm"></div> Morning</h5>
                                <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                                  {morning.map((act, i) => <li key={i} className="flex gap-2 items-start"><span className="text-orange-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                                </ul>
                             </div>
                             {/* Afternoon */}
                             <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-emerald-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <div className="absolute top-2 right-3 text-3xl md:text-4xl opacity-10 drop-shadow-sm">☀️</div>
                                <h5 className="font-black text-emerald-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 shadow-sm"></div> Afternoon</h5>
                                <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                                  {afternoon.map((act, i) => <li key={i} className="flex gap-2 items-start"><span className="text-emerald-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
                                </ul>
                             </div>
                             {/* Evening */}
                             <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl md:rounded-2xl p-4 md:p-5 border border-indigo-100/60 relative overflow-hidden transition-all hover:shadow-md">
                                <div className="absolute top-2 right-3 text-3xl md:text-4xl opacity-10 drop-shadow-sm">🌙</div>
                                <h5 className="font-black text-indigo-600 mb-2 md:mb-3 uppercase tracking-widest text-[10px] md:text-xs flex items-center gap-2"><div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-indigo-500 shadow-sm"></div> Evening</h5>
                                <ul className="list-none space-y-1.5 md:space-y-2 text-slate-800 font-medium text-xs md:text-sm leading-relaxed">
                                  {evening.map((act, i) => <li key={i} className="flex gap-2 items-start"><span className="text-indigo-400 mt-0.5">•</span><span className="flex-1">{act}</span></li>)}
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

            {/* BUDGET SECTION */}
            <div className="bg-slate-50 border-2 border-slate-200 p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm relative overflow-hidden">
              <div className="absolute top-[-30px] right-[-20px] text-9xl opacity-[0.03]">💸</div>
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
                  <span className="text-lg">🍽 Daily Expenses <span className="text-sm font-normal text-slate-400 block sm:inline sm:ml-2">(Food, Commute, Activities)</span></span> <span className="font-black text-xl">€{budget_estimate?.daily_expenses_total ?? 0}</span>
                </div>
              </div>
              <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center shadow-lg">
                 <span className="font-black text-slate-300 text-lg sm:text-xl md:text-2xl uppercase tracking-wider mb-2 sm:mb-0">Total Estimated Trip Cost</span>
                 <span className="font-black text-4xl text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-xl">€{budget_estimate?.total_trip_cost ?? 0}</span>
              </div>
              <p className="text-[13px] text-slate-500 mt-5 font-medium flex items-start gap-2 bg-white p-4 rounded-xl border border-slate-200 leading-relaxed shadow-sm">
                <svg className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span><strong>Note:</strong> These estimates are calculated using historical average data for {destination}. Actual costs for flights and hotels may vary significantly depending on the season, how far in advance you book, travel class, and local availability. This serves purely as an average spending guide context.</span>
              </p>
            </div>
          </div>
        );
      }

      // Store JSX content and Raw object
      setMessages(prev => [...prev, { role: "ai", content: aiContent, rawData: data.result, isSaved: true }]);

      // AUTO-SAVE OPERATION
      if (userId && data.result) {
        try {
          const budgetCost = formData.budget || data.result.budget_estimate?.total_trip_cost?.toString() || "0";
          const { error: saveError } = await supabase.from('trips').insert({
            user_id: userId,
            destination: formData.destination, // Safe fallback
            budget: budgetCost,
            itinerary_data: data.result // MUST be the pure JSON object, not the React Element!
          });

          if (!saveError && typeof onTripGenerated === "function") {
            onTripGenerated();
          }
        } catch (saveError) {
          console.error("Auto-save failed", saveError);
        }
      }
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("🔌 Network Error: Failed to connect to the server. Please check your internet connection.");
      } else {
        setError(err?.message || "❌ An unknown error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full min-h-screen relative p-4 md:p-6 flex flex-col items-center bg-[#f8fafc] overflow-x-hidden">
      {/* Dynamic Vibrant Header Background */}
      <div className="absolute top-0 left-0 w-full h-[250px] md:h-[300px] bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 rounded-b-[3rem] md:rounded-b-[4rem] shadow-2xl z-0 overflow-hidden border-b border-white/20">
         <div className="absolute inset-0 opacity-40 mix-blend-color-dodge pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[350px] h-[350px] bg-cyan-400 blur-[80px] rounded-full animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[350px] h-[350px] bg-pink-400 blur-[80px] rounded-full animate-blob animation-delay-2000"></div>
         </div>
         {/* Decorative shapes to make it look premium */}
         <div className="absolute top-[-10%] right-[-5%] w-[350px] h-[350px] bg-white opacity-5 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-10%] left-[-5%] w-[250px] h-[250px] bg-emerald-400 opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 w-full max-w-6xl z-10 pt-1 gap-4">
        <div className="text-center md:text-left flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 hidden md:block">
            <span className="text-3xl text-white drop-shadow-lg">✈️</span>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-md flex items-center gap-2">
              Travelyx
            </h1>
            <p className="text-blue-100 mt-1 text-base font-medium opacity-90 drop-shadow-sm">
              Greetings, {userName ? userName.charAt(0).toUpperCase() + userName.slice(1) : 'Traveler'}. Where to next?
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Start Over"
            className="flex items-center justify-center p-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full hover:bg-white/20 hover:rotate-180 transition-all duration-500 shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
          <Link
            href="/profile"
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 border border-emerald-400 text-white px-6 py-2.5 rounded-full hover:from-emerald-400 hover:to-teal-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 font-extrabold shadow-lg text-xs uppercase tracking-wider transform hover:-translate-y-0.5"
            title="Manage My Profile & settings"
          >
            <span className="text-sm">⚙️</span> My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-full hover:bg-red-500 hover:border-red-500 transition-all duration-300 font-bold shadow-xl text-xs uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Log Out
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl glass-panel hover-float rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-6 md:p-8 z-10 flex flex-col mb-6 min-h-[400px] border border-white/80">
        
        {/* Simple & Clean Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6 bg-white p-4 md:p-5 rounded-[1.25rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
               <span className="text-xl bg-indigo-50 p-2 rounded-xl border border-indigo-100 shadow-sm">✨</span>
               <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">Fill in the details. We do the rest.</h2>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5"><span className="text-indigo-500">🛫</span> Departure</label>
              <select
                value={formData.departure}
                onChange={(e) => setFormData({...formData, departure: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all hover:bg-slate-100 cursor-pointer shadow-inner text-sm"
              >
                <option value="" disabled>Select Departure</option>
                {validDestinations.map(d => <option key={`dep-${d}`} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5"><span className="text-indigo-500">📍</span> Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all hover:bg-slate-100 cursor-pointer shadow-inner text-sm"
              >
                <option value="" disabled>Select Destination</option>
                {validDestinations.map(d => <option key={`dest-${d}`} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5"><span className="text-indigo-500">⏱</span> Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all hover:bg-slate-100 cursor-pointer shadow-inner text-sm"
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(d => <option key={d} value={d}>{d} Days</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5"><span className="text-indigo-500">💸</span> Budget (€)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                placeholder="Ex: 800"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all hover:bg-slate-100 shadow-inner text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block flex items-center gap-1.5"><span className="text-indigo-500">🎭</span> Travel Style</label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({...formData, travelStyle: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-slate-800 font-bold transition-all hover:bg-slate-100 cursor-pointer shadow-inner text-sm"
              >
                {["Cultural", "Adventure", "Relaxing", "Family", "Luxury", "Romantic"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 text-white font-black p-4 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] hover:-translate-y-1 transition-all text-base uppercase tracking-widest relative overflow-hidden"
          >
            {loading ? "Curating Your Itinerary..." : "Plan Your Dream Trip"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-5 rounded-2xl mb-8 flex justify-between items-center font-bold shadow-sm">
            <span className="flex items-center gap-3"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 font-black px-3 py-2 hover:text-red-800 transition-colors bg-red-100/50 rounded-lg">✖</button>
          </div>
        )}

        {/* Chat / Result Box */}
        {messages.length > 0 || loading ? (
          <div className="flex-1 flex flex-col gap-6 md:gap-8 p-1 md:p-2 lg:p-4 rounded-3xl min-h-[400px] overflow-y-auto custom-scrollbar">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-4 md:p-8 rounded-[1.5rem] md:rounded-[2rem] max-w-full md:max-w-full shadow-sm transition-all ${msg.role === "user"
                    ? "self-end bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 text-white rounded-tr-sm shadow-xl items-center text-center w-full"
                    : "self-start bg-white border border-slate-200 text-slate-800 rounded-tl-[0.5rem] shadow-xl w-full"
                  }`}
              >
                <div className={`flex items-center gap-2 mb-4 opacity-90 text-sm font-black uppercase tracking-widest ${msg.role==="user"?"text-slate-300 justify-center":"text-slate-400"}`}>
                  <span>{msg.role === "user" ? "🎯 YOUR PREFERENCES" : "🗺️ CURATED TRAVEL PLAN"}</span>
                </div>
                {typeof msg.content === "object"
                  ? msg.content
                  : msg.content.split("\n\n").map((para, idx) => <p key={idx} className={`mb-2 leading-relaxed font-bold ${msg.role==="user"?"text-2xl text-emerald-400":""}`}>{para}</p>)}
                
                {msg.isSaved && msg.role === "ai" && (
                  <div className="mt-10 w-full bg-indigo-50 border-2 border-indigo-200 text-indigo-700 font-black py-5 rounded-2xl flex justify-center items-center gap-3 text-lg">
                    <svg className="w-7 h-7 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    Trip Automatically Saved to History!
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="self-center bg-white border-2 border-indigo-100 text-slate-800 p-12 rounded-[3rem] shadow-2xl w-full max-w-2xl flex flex-col items-center justify-center relative overflow-hidden mt-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse"></div>
                <div className="relative w-28 h-28 flex items-center justify-center mb-8">
                  <div className="absolute inset-0 border-[8px] border-indigo-50 rounded-full"></div>
                  <div className="absolute inset-0 border-[8px] border-indigo-500 border-t-transparent border-r-transparent rounded-full animate-spin"></div>
                  <span className="text-5xl animate-bounce">✈️</span>
                </div>
                <p className="text-indigo-950 font-black text-3xl mb-2 text-center">Designing your optimal journey...</p>
                <p className="text-slate-500 font-medium mt-2 text-lg text-center bg-slate-50 px-6 py-2 rounded-full">Our proprietary travel engine is actively searching the best routes.</p>
              </div>
            )}
            <div ref={responseEndRef} />
          </div>
        ) : (
          /* Travel Inspiration Cards to fill empty state playfully */
          <div className="mt-2 text-left border-t border-slate-100 pt-6">
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-600 p-2 rounded-lg"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg></span>
              Quick Travel Inspiration / Tap to Auto-Fill
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div 
                onClick={() => handleInspirationClick("Bali", "Relaxing", "1200")}
                className="group cursor-pointer bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-orange-200 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 border border-orange-100 rounded-[1rem] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">🌅</div>
                <h4 className="font-black text-slate-800 text-xl mb-1">Paradise in Bali</h4>
                <p className="text-slate-500 font-bold text-[11px] mb-3 bg-slate-50 inline-block px-2.5 py-1 rounded-md">5 Days • Relaxing • ~€1200</p>
                <div className="text-orange-600 font-bold text-[12px] flex items-center gap-1.5 group-hover:gap-2 transition-all bg-orange-50/50 p-2 rounded-lg">Auto-Fill Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
              </div>
              <div 
                onClick={() => handleInspirationClick("Paris", "Romantic", "1500")}
                className="group cursor-pointer bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-pink-200 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-pink-50 to-pink-100 text-pink-600 border border-pink-100 rounded-[1rem] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner">🗼</div>
                <h4 className="font-black text-slate-800 text-xl mb-1">Romance in Paris</h4>
                <p className="text-slate-500 font-bold text-[11px] mb-3 bg-slate-50 inline-block px-2.5 py-1 rounded-md">5 Days • Romantic • ~€1500</p>
                <div className="text-pink-600 font-bold text-[12px] flex items-center gap-1.5 group-hover:gap-2 transition-all bg-pink-50/50 p-2 rounded-lg">Auto-Fill Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
              </div>
              <div 
                onClick={() => handleInspirationClick("Tokyo", "Cultural", "2000")}
                className="group cursor-pointer bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-red-200 transition-all hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-red-50 to-red-100 text-red-600 border border-red-100 rounded-[1rem] flex items-center justify-center text-2xl mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-transform shadow-inner">🍣</div>
                <h4 className="font-black text-slate-800 text-xl mb-1">Culture in Tokyo</h4>
                <p className="text-slate-500 font-bold text-[11px] mb-3 bg-slate-50 inline-block px-2.5 py-1 rounded-md">5 Days • Cultural • ~€2000</p>
                <div className="text-red-600 font-bold text-[12px] flex items-center gap-1.5 group-hover:gap-2 transition-all bg-red-50/50 p-2 rounded-lg">Auto-Fill Details <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Styles overrides for slick scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; border: 3px solid #fff; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .custom-scrollbar { padding-right: 15px; }
      `}} />
    </div>
  );
}