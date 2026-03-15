"use client";

// Import React hooks used for state management, DOM references and lifecycle effects
import { useState, useRef, useEffect } from "react";

/**
 * AIForm Component — Travelyx-AI
 * ---------------------------------
 * Full UI for Travelyx-AI: Input → Loading → AI Response + Error
 * Validates recognized destinations and handles errors gracefully.
 */
export default function AIForm() {

  // ----------------------------
  // STATE MANAGEMENT
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ----------------------------
  // REFERENCES TO DOM ELEMENTS
  const responseEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ----------------------------
  // AUTO-SCROLL EFFECT
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ----------------------------
  // AUTO-CLEAR ERROR
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // ----------------------------
  // AUTO-GROW TEXTAREA
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // ----------------------------
  // RECOGNIZED DESTINATIONS
  const validDestinations = [
    "Paris","Nice","Lyon","Marseille","Bordeaux",
    "London","Manchester","Liverpool","Edinburgh","Glasgow",
    "Germany","Berlin","Munich","Hamburg","Frankfurt","Cologne","Stuttgart","Dusseldorf","Tuttlingen",
    "Austria","Vienna","Salzburg","Innsbruck",
    "Rome","Milan","Venice","Florence","Naples","Bologna","Verona","Pisa",
    "Barcelona","Madrid","Valencia","Seville","Malaga","Granada","Ibiza",
    "Amsterdam","Rotterdam","The Hague",
    "Lisbon","Porto","Faro",
    "Zurich","Geneva","Lucerne","Interlaken",
    "Copenhagen","Stockholm","Oslo","Helsinki",
    "Prague","Budapest","Warsaw","Krakow","Athens","Thessaloniki","Belgrade","Zagreb","Ljubljana","Sofia","Bucharest",
    "Istanbul","Antalya","Cappadocia","Izmir",
    "New York","Los Angeles","San Francisco","Chicago","Miami","Las Vegas","Orlando","Boston","Seattle","Washington DC","San Diego",
    "Toronto","Vancouver","Montreal","Quebec City",
    "Mexico City","Cancun","Tulum",
    "Rio de Janeiro","Sao Paulo","Buenos Aires","Lima","Santiago","Bogota",
    "Tokyo","Kyoto","Osaka","Seoul","Beijing","Shanghai","Hong Kong",
    "Bangkok","Singapore","Kuala Lumpur","Bali","Jakarta","Manila",
    "Dubai","Abu Dhabi","Doha","Muscat","Riyadh","Amman","Tel Aviv",
    "Delhi","Mumbai","Jaipur","Goa",
    "Sydney","Melbourne","Brisbane","Perth","Auckland","Wellington",
    "Cape Town","Johannesburg","Marrakech","Cairo","Nairobi","Tunis"
  ];

  const isValidDestination = (text) => {
    const lowerText = text.toLowerCase();
    return validDestinations.some(dest =>
      lowerText.includes(dest.toLowerCase())
    );
  };

  // ----------------------------
  // FORM SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) return setError("❌ Please enter a travel request.");
    if (trimmed.length < 10) return setError("❌ Request too short. Please write at least 10 characters.");
    if (!isValidDestination(trimmed)) {
      setMessages(prev => [
        ...prev,
        { role: "user", content: trimmed },
        { role: "ai", content: "❌ Destination not recognized. Please provide a valid location." }
      ]);
      setInput("");
      return;
    }

    setMessages(prev => [...prev.slice(-49), { role: "user", content: trimmed }]);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Server error");

      let aiContent = data?.result ?? "No result returned.";

      if (typeof aiContent === "object" && aiContent !== null) {
        const {
          destination = "Unknown",
          country = "Unknown",
          overview = "No overview provided.",
          local_event_or_festival,
          best_time_to_visit = "N/A",
          itinerary = [],
          budget_estimate = {}
        } = aiContent;

        aiContent = (
          <>
            <p className="font-bold text-indigo-700 text-lg mb-2">{destination}, {country}</p>
            <p className="mb-2">{overview}</p>
            {local_event_or_festival && <p className="text-purple-700 font-medium mb-2">🎉 {local_event_or_festival}</p>}
            <p className="text-sm text-gray-500 mb-4">Best Time to Visit: {best_time_to_visit}</p>

            <div className="mb-4">
              <p className="font-semibold text-gray-800 text-lg mb-2">Itinerary:</p>
              {itinerary.length > 0 ? itinerary.map(day => {
                const dayNum = day.day ?? "?";
                const morning = day.morning ?? ["N/A"];
                const afternoon = day.afternoon ?? ["N/A"];
                const evening = day.evening ?? ["N/A"];
                return (
                  <div key={dayNum} className="mb-3 p-3 border rounded-lg bg-white shadow-sm">
                    <p className="font-bold text-indigo-600 mb-1 text-base">Day {dayNum}</p>
                    <div className="ml-3 mb-1">
                      <p className="font-medium text-orange-600">🌅 Morning</p>
                      <ul className="list-disc ml-5 text-gray-700">{morning.map((act, idx) => <li key={idx}>{act}</li>)}</ul>
                    </div>
                    <div className="ml-3 mb-1">
                      <p className="font-medium text-green-600">🏞 Afternoon</p>
                      <ul className="list-disc ml-5 text-gray-700">{afternoon.map((act, idx) => <li key={idx}>{act}</li>)}</ul>
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-purple-600">🌙 Evening</p>
                      <ul className="list-disc ml-5 text-gray-700">{evening.map((act, idx) => <li key={idx}>{act}</li>)}</ul>
                    </div>
                  </div>
                );
              }) : <p>No itinerary available.</p>}
            </div>

            <div className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm">
              <p className="font-semibold text-green-700 mb-1">💰 Budget Estimate</p>
              <p>✈️ Flight: €{budget_estimate?.flight ?? 0}</p>
              <p>🏨 Hotel: €{budget_estimate?.hotel_total ?? 0}</p>
              <p>🍽 Daily Expenses: €{budget_estimate?.daily_expenses_total ?? 0}</p>
              <p className="font-bold">Total: €{budget_estimate?.total_trip_cost ?? 0}</p>
            </div>
          </>
        );
      }

      setMessages(prev => [...prev, { role: "ai", content: aiContent }]);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // KEYBOARD HANDLER
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const trimmed = input.trim();

      // CHECK FULL ERROR CASES
      if (!trimmed) {
        setError("❌ Please enter a travel request.");
      } else if (trimmed.length < 10) {
        setError("❌ Request too short. Please write at least 10 characters.");
      } else {
        handleSubmit(e); // Only valid input triggers submit
      }
    }
  };

  // ----------------------------
  // UI RENDER
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-8 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h1 className="text-5xl font-bold text-white">Travelyx-AI</h1>
        <p className="text-indigo-200 mt-2 text-lg">Your AI Travel Planner</p>
      </div>

      <div className="w-full max-w-3xl flex flex-col bg-white rounded-3xl shadow-2xl p-6">
        <div className="flex-1 flex flex-col gap-3 min-h-[400px] max-h-[50vh] overflow-y-auto px-2 border-b border-gray-200 pb-4">
          {messages.length === 0 && <p className="text-gray-400 text-center mt-20">Start your conversation by typing a travel request below...</p>}
          {messages.map((msg, i) => (
            <div key={i} className={`px-5 py-3 rounded-2xl max-w-[75%] break-words shadow-sm transition-all ${msg.role === "user" ? "self-end bg-indigo-600 text-white rounded-br-none" : "self-start bg-gray-100 text-gray-900 rounded-bl-none"}`}>
              <span className="mr-2">{msg.role === "user" ? "🧳" : "🤖"}</span>
              {typeof msg.content === "object" ? msg.content : msg.content.split("\n\n").map((para, idx) => <p key={idx} className="mb-2">{para}</p>)}
            </div>
          ))}
          <div ref={responseEndRef} />
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-indigo-600 font-medium mt-3">
            <div className="w-5 h-5 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            AI is generating your travel plan...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3 rounded-lg mt-3 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-800 font-bold px-2 py-1 rounded hover:bg-red-200">✖</button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Example: 3-day trip, budget 900€, departure Germany..."
            className="flex-1 border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-40 overflow-y-auto text-gray-800"
          />
          <button
            type="submit"
            disabled={loading || input.trim().length < 10}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}