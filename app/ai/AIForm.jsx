/**
 * AI Trip Planner Form
 * 
 * Handles user input constraints, state management, and communication with the local
 * /api/chat endpoint to retrieve Groq Llama 3 generated itineraries. It also processes
 * validation checks to ensure destination and departure points exist.
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InteractiveDay from "../components/InteractiveDay";
import { normalizedLocations } from "../../lib/locations";
import Logo from "../components/Logo";

const travelStyles = ["Cultural", "Adventure", "Relaxing", "Family", "Luxury", "Romantic"];

const inspirationCards = [
  { destination: "Bali, Indonesia", style: "Relaxing", budget: "1200", note: "Beach, villas, and easy sunset plans." },
  { destination: "Paris, France", style: "Romantic", budget: "1500", note: "Museums, cafes, and evening walks." },
  { destination: "Tokyo, Japan", style: "Cultural", budget: "2000", note: "Food, neighborhoods, and modern city culture." },
];

const searchableLocationTerms = new Set(
  normalizedLocations.flatMap((location) => {
    const parts = location
      .split(",")
      .map((part) => part.trim().toLowerCase())
      .filter(Boolean);

    return [location.toLowerCase(), ...parts];
  })
);

function isValidLocationInput(value) {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue || normalizedValue.length < 2 || normalizedValue.length > 60) {
    return false;
  }

  if (!/^[\p{L}\s,'-]+$/u.test(value.trim())) {
    return false;
  }

  // Ne lejuam formatin bazë, ndërsa vërtetësinë e lokacionit ia lëmë Inteligjencës Artificiale
  // për të suportuar ÇDO qytet dhe fshat të botës, duke bllokuar manualisht gabimet e rënda nga AI.
  return true;
}

function renderBudgetBlock({ budget_estimate = {}, userBudgetNumber, totalSpent, remaining }) {
  return (
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
  );
}

function renderMapBlock({ departure, destination }) {
  if (!departure || !destination) return null;
  return (
    <div className="mt-8 rounded-[1.6rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-sm overflow-hidden relative group">
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2335c6b3\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '30px 30px' }}></div>
      <div className="relative z-10 flex flex-col md:flex-row gap-5 items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center justify-center md:justify-start gap-2">
            <svg className="w-5 h-5 text-[#35c6b3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
            Your Travel Route
          </h3>
          <p className="mt-2 text-sm text-[var(--muted)] max-w-md text-center md:text-left">
            Ready to go? Open the live map to see the complete journey from <span className="font-bold text-[var(--foreground)]">{departure}</span> to <span className="font-bold text-[var(--foreground)]">{destination}</span>, including precise directions and travel options.
          </p>
        </div>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(departure)}&destination=${encodeURIComponent(destination)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full md:w-auto shrink-0 flex items-center justify-center gap-2 rounded-full bg-[#35c6b3] px-6 py-3 text-sm font-black text-black transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(53,198,179,0.4)] active:scale-95"
        >
          View Route on Map
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </div>
  );
}

export default function AIForm({ onTripGenerated = () => { } }) {
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    duration: "3",
    budget: "",
    travelStyle: "Cultural",
    companions: "Solo",
    partySize: "3",
    dateMode: "flexible",
    flexibleDate: "Summer",
    fixedDate: "",
  });
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("Traveler");
  const [userId, setUserId] = useState(null);
  const router = useRouter();
  const responseEndRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.user_metadata?.full_name) setUserName(data.user.user_metadata.full_name);
      if (data?.user?.id) setUserId(data.user.id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleReset = () => {
    setMessages([]);
    setError(null);
    setFormData({
      departure: "",
      destination: "",
      duration: "3",
      budget: "",
      travelStyle: "Cultural",
      companions: "Solo",
      partySize: "3",
      dateMode: "flexible",
      flexibleDate: "Summer",
      fixedDate: "",
    });
  };

  const handleInspirationClick = (destination, style, budget) => {
    setFormData((current) => ({
      ...current,
      departure: current.departure || "Prishtina, Kosovo",
      destination,
      duration: "5",
      budget,
      travelStyle: style,
    }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    const departure = formData.departure.trim();
    const destination = formData.destination.trim();

    if (!departure) return setError("Please enter a departure city or country.");
    if (!destination) return setError("Please enter a destination city or country.");
    if (!isValidLocationInput(departure)) return setError("Please enter a valid departure city or country name.");
    if (!isValidLocationInput(destination)) return setError("Please enter a valid destination city or country name.");
    if (departure.toLowerCase() === destination.toLowerCase()) return setError("Departure and destination cannot be the same.");
    if (!formData.budget) return setError("Please enter a budget.");
    if (isNaN(formData.budget) || Number(formData.budget) < 1) return setError("Budget must be a valid positive number.");
    if (!navigator.onLine) return setError("Network error. Please check your connection and try again.");

    let dateContext = "";
    let displayDate = "";
    if (formData.dateMode === "flexible") {
      if (formData.flexibleDate !== "Any time") {
        dateContext = ` The trip will take place during ${formData.flexibleDate}. Ensure the recommendations, activities, and local events match the ${formData.flexibleDate} weather and season appropriately.`;
        displayDate = formData.flexibleDate;
      } else {
        displayDate = "Any time";
      }
    } else {
      if (formData.fixedDate) {
        dateContext = ` The trip starts on exactly ${formData.fixedDate}. Ensure recommendations, seasonal activities, and availability match this specific date.`;
        displayDate = formData.fixedDate;
      } else {
        displayDate = "Any time";
      }
    }

    let companionsText = formData.companions;
    if (formData.companions === "Family" || formData.companions === "Friends") {
      companionsText = `${formData.partySize} people (${formData.companions})`;
    }

    const prompt = `Create a detailed ${formData.duration}-day ${formData.travelStyle} itinerary departing from ${departure} and traveling to ${destination} for a ${companionsText} trip with a budget of ${formData.budget} euros.${dateContext} The departure or destination may be a city, a country, or a city with country. Make sure the total JSON output covers exactly ${formData.duration} days and keeps the trip realistic. IMPORTANT: The budget of ${formData.budget} euros is the TOTAL combined budget for all ${companionsText}. Ensure that all costs returned in 'budget_estimate' represent the TOTAL combined cost for the entire group, NOT per person. For 'daily_expenses_total', calculate it accurately based on 3 meals a day plus local transport and tickets for ALL people in the group.`;
    const userDisplay = `${departure} to ${destination} | ${formData.duration} days | EUR ${formData.budget} | ${formData.travelStyle} | ${companionsText} | ${displayDate}`;

    setMessages((prev) => [...prev.slice(-49), { role: "user", content: userDisplay }]);
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) throw new Error("Authentication error. Please log in again.");
        if (res.status === 500) throw new Error("The travel engine ran into a server error.");
        if (res.status === 400) throw new Error(data?.error || "Invalid request.");
        throw new Error(data?.error || `Request failed with status ${res.status}.`);
      }

      // Check if AI actively rejected the locations as fake/gibberish
      if (data?.result?.error) {
        throw new Error(data.result.error);
      }

      let aiContent = data?.result ?? "No result returned.";

      if (typeof aiContent === "object" && aiContent !== null) {
        aiContent.departure = departure;
        if (data && data.result) {
          data.result.user_budget = formData.budget;
          data.result.travelStyle = formData.travelStyle;
          data.result.companionsText = companionsText;
          data.result.duration = formData.duration;
          data.result.displayDate = displayDate;
        }
        aiContent.user_budget = formData.budget;
        aiContent.travelStyle = formData.travelStyle;
        aiContent.companionsText = companionsText;
        aiContent.duration = formData.duration;
        aiContent.displayDate = displayDate;

        const {
          destination: plannedDestination = "Unknown",
          country = "Unknown",
          overview = "No overview provided.",
          local_event_or_festival,
          best_time_to_visit = "N/A",
          itinerary = [],
          budget_estimate = {},
          user_budget = formData.budget,
        } = aiContent;

        const userBudgetNumber = Number(user_budget) || Number(budget_estimate?.total_trip_cost) || 0;
        const totalSpent = Number(budget_estimate?.total_trip_cost) || 0;
        const remaining = userBudgetNumber - totalSpent;

        aiContent = (
          <div className="itinerary-shell w-full">
            <div className="itinerary-hero">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--accent-3)]">Curated plan</p>
                  <h3 className="mt-3 text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                    {plannedDestination.includes(country) || country === "Unknown" ? plannedDestination : `${plannedDestination}, ${country}`}
                  </h3>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">{overview}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                  <span className="rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                    {aiContent.duration || formData.duration} days
                  </span>
                  <span className="rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                    {aiContent.travelStyle || formData.travelStyle}
                  </span>
                  <span className="rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                    {aiContent.companionsText || companionsText}
                  </span>
                  {(aiContent.displayDate || displayDate) && (
                    <span className="rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--foreground)] shadow-sm">
                      {aiContent.displayDate || displayDate}
                    </span>
                  )}
                </div>
              </div>
              {local_event_or_festival && <div className="status-info mt-5">{local_event_or_festival}</div>}
              <div className="mt-5 inline-flex rounded-full border border-[var(--line-strong)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--muted)] shadow-sm">
                Best time to visit: <span className="ml-2 font-bold text-[var(--foreground)]">{best_time_to_visit}</span>
              </div>
            </div>
            
            {/* Map Block At the Top */}
            {renderMapBlock({ departure, destination: plannedDestination })}

            {renderBudgetBlock({ budget_estimate, userBudgetNumber, totalSpent, remaining })}

            <div className="space-y-4 mt-6">
              {itinerary.length > 0 ? (
                itinerary.map((day, idx) => {
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
                This personalized itinerary is your starting point. Feel free to explore, discover hidden gems, and make this journey uniquely yours. Have a wonderful, safe, and unforgettable trip to <span className="font-bold text-[var(--foreground)]">{plannedDestination}</span>!
              </p>
            </div>
          </div>
        );
      }

      setMessages((prev) => [...prev, { role: "ai", content: aiContent, rawData: data.result, isSaved: true }]);

      if (userId && data.result) {
        try {
          const budgetCost = formData.budget || data.result.budget_estimate?.total_trip_cost?.toString() || "0";
          const { error: saveError } = await supabase.from("trips").insert({
            user_id: userId,
            destination,
            budget: budgetCost,
            itinerary_data: data.result,
          });

          if (!saveError && typeof onTripGenerated === "function") onTripGenerated();
        } catch (saveError) {
          console.error("Auto-save failed", saveError);
        }
      }
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(err?.message || "An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4 sm:py-5 relative">
      {loading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--background)]/80 backdrop-blur-md transition-all duration-300">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-[var(--line)] border-t-[var(--accent)]"></div>
            <div className="absolute inset-2 animate-[spin_1.5s_linear_infinite] rounded-full border-4 border-transparent border-b-[var(--accent-2)]"></div>
          </div>
          <p className="mt-6 text-2xl font-bold text-[var(--foreground)] animate-pulse">
            Crafting your perfect itinerary...
          </p>
          <p className="mt-2 text-sm font-medium text-[var(--muted)]">
            Please wait while our AI plans your trip.
          </p>
        </div>
      )}
      <div className="w-full">
        <div className="panel w-full overflow-x-hidden rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <div className="grid gap-4 border-b border-[var(--line)] pb-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm border border-[#27272a] bg-[#09090b]">
                  <Logo className="w-5 h-5" />
                </div>
                <span className="eyebrow !mb-0">Trip planner</span>
              </div>
              <h1 className="section-title text-3xl font-bold text-[var(--foreground)] sm:text-4xl">
                Welcome back, {userName}.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-base">
                To generate your personalized travel itinerary, you must fill out all the required fields below (destinations, budget, and travel style). If the information is incomplete, the AI cannot build your plan. Once everything is filled, your complete day-by-day guide will be generated and displayed instantly.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={handleReset} 
                className="flex items-center gap-2 rounded-full border border-[#ffd166]/30 bg-[#ffd166]/10 px-4 py-2 text-sm font-bold text-[#ffd166] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(255,209,102,0.2)] hover:bg-[#ffd166]/20 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                Reset form
              </button>
              
              <Link 
                href="/profile" 
                className="flex items-center gap-2 rounded-full border border-[#35c6b3]/30 bg-[#35c6b3]/10 px-4 py-2 text-sm font-bold text-[#35c6b3] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(53,198,179,0.2)] hover:bg-[#35c6b3]/20 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Settings
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 rounded-full border border-[#ff5b73]/30 bg-[#ff5b73]/10 px-4 py-2 text-sm font-bold text-[#ff5b73] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_15px_rgba(255,91,115,0.2)] hover:bg-[#ff5b73]/20 active:scale-95"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Log out
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <form onSubmit={handleSubmit} className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
                <div className="min-w-0">
                  <label className="field-label">Departure city or country</label>
                  <input
                    list="travelyx-locations"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                    placeholder="Prishtina, Kosovo"
                    className="field"
                  />
                </div>
                <div className="min-w-0">
                  <label className="field-label">Destination city or country</label>
                  <input
                    list="travelyx-locations"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Barcelona, Spain"
                    className="field"
                  />
                </div>
                <div className="min-w-0">
                  <label className="field-label">Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="field-select min-w-0"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                      <option key={d} value={d}>
                        {d} days
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="min-w-0">
                  <label className="field-label">Budget (EUR)</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="800"
                    className="field"
                  />
                </div>
                <div className="min-w-0">
                  <label className="field-label">Travel style</label>
                  <select
                    value={formData.travelStyle}
                    onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
                    className="field-select min-w-0"
                  >
                    {travelStyles.map((style) => (
                      <option key={style} value={style}>
                        {style}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="min-w-0 flex gap-2">
                  <div className="flex-1 min-w-0">
                    <label className="field-label">Who with?</label>
                    <select
                      value={formData.companions}
                      onChange={(e) => setFormData({ ...formData, companions: e.target.value })}
                      className="field-select min-w-0"
                    >
                      <option value="Solo">Solo</option>
                      <option value="Couple">Couple</option>
                      <option value="Family">Family</option>
                      <option value="Friends">Friends</option>
                    </select>
                  </div>
                  {(formData.companions === "Family" || formData.companions === "Friends") && (
                    <div className="w-16 shrink-0 animate-in fade-in zoom-in duration-300">
                      <label className="field-label text-center">Size</label>
                      <input
                        type="number"
                        min="3"
                        max="20"
                        value={formData.partySize}
                        onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                        className="field text-center px-1"
                      />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <label className="field-label">Date type</label>
                  <select
                    value={formData.dateMode}
                    onChange={(e) => setFormData({ ...formData, dateMode: e.target.value })}
                    className="field-select min-w-0"
                  >
                    <option value="flexible">Flexible Date</option>
                    <option value="fixed">Fixed Date</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
                {formData.dateMode === "flexible" ? (
                  <div className="min-w-0 md:col-span-2 xl:col-span-1">
                    <label className="field-label">Season / Month</label>
                    <select
                      value={formData.flexibleDate}
                      onChange={(e) => setFormData({ ...formData, flexibleDate: e.target.value })}
                      className="field-select min-w-0"
                    >
                      <option value="Any time">Any time</option>
                      <option value="Spring">Spring</option>
                      <option value="Summer">Summer</option>
                      <option value="Autumn">Autumn</option>
                      <option value="Winter">Winter</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </select>
                  </div>
                ) : (
                  <div className="min-w-0 md:col-span-2 xl:col-span-1">
                    <label className="field-label">Start Date</label>
                    <input
                      type="date"
                      value={formData.fixedDate}
                      onChange={(e) => setFormData({ ...formData, fixedDate: e.target.value })}
                      className="field"
                    />
                    {formData.fixedDate && (
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        Return date:{" "}
                        <span className="text-[var(--muted)] font-medium">
                          {new Date(
                            new Date(formData.fixedDate).getTime() +
                            (Number(formData.duration) - 1) * 24 * 60 * 60 * 1000
                          ).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                )}
                <div className="hidden xl:block xl:col-span-2" />
              </div>

              <p className="mt-4 text-sm text-[var(--muted)]">
                Tip: you can search like <span className="font-bold text-[var(--foreground)]">Rome</span>, <span className="font-bold text-[var(--foreground)]">Italy</span>, or <span className="font-bold text-[var(--foreground)]">Rome, Italy</span>.
              </p>

              <button type="submit" disabled={loading} className="button-primary mt-5 w-full sm:w-auto">
                {loading ? "Generating itinerary..." : "Plan my trip"}
              </button>
            </form>

            {error && <div className="status-error">{error}</div>}

            <datalist id="travelyx-locations">
              {normalizedLocations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>

            {messages.length > 0 || loading ? (
              <div className="trip-scroll split-scroll overflow-x-hidden pr-1 pb-6">
                <div className="space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`rounded-[1.8rem] border p-4 sm:p-6 shadow-sm ${msg.role === "user"
                          ? "border-[var(--line)] bg-[var(--background)] text-[var(--foreground)]"
                          : "border-[var(--line-strong)] bg-[var(--card)] text-[var(--foreground)]"
                        }`}
                    >
                      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[var(--muted)]">
                        {msg.role === "user" ? "Your request" : "AI itinerary"}
                      </p>
                      {typeof msg.content === "object" ? msg.content : <p className="text-base font-medium">{msg.content}</p>}
                      {msg.isSaved && msg.role === "ai" && (
                        <div className="status-success mt-6">Trip automatically saved to your history.</div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="rounded-[1.8rem] border border-[var(--line)] bg-[var(--card)] p-8 text-center">
                      <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">Travelyx is working</p>
                      <p className="mt-3 text-2xl font-bold text-[var(--foreground)]">Building your itinerary...</p>
                      <p className="mt-3 text-sm text-[var(--muted)]">Checking routes, cost balance, and daily structure for the requested destination.</p>
                    </div>
                  )}
                  <div ref={responseEndRef} />
                </div>
              </div>
            ) : null}

            <div className="rounded-[1.8rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-2)]">Quick inspiration</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">Click a card to autofill the planner</p>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-3">
                {inspirationCards.map((card) => (
                  <button
                    key={card.destination}
                    type="button"
                    onClick={() => handleInspirationClick(card.destination, card.style, card.budget)}
                    title="Click to autofill the planner"
                    className="w-full rounded-[1.4rem] border border-[var(--line)] bg-[var(--background)] p-4 text-left hover:border-[var(--accent)] hover:shadow-md transition-all"
                  >
                    <p className="text-lg font-bold text-[var(--foreground)]">{card.destination}</p>
                    <p className="mt-2 text-sm text-[var(--muted)]">
                      {card.style} | EUR {card.budget}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{card.note}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--line-strong)] bg-[var(--card)] p-5 sm:p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--accent-3)]">What feels better now</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)] font-medium">
                <li>Free typing for destinations and departure points.</li>
                <li>Separated scroll areas between planner results and trip history.</li>
                <li>Stronger colors and cleaner hierarchy for phone and laptop screens.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
