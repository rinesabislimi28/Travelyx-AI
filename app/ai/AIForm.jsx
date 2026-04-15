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
import { normalizedLocations } from "../../lib/locations";

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

  if (!/^[a-zA-Z\s,'-]+$/.test(value.trim())) {
    return false;
  }

  return searchableLocationTerms.has(normalizedValue);
}

function renderBudgetBlock({ budget_estimate = {}, userBudgetNumber, totalSpent, remaining }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-slate-950/30 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-lg font-bold text-white sm:text-xl">Estimated budget</p>
        <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-bold uppercase tracking-[0.24em] text-slate-300">
          Cost overview
        </span>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Your budget</p>
          <p className="mt-2 text-2xl font-bold text-[#ffd166] sm:text-[1.75rem]">EUR {userBudgetNumber}</p>
        </div>
        <div className="metric-card">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Estimated cost</p>
          <p className="mt-2 text-2xl font-bold text-white sm:text-[1.75rem]">EUR {totalSpent}</p>
        </div>
        <div className={`metric-card ${remaining >= 0 ? "border-emerald-400/20 bg-emerald-400/10" : "border-red-400/20 bg-red-400/10"}`}>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Remaining</p>
          <p className={`mt-2 text-2xl font-bold sm:text-[1.75rem] ${remaining >= 0 ? "text-[#35c6b3]" : "text-rose-300"}`}>
            EUR {remaining}
          </p>
        </div>
      </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="metric-card">
          <p className="text-slate-400">Flights</p>
          <p className="mt-2 text-xl font-bold text-white">EUR {budget_estimate?.flight ?? 0}</p>
        </div>
        <div className="metric-card">
          <p className="text-slate-400">Hotel</p>
          <p className="mt-2 text-xl font-bold text-white">EUR {budget_estimate?.hotel_total ?? 0}</p>
        </div>
        <div className="metric-card md:col-span-2">
          <p className="text-slate-400">Daily expenses</p>
          <p className="mt-2 text-xl font-bold text-white">EUR {budget_estimate?.daily_expenses_total ?? 0}</p>
        </div>
      </div>
    </div>
  );
}

