
import { NextResponse } from "next/server";
import {
  createHash,
  createPublicKey,
  verify,
} from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import cbor from "cbor";

export const runtime = "nodejs";

const APP_ID =
  `${process.env.APPLE_TEAM_ID}.${process.env.APPLE_BUNDLE_ID}`;

function sha256(value: Buffer | string): Buffer {
  return createHash("sha256").update(value).digest();
}

function decodeBase64(value: string): Buffer {
  return Buffer.from(
    value.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  );
}

export async function POST(request: Request) {
  try {
    const { keyId, assertion, challenge } =
      await request.json();

    if (
      typeof keyId !== "string" ||
      typeof assertion !== "string" ||
      typeof challenge !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SECRET_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data: installation, error } = await supabase
      .from("ai_app_installations")
      .select("id, public_key, sign_count, is_active")
      .eq("key_id", keyId)
      .maybeSingle();

    if (error || !installation?.is_active) {
      return NextResponse.json(
        { error: "Unknown installation" },
        { status: 403 }
      );
    }

    const parsed = cbor.decodeFirstSync(
      decodeBase64(assertion)
    );

    const authenticatorData = Buffer.from(
      parsed.authenticatorData
    );

    const signature = Buffer.from(parsed.signature);

    if (authenticatorData.length < 37) {
      return NextResponse.json(
        { error: "Invalid authenticator data" },
        { status: 403 }
      );
    }

    const expectedRPID = sha256(APP_ID);

    if (
      !authenticatorData.subarray(0, 32)
        .equals(expectedRPID)
    ) {
      return NextResponse.json(
        { error: "App identifier mismatch" },
        { status: 403 }
      );
    }

    const counter = authenticatorData.readUInt32BE(33);

    if (counter <= installation.sign_count) {
      return NextResponse.json(
        { error: "Assertion replay detected" },
        { status: 403 }
      );
    }

    const clientDataHash = sha256(
      decodeBase64(challenge)
    );

    // Preserve the signature verification that
    // successfully passed on the iPhone.
    const nonce = sha256(
      Buffer.concat([
        authenticatorData,
        clientDataHash,
      ])
    );

    const publicKey = createPublicKey(
      installation.public_key
    );

    const valid = verify(
      "sha256",
      nonce,
      publicKey,
      signature
    );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid assertion signature" },
        { status: 403 }
      );
    }

    // The challenge endpoint stores SHA-256 of
    // the Base64URL challenge string, not its bytes.
    const challengeHash = sha256(challenge)
      .toString("hex");

    // Atomically consume the challenge and
    // advance the assertion counter.
    const { data: consumed, error: consumeError } =
      await supabase.rpc("consume_ai_assertion", {
        p_key_id: keyId,
        p_challenge_hash: challengeHash,
        p_new_sign_count: counter,
      });

    if (consumeError) {
      console.error(
        "App Attest assertion consumption failed:",
        consumeError
      );

      return NextResponse.json(
        { error: "Assertion verification unavailable" },
        { status: 500 }
      );
    }

    if (consumed !== true) {
      return NextResponse.json(
        { error: "Assertion expired or already used" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      verified: true,
    });
  } catch (error) {
    console.error("App Attest assertion error:", error);

    return NextResponse.json(
      { error: "Assertion verification failed" },
      { status: 403 }
    );
  }
}
