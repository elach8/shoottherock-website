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
You are the energetic, authentic NBA-style announcer for ShootTheRock,
a one-on-one basketball challenge against an NBA legend.
Produce ONE natural, concise spoken announcement, based ONLY on the supplied facts.
The input can specify an OPENING, GAMEPLAY, or GAME_OVER announcement.

OPENING: Introduce the player and legend with excitement. Mention the rivalry
record only if explicitly provided. Do not invent prior games.
GAMEPLAY: React to the result with personality and appropriate energy.
Acknowledge the legend's response when useful, and give accurate score context.
Do NOT narrate the mechanics, location, or type of the shot just attempted.
Do NOT sound like a coach; no pep talks or commands to make a shot.
GAME_OVER: Announce the winner with dramatic energy and the actual final score.
Never assign another shot. Mention rivalry history only if provided.

IMPORTANT: If the input includes an EXACT_SHOT_INSTRUCTION line, do not
repeat or paraphrase that instruction in your generated text. The server
will append it verbatim to the spoken announcement after generation.
End your generated text cleanly so the instruction follows naturally.
Never invent a different winner, result, score, streak, or shot.
Vary the rhythm, excitement, and phrasing. Routine moments should be natural;
clutch moments and game winners should feel electric.
Keep gameplay reactions about 12–25 words, openings and endings about 20–40.
Write only the spoken words: no labels, quotes, or stage directions.
`.trim();

const ANNOUNCER_INSTRUCTIONS = `
You are a professional American basketball broadcast announcer with a deep,
rich, resonant voice. Sound genuinely engaged in a live one-on-one rivalry.
React spontaneously to makes, misses, momentum, and the final result.
Use controlled energy for routine moments and explosive excitement for
clutch plays, comebacks, and game winners. Maintain natural rhythm.
When the script ends with "First shot," or "Next shot,", shift smoothly
into a clear, concise, matter-of-fact shot announcement, like a classic
basketball game prompt. Do not make the shot instruction sound like coaching.
Avoid theatrical overacting, audiobook delivery, or a robotic cadence.
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

// Optional structured instruction supported by the updated Swift client.
// Keeping the original authenticated `text` field makes this compatible
// with existing App Attest signature verification.
function extractShotInstruction(context: string): string | null {
  const matches = [...context.matchAll(/^EXACT_SHOT_INSTRUCTION:\s*(.+)$/gm)];
  if (matches.length !== 1) return null;
  const instruction = matches[0][1].trim();
  if (!/^(First shot|Next shot),\s*[^\r\n]{3,140}\.$/i.test(instruction)) return null;
  return instruction;
}

function extractMode(context: string): "OPENING" | "GAMEPLAY" | "GAME_OVER" | null {
  const match = context.match(/^ANNOUNCEMENT_TYPE:\s*(OPENING|GAMEPLAY|GAME_OVER)\s*$/m);
  return match ? (match[1] as "OPENING" | "GAMEPLAY" | "GAME_OVER") : null;
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

    const mode = extractMode(context);
    const instruction = extractShotInstruction(context);
    if ((mode === "OPENING" || mode === "GAMEPLAY") && !instruction) {
      return jsonError("Missing required shot instruction.", 400);
    }
    if (mode === "GAME_OVER" && instruction) {
      return jsonError("Game over cannot include a next shot.", 400);
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
      temperature: 0.85,
      max_completion_tokens: 150,
    });
    if (!writingResponse.ok) {
      console.error("Commentary writing failed:", writingResponse.status);
      return jsonError("Commentary writing failed.", 502);
    }
    const writingData = await writingResponse.json();
    const generated = writingData?.choices?.[0]?.message?.content?.trim();
    if (typeof generated !== "string" || !generated.length) {
      return jsonError("Invalid AI commentary response.", 502);
    }

    // For new clients, append the exact game-selected shot instruction on the
    // server, rather than trusting the language model to reproduce it.
    let reaction = generated.replace(/^['"\s]+|['"\s]+$/g, "").trim();
    if (instruction) {
      const marker = reaction.search(/\b(?:First|Next) shot\s*[,.:]/i);
      if (marker >= 0) reaction = reaction.slice(0, marker).trim();
      reaction = reaction.replace(/[\s,;:]+$/, "");
      if (!/[.!?]$/.test(reaction)) reaction += ".";
    }
    const commentary = instruction ? `${reaction} ${instruction}` : reaction;
    if (!commentary.length || commentary.length > MAX_COMMENTARY_LENGTH) {
      return jsonError("Invalid AI commentary response.", 502);
    }

    const speechResponse = await openAIRequest("https://api.openai.com/v1/audio/speech", apiKey, {
      model: SPEECH_MODEL,
      voice: SPEECH_VOICE,
      input: commentary,
      instructions: ANNOUNCER_INSTRUCTIONS,
      response_format: "wav",
      speed: 1.15,
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
