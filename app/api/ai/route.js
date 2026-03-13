import { generateTravelPlan } from "@/lib/ai/SystemPrompt";

export async function POST(req) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "The message is missing." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Artificial delay to allow the loading spinner to be visible
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Call Groq AI to generate travel plan
    const travelPlan = await generateTravelPlan(message);

    if (!travelPlan) {
      return new Response(
        JSON.stringify({ error: "AI did not return a result." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

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