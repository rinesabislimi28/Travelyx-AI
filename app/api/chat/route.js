import { generateTravelPlan } from "@/lib/ai/SystemPrompt";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get: (name) => cookieStore.get(name)?.value,
          set: () => {},
          remove: () => {},
        },
      }
    );

    // ✅ AUTH CHECK - Ensure the user is authenticated before processing the request
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. User not logged in." }),
        { status: 401 }
      );
    }

    const { message } = await req.json();

    if (!message || message.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: "Message too short." }),
        { status: 400 }
      );
    }

    const travelPlan = await generateTravelPlan(message);

    return new Response(
      JSON.stringify({ result: travelPlan }),
      { status: 200 }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Server error." }),
      { status: 500 }
    );
  }
}