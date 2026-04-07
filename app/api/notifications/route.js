import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { sendTransactionalEmail } from "@/lib/server/transactionalEmail";

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await req.json();
    const result = await sendTransactionalEmail({ to: user.email, type });

    return NextResponse.json(result, { status: result.sent ? 200 : 503 });
  } catch (error) {
    console.error("Notification route error:", error);
    return NextResponse.json({ sent: false, reason: "server_error" }, { status: 500 });
  }
}
