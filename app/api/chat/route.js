import { generateTravelPlan } from "@/lib/ai/SystemPrompt";

/**
 * POST /api/chat
 * ----------------
 * Receives a user message, calls AI backend,
 * and returns a structured travel plan
 */
export async function POST(req) {
  try {
    const { message } = await req.json();

    // Validate input
    if (!message || message.trim().length < 5) {
      return new Response(
        JSON.stringify({
          error: "Please provide a detailed travel request (at least 5 characters)."
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Artificial delay for loading UI
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Call AI backend safely
    let travelPlan = null;
    try {
      travelPlan = await generateTravelPlan(message);
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      return new Response(
        JSON.stringify({ error: "AI failed to generate a valid travel plan." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check AI response
    if (!travelPlan || Object.keys(travelPlan).length === 0) {
      return new Response(
        JSON.stringify({ error: "AI did not return a valid travel plan." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return structured travel plan
    return new Response(
      JSON.stringify({ result: travelPlan }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({ error: "Something went wrong on the server." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}