export default function AIForm({ onTripGenerated = () => {} }) {
  const [formData, setFormData] = useState({
    departure: "",
    destination: "",
    duration: "3",
    budget: "",
    travelStyle: "Cultural",
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
    router.push("/login");
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
    });
  };

  const handleInspirationClick = (destination, style, budget) => {
    setFormData((current) => ({
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
    if (!isValidLocationInput(departure)) return setError("Please enter a real departure city or country from the suggestions.");
    if (!isValidLocationInput(destination)) return setError("Please enter a real destination city or country from the suggestions.");
    if (departure.toLowerCase() === destination.toLowerCase()) return setError("Departure and destination cannot be the same.");
    if (!formData.budget) return setError("Please enter a budget.");
    if (isNaN(formData.budget) || Number(formData.budget) < 1) return setError("Budget must be a valid positive number.");
    if (!navigator.onLine) return setError("Network error. Please check your connection and try again.");

    const prompt = `Create a detailed ${formData.duration}-day ${formData.travelStyle} itinerary departing from ${departure} and traveling to ${destination} with a budget of ${formData.budget} euros. The departure or destination may be a city, a country, or a city with country. Make sure the total JSON output covers exactly ${formData.duration} days and keeps the trip realistic.`;
    const userDisplay = `${departure} to ${destination} | ${formData.duration} days | EUR ${formData.budget} | ${formData.travelStyle}`;

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

      let aiContent = data?.result ?? "No result returned.";

      if (typeof aiContent === "object" && aiContent !== null) {
        aiContent.departure = departure;
        if (data && data.result) {
          data.result.user_budget = formData.budget;
        }
        aiContent.user_budget = formData.budget;

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
                  <p className="text-xs uppercase tracking-[0.24em] text-[#ffd166]">Curated plan</p>
                  <h3 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                    {plannedDestination}, {country}
                  </h3>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-200 sm:text-base">{overview}</p>
                </div>
                <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                  <span className="rounded-full border border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-slate-200">
                    {formData.duration} days
                  </span>
                  <span className="rounded-full border border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-slate-200">
                    {formData.travelStyle}
                  </span>
                </div>
              </div>
              {local_event_or_festival && <div className="status-info mt-5">{local_event_or_festival}</div>}
              <div className="mt-5 inline-flex rounded-full border border-white/10 bg-slate-950/35 px-4 py-2 text-sm text-slate-300">
                Best time to visit: <span className="ml-2 font-bold text-white">{best_time_to_visit}</span>
              </div>
            </div>

            <div className="space-y-4">
              {itinerary.length > 0 ? (
                itinerary.map((day, idx) => {
                  const dayNum = day.day ?? idx + 1;
                  const morning = day.morning ?? ["Free time"];
                  const afternoon = day.afternoon ?? ["Free time"];
                  const evening = day.evening ?? ["Free time"];

                  return (
                    <div key={dayNum} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5 sm:p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Daily itinerary</p>
                          <h4 className="mt-2 text-2xl font-bold text-white">Day {dayNum}</h4>
                        </div>
                        <span className="w-fit rounded-full bg-white/8 px-3 py-1 text-xs uppercase tracking-[0.24em] text-slate-300">
                          Morning to night
                        </span>
                      </div>

                      <div className="day-grid mt-5">
                        <div className="day-block bg-[#ffd166]/10 border-[#ffd166]/20">
                          <p className="text-xs uppercase tracking-[0.24em] text-[#ffe3a1]">Morning</p>
                          <ul className="text-sm leading-7 text-slate-200">
                            {morning.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="day-block bg-[#35c6b3]/10 border-[#35c6b3]/20">
                          <p className="text-xs uppercase tracking-[0.24em] text-[#9ff0e5]">Afternoon</p>
                          <ul className="text-sm leading-7 text-slate-200">
                            {afternoon.map((act, i) => (
                              <li key={i}>{act}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="day-block border-white/10 bg-slate-950/35">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Evening</p>
                          <ul className="text-sm leading-7 text-slate-200">
                            {evening.map((act, i) => (
                              <li key={i}>{act}</li>
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

            {renderBudgetBlock({ budget_estimate, userBudgetNumber, totalSpent, remaining })}
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
    <div className="h-full overflow-y-auto overflow-x-hidden px-3 py-4 sm:px-4 sm:py-5">
      <div className="w-full">
        <div className="panel w-full overflow-x-hidden rounded-[2rem] p-4 sm:p-5 lg:p-6">
          <div className="grid gap-4 border-b border-white/10 pb-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="eyebrow">Trip planner</span>
              <h1 className="section-title mt-4 text-3xl font-bold text-white sm:text-4xl">
                Welcome back, {userName}.
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
                Search with a city, a country, or both. The planner now accepts free-form location input instead of forcing only preset options.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button onClick={handleReset} className="button-secondary text-sm">
                Reset form
              </button>
              <Link href="/profile" className="button-secondary text-sm border-[#35c6b3]/30 bg-[#35c6b3]/10 text-[#9ff0e5] font-bold">
                Settings
              </Link>
              <button onClick={handleLogout} className="button-primary text-sm">
                Log out
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <form onSubmit={handleSubmit} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
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

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_220px]">
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
                <div className="hidden xl:block" />
              </div>

              <p className="mt-4 text-sm text-slate-400">
                Tip: you can search like <span className="font-bold text-white">Rome</span>, <span className="font-bold text-white">Italy</span>, or <span className="font-bold text-white">Rome, Italy</span>.
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
                      className={`rounded-[1.8rem] border p-4 sm:p-6 ${
                        msg.role === "user"
                          ? "border-white/10 bg-slate-950/40 text-white"
                          : "border-white/10 bg-white/5 text-slate-100"
                      }`}
                    >
                      <p className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                        {msg.role === "user" ? "Your request" : "AI itinerary"}
                      </p>
                      {typeof msg.content === "object" ? msg.content : <p className="text-base font-medium">{msg.content}</p>}
                      {msg.isSaved && msg.role === "ai" && (
                        <div className="status-success mt-6">Trip automatically saved to your history.</div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-8 text-center">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Travelyx is working</p>
                      <p className="mt-3 text-2xl font-bold text-white">Building your itinerary...</p>
                      <p className="mt-3 text-sm text-slate-300">Checking routes, cost balance, and daily structure for the requested destination.</p>
                    </div>
                  )}
                  <div ref={responseEndRef} />
                </div>
              </div>
            ) : null}

            <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/4 p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)] sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-[#35c6b3]">Quick inspiration</p>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Click a card to autofill the planner</p>
              </div>
              <div className="mt-4 grid gap-3 xl:grid-cols-3">
                {inspirationCards.map((card) => (
                  <button
                    key={card.destination}
                    type="button"
                    onClick={() => handleInspirationClick(card.destination, card.style, card.budget)}
                    title="Click to autofill the planner"
                    className="w-full rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-slate-950/45 to-[#12213a]/70 p-4 text-left hover:border-[#ff7a59]/40 hover:bg-[#12213a]/90"
                  >
                    <p className="text-lg font-bold text-white">{card.destination}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {card.style} | EUR {card.budget}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-slate-400">{card.note}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-white/10 bg-gradient-to-br from-[#ff7a59]/10 to-[#26d0b8]/10 p-5 sm:p-6">
              <p className="text-sm uppercase tracking-[0.24em] text-[#ffd166]">What feels better now</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
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
