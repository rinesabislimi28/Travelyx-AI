"use client";
import { useState, useRef, useEffect } from "react";

export default function AIForm() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const responseEndRef = useRef(null);

  // Auto scroll when a new AI response appears
  useEffect(() => {
    if (responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [response]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      const data = await res.json();

      // Save AI response as an object
      setResponse(data.result);

      // Clear input after submit
      setInput("");

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Enter to submit, Shift+Enter for new line
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        Travelyx-AI Planner
      </h1>

      <div className="w-full max-w-2xl bg-white border border-gray-300 rounded-xl p-6 shadow">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <textarea
            className="border border-gray-400 rounded-xl p-4 resize-none h-36 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition duration-200 text-black"
            placeholder="Ask Travelyx-AI to generate a travel plan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            autoFocus
          />

          <button
            type="submit"
            className={`bg-black text-white px-6 py-3 rounded-xl font-medium shadow hover:bg-gray-800 transition duration-200 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Travel Plan"}
          </button>

        </form>

        <div className="mt-6 space-y-4">

          {loading && (
            <div className="flex items-center gap-3 text-black font-medium">
              <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
              <span>Waiting for AI response...</span>
            </div>
          )}

          {error && (
            <div className="text-red-700 bg-red-100 border border-red-300 rounded-xl p-3 shadow-sm">
              {error}
            </div>
          )}

          {response && (
            <pre className="bg-gray-100 text-black p-4 rounded-xl shadow-inner border border-gray-200 max-h-96 overflow-y-auto whitespace-pre-wrap font-sans">
              {JSON.stringify(response, null, 2)}
              <div ref={responseEndRef} />
            </pre>
          )}

        </div>
      </div>
    </div>
  );
}