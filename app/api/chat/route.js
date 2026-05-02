import { generateTravelPlan } from "@/lib/ai/SystemPrompt";
import { createClient } from "@supabase/supabase-js";

/**
 * Handles the POST request for generating a travel plan via the AI system.
 * This endpoint verifies the user's authentication state using Supabase SSR cookies 
 * before processing the requested travel criteria.
 *
 * @param {Request} req - The incoming HTTP request containing the user's travel prompt payload.
 * @returns {Response} A JSON response containing the generated travel plan or an HTTP error status.
 */
export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. User not logged in." }),
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // AUTH CHECK - Ensure the user is authenticated before processing the request
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    // Reject the request if the token is invalid or the session does not exist
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. User not logged in." }),
        { status: 401 }
      );
    }

    // Parse the JSON payload from the incoming request body
    const { message } = await req.json();

    // Validate the input message length to prevent processing empty or generic queries
    if (!message || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Message too short." }),
        { status: 400 }
      );
    }

    // Invoke the AI travel plan generation service with the validated user prompt
    const travelPlan = await generateTravelPlan(message);

    // Return the successful JSON result back to the client application
    return new Response(
      JSON.stringify({ result: travelPlan }),
      { status: 200 }
    );

  } catch (err) {
    // Log any unexpected server-side errors for debugging and maintainability
    console.error(err);

    // Return a generic 500 status code to the client to avoid exposing internal logic
    return new Response(
      JSON.stringify({ error: "Server error." }),
      { status: 500 }
    );
  }
}
