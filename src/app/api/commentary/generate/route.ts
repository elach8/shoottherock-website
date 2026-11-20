import { NextRequest, NextResponse } from "next/server";
import { createHash, createPublicKey, verify } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import cbor from "cbor";

export const runtime = "nodejs";

const WRITING_MODEL = "gpt-4o-mini";
const SPEECH_MODEL = "gpt-4o-mini-tts";
const SPEECH_VOICE = "verse";
const MAX_INPUT_LENGTH = 3000;
const MAX_COMMENTARY_LENGTH = 500;

const WRITER_INSTRUCTIONS = `
You are the lead play-by-play announcer for a live,
one-on-one basketball game between a player and an NBA legend.
Write ONE original, exciting, natural basketball commentary call.
Rules:
- Use the provided game context accurately.
- Describe what actually happened in the predicted outcome.
- Never invent a different score, shot result, or winner.
- Use the legend's name naturally.
- Recognize clutch moments, scoring streaks, and game winners.
- Vary your language, rhythm, and sentence structure.
- Sound like an authentic NBA broadcast.
- Routine plays should sound natural, not overly dramatic.
- Clutch plays and game winners should be exciting.
- Keep the commentary concise: approximately 15–35 words.
- Write only the words the announcer should speak.
- No quotation marks, labels, stage directions, or explanations.
`.trim();

const ANNOUNCER_INSTRUCTIONS = `
You are a professional NBA television play-by-play announcer
calling a live one-on-one basketball game.
Speak with a deep, rich, resonant American broadcast voice.
Deliver commentary with natural rhythm, confidence, and personality.
Build excitement as the action intensifies.
Use dramatic pauses and explosive enthusiasm for scoring streaks,
lead changes, and clutch moments.
Sound like a genuine live sports broadcast, not an audiobook,
commercial, or robotic narrator.
Understand NBA basketball culture and deliver legendary player
nicknames with familiarity and excitement.
Never sound overly theatrical during routine plays.
`.trim();

function sha256(data: Buffer | string): Buffer {
  return createHash("sha256").update(data).digest();
}

function decodeBase64(value: string): Buffer {
  if (!/^[A-Za-z0-9+/_-]+={0,2}$/.test(value)) {
    throw new Error("Invalid Base64 input");
  }
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const bytes = Buffer.from(normalized, "base64");
  if (!bytes.length || bytes.toString("base64").replace(/=+$/, "") !== normalized.replace(/=+$/, "")) {
    throw new Error("Invalid Base64 encoding");
  }
  return bytes;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

async function openAIRequest(url: string, apiKey: string, body: Record<string, unknown>): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    return await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    const teamId = process.env.APPLE_TEAM_ID;
    const bundleId = process.env.APPLE_BUNDLE_ID;
    if (!apiKey || !supabaseUrl || !supabaseKey || !teamId || !bundleId) {
      return jsonError("Commentary unavailable.", 503);
    }

    let body: unknown;
    try { body = await request.json(); } catch { return jsonError("Invalid JSON request.", 400); }
    if (!body || typeof body !== "object") return jsonError("Invalid request.", 400);
    const input = body as Record<string, unknown>;
    const { text, keyId, challenge, assertion } = input;
    if (typeof text !== "string" || typeof keyId !== "string" || typeof challenge !== "string" || typeof assertion !== "string") {
      return jsonError("Missing commentary authentication.", 400);
    }
    const context = text.trim();
    if (!context || context.length > MAX_INPUT_LENGTH || keyId.length > 256 || challenge.length > 256 || assertion.length > 8192) {
      return jsonError("Invalid commentary request.", 400);
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: installation, error: lookupError } = await supabase
      .from("ai_app_installations")
      .select("id, public_key, sign_count, is_active")
      .eq("key_id", keyId)
      .maybeSingle();
    if (lookupError) {
      console.error("Commentary installation lookup failed:", lookupError);
      return jsonError("Authentication unavailable.", 503);
    }
    if (!installation?.is_active) return jsonError("Unregistered device.", 403);

    const challengeBytes = decodeBase64(challenge);
    if (challengeBytes.length !== 32) return jsonError("Invalid challenge.", 403);

    const parsed = cbor.decodeFirstSync(decodeBase64(assertion));
    if (!parsed || !Buffer.isBuffer(parsed.authenticatorData) || !Buffer.isBuffer(parsed.signature)) {
      return jsonError("Invalid assertion.", 403);
    }
    const authData: Buffer = parsed.authenticatorData;
    const signature: Buffer = parsed.signature;
    if (authData.length < 37 || !authData.subarray(0, 32).equals(sha256(`${teamId}.${bundleId}`))) {
      return jsonError("Invalid app identity.", 403);
    }
    const counter = authData.readUInt32BE(33);
    if (counter <= Number(installation.sign_count)) return jsonError("Assertion replay detected.", 403);

    // Bind the signature to BOTH the server-issued challenge and the exact prompt.
    // Swift computes SHA256(challengeBytes || SHA256(UTF8(prompt))).
    const promptHash = sha256(Buffer.from(text, "utf8"));
    const clientDataHash = sha256(Buffer.concat([challengeBytes, promptHash]));
    const nonce = sha256(Buffer.concat([authData, clientDataHash]));
    const publicKey = createPublicKey(installation.public_key);
    if (!verify("sha256", nonce, publicKey, signature)) {
      return jsonError("Invalid assertion signature.", 403);
    }

    // The challenge endpoint stores SHA256 of the Base64URL challenge string.
    // This RPC atomically consumes it and advances the monotonic assertion counter.
    const { data: consumed, error: consumeError } = await supabase.rpc("consume_ai_assertion", {
      p_key_id: keyId,
      p_challenge_hash: sha256(challenge).toString("hex"),
      p_new_sign_count: counter,
    });
    if (consumeError) {
      console.error("Commentary assertion consumption failed:", consumeError);
      return jsonError("Authentication unavailable.", 503);
    }
    if (consumed !== true) return jsonError("Challenge expired or already used.", 403);

    const writingResponse = await openAIRequest("https://api.openai.com/v1/chat/completions", apiKey, {
      model: WRITING_MODEL,
      messages: [
        { role: "system", content: WRITER_INSTRUCTIONS },
        { role: "user", content: context },
      ],
      temperature: 0.9,
      max_completion_tokens: 120,
    });
    if (!writingResponse.ok) {
      console.error("Commentary writing failed:", writingResponse.status);
      return jsonError("Commentary writing failed.", 502);
    }
    const writingData = await writingResponse.json();
    const commentary = writingData?.choices?.[0]?.message?.content?.trim();
    if (typeof commentary !== "string" || !commentary.length || commentary.length > MAX_COMMENTARY_LENGTH) {
      return jsonError("Invalid AI commentary response.", 502);
    }

    const speechResponse = await openAIRequest("https://api.openai.com/v1/audio/speech", apiKey, {
      model: SPEECH_MODEL,
      voice: SPEECH_VOICE,
      input: commentary,
      instructions: ANNOUNCER_INSTRUCTIONS,
      response_format: "wav",
      speed: 1.0,
    });
    if (!speechResponse.ok) {
      console.error("Commentary speech failed:", speechResponse.status);
      return jsonError("Commentary audio generation failed.", 502);
    }
    const audio = await speechResponse.arrayBuffer();
    if (audio.byteLength <= 44 || new TextDecoder().decode(audio.slice(0, 4)) !== "RIFF") {
      return jsonError("Invalid AI audio response.", 502);
    }
    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Commentary generation error:", error);
    return jsonError("Unable to generate commentary.", 500);
  }
}
