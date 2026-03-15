import { Groq } from "groq-sdk";

// ----------------------------
// Initialize Groq client
// ----------------------------
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * generateTravelPlan
 * ----------------------------
 * Calls the AI backend to generate a structured travel plan
 *
 * @param {string} userPrompt - The user's travel request
 * @returns {Promise<Object|null>} Parsed JSON travel plan or null if error
 */
export async function generateTravelPlan(userPrompt) {
  try {

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing in environment variables.");
      return null;
    }

    // ----------------------------
    // Call Groq AI model
    // ----------------------------
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_completion_tokens: 1024,
      top_p: 1,
      stream: false,
      messages: [
        {
          role: "system",
          content: `
You are Travelyx-AI, a structured AI Travel Planner.

ROLE:
You generate complete travel plans for modern travelers and small travel agencies.

RULES:
1. Always return a COMPLETE travel plan.
2. The total_trip_cost should not exceed the user's budget.
3. Prefer destinations geographically close to the departure country if the budget is low.
4. Each itinerary day must include morning, afternoon, and evening activities.
5. Maximum 3 activities per time block (morning, afternoon, evening).
6. Use realistic travel costs in EUR.
7. The itinerary must be realistic for the given duration.
8. Always respond ONLY in valid JSON.
9. Do not include explanations outside JSON.
10. Do not mention you are an AI model.
11. Ensure total_trip_cost equals the sum of flight, hotel_total, and daily_expenses_total.
12. The number of itinerary days must match the trip duration requested by the user.
13. Activities must match the travel style requested by the user.

OUTPUT FORMAT:
Return ONLY valid JSON using this structure:

{
  "destination": "",
  "country": "",
  "overview": "",
  "local_event_or_festival": "",
  "best_time_to_visit": "",
  "itinerary": [
    {
      "day": 1,
      "morning": [],
      "afternoon": [],
      "evening": []
    }
  ],
  "budget_estimate": {
    "flight": 0,
    "hotel_total": 0,
    "daily_expenses_total": 0,
    "total_trip_cost": 0
  }
}

IMPORTANT:
Return ONLY pure JSON. Do NOT wrap the JSON with markdown.
`
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
    });

    // ----------------------------
    // Extract AI response
    // ----------------------------
    const aiMessage = chatCompletion?.choices?.[0]?.message?.content;

    if (!aiMessage) {
      console.error("AI returned empty response.");
      return null;
    }

    // ----------------------------
    // Clean response (remove markdown)
    // ----------------------------
    const cleanMessage = aiMessage
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // ----------------------------
    // Parse JSON safely
    // ----------------------------
    try {
      const parsedResult = JSON.parse(cleanMessage);
      return parsedResult;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("AI raw response:", cleanMessage);
      return null;
    }

  } catch (error) {
    console.error("Travelyx-AI Error:", error);
    return null;
  }
}