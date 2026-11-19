
import "server-only";

import { NextResponse } from "next/server";
import { createHash } from "node:crypto";

import {
  verifyAppleAppAttestation,
  type AppAttestEnvironment,
} from "@/lib/appleAppAttest";
import { getAISupabaseAdmin } from "@/lib/aiSupabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 48 * 1024;

function hashChallenge(challenge: string): string {
  return createHash("sha256")
    .update(challenge)
    .digest("hex");
}

function jsonError(
  message: string,
  status: number
) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "no-store" },
    }
  );
}

export async function POST(request: Request) {
  // Registration remains closed in Production until
  // the complete security flow has been tested.
  const configuredEnvironment =
    process.env.APPLE_APP_ATTEST_ENVIRONMENT;

  if (
    configuredEnvironment !== "development" &&
    configuredEnvironment !== "production"
  ) {
    return jsonError(
      "App Attest registration is not enabled.",
      503
    );
  }

  // Explicit production safety switch.
  if (
    configuredEnvironment === "production" &&
    process.env.AI_ATTEST_PRODUCTION_ENABLED !== "true"
  ) {
    return jsonError(
      "Production registration is not enabled.",
      503
    );
  }

  const environment =
    configuredEnvironment as AppAttestEnvironment;

  try {
    const contentLength = request.headers.get(
      "content-length"
    );

    if (
      contentLength &&
      Number(contentLength) > MAX_BODY_BYTES
    ) {
      return jsonError("Request too large.", 413);
    }

    const rawBody = await request.text();

    if (
      Buffer.byteLength(rawBody, "utf8") >
      MAX_BODY_BYTES
    ) {
      return jsonError("Request too large.", 413);
    }

    let body: unknown;

    try {
      body = JSON.parse(rawBody);
    } catch {
      return jsonError("Invalid JSON.", 400);
    }

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return jsonError("Invalid request.", 400);
    }

    const data = body as Record<string, unknown>;

    const { keyId, challenge, attestation } = data;

    if (
      typeof keyId !== "string" ||
      typeof challenge !== "string" ||
      typeof attestation !== "string" ||
      keyId.length > 256 ||
      challenge.length > 256 ||
      attestation.length > 45000
    ) {
      return jsonError(
        "Invalid registration parameters.",
        400
      );
    }

    // Verify the Apple attestation cryptographically
    // before making any registration changes.
    let verified;

    try {
      verified = verifyAppleAppAttestation(
        attestation,
        keyId,
        challenge,
        environment
      );
    } catch {
      return jsonError(
        "App Attest verification failed.",
        403
      );
    }

    const supabase = getAISupabaseAdmin();

    // The SQL function atomically consumes the challenge
    // and inserts the installation. A reused challenge
    // or duplicate key causes the transaction to fail.
    const { data: installationId, error } =
      await supabase.rpc(
        "register_ai_app_installation",
        {
          p_challenge_hash: hashChallenge(challenge),
          p_key_id: verified.keyId,
          p_public_key: verified.publicKey,
          p_receipt: verified.receipt,
          p_environment: verified.environment,
        }
      );

    if (error || !installationId) {
      // Do not expose database details to the client.
      return jsonError(
        "Registration could not be completed.",
        409
      );
    }

    return NextResponse.json(
      {
        registered: true,
        installationId,
      },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error(
      "App Attest registration error:",
      error instanceof Error
        ? error.message
        : "Unknown error"
    );

    return jsonError(
      "Registration service unavailable.",
      500
    );
  }
}
