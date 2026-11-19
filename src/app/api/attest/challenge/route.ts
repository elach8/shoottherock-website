
import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { getAISupabaseAdmin } from "@/lib/aiSupabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CHALLENGE_LIFETIME_SECONDS = 300;

export async function POST() {
  // Match the registration endpoint's environment controls.
  const environment =
    process.env.APPLE_APP_ATTEST_ENVIRONMENT;

  if (
    environment !== "development" &&
    environment !== "production"
  ) {
    return NextResponse.json(
      { error: "App Attest registration is not enabled." },
      { status: 503 }
    );
  }

  if (
    environment === "production" &&
    process.env.AI_ATTEST_PRODUCTION_ENABLED !== "true"
  ) {
    return NextResponse.json(
      { error: "Production registration is not enabled." },
      { status: 503 }
    );
  }

  try {
    const supabase = getAISupabaseAdmin();

    const challenge = randomBytes(32).toString("base64url");

    const challengeHash = createHash("sha256")
      .update(challenge)
      .digest("hex");

    const expiresAt = new Date(
      Date.now() + CHALLENGE_LIFETIME_SECONDS * 1000
    ).toISOString();

    const { error } = await supabase
      .from("ai_attest_challenges")
      .insert({
        challenge_hash: challengeHash,
        purpose: "registration",
        expires_at: expiresAt,
      });

    if (error) {
      console.error(
        "App Attest challenge storage failed:",
        error
      );

      return NextResponse.json(
        { error: "Unable to create challenge." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        challenge,
        expiresAt,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("App Attest challenge error:", error);

    return NextResponse.json(
      { error: "Unable to create challenge." },
      { status: 500 }
    );
  }
}
