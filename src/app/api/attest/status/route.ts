
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const keyId = body?.keyId;

    if (typeof keyId !== "string" || !keyId.trim()) {
      return NextResponse.json(
        { error: "Missing keyId" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Server configuration unavailable" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data, error } = await supabase
      .from("ai_app_installations")
      .select("id, is_active")
      .eq("key_id", keyId)
      .maybeSingle();

    if (error) {
      console.error("App Attest status lookup failed:", error);

      return NextResponse.json(
        { error: "Registration lookup failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      registered: data?.is_active === true,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
