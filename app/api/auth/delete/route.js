import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendTransactionalEmail } from "@/lib/server/transactionalEmail";

export async function POST(req) {
  try {
    // 1. Get the Auth token from the request header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid authorization token" }, { status: 401 });
    }
    const token = authHeader.replace("Bearer ", "");

    // 2. Initialize a standard Supabase client purely to verify the token
    const standardSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    const { data: { user }, error: verificationError } = await standardSupabase.auth.getUser(token);

    if (verificationError || !user) {
      return NextResponse.json({ error: "Unauthorized request or token expired." }, { status: 401 });
    }

    // 3. Initialize Admin Supabase Client using the Service Role Key
    const serviceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({
        error: "Server configuration error: Service Role Key is missing. Cannot perform account deletion."
      }, { status: 500 });
    }

    const adminSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const userEmail = user.email;

    // 4. Delete the User from Auth (This cascades and deletes from RLS connected tables if configured correctly)
    const { error: deleteError } = await adminSupabase.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting user via Admin API:", deleteError.message);
      return NextResponse.json({ error: "Failed to delete account in database." }, { status: 500 });
    }

    let emailSent = false;
    if (userEmail) {
      try {
        const emailResult = await sendTransactionalEmail({ to: userEmail, type: "account_deleted" });
        emailSent = emailResult.sent;
      } catch (emailError) {
        console.error("Account deletion email failed:", emailError);
      }
    }

    // 5. Success
    return NextResponse.json(
      { success: true, message: "Account explicitly deleted.", emailSent },
      { status: 200 }
    );

  } catch (error) {
    console.error("Critical server error during account deletion:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
