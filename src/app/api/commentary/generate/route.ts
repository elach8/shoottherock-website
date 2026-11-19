
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const OPENAI_MODEL = "gpt-4o-mini-tts-2025-03-20";
const OPENAI_VOICE = "verse";

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

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    // Temporary protection for local testing.
    // Replace with app authentication before deployment.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Commentary generation is not enabled in production." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const text = body?.text;

    if (
      typeof text !== "string" ||
      text.trim().length === 0 ||
      text.length > 1000
    ) {
      return NextResponse.json(
        { error: "Text must contain between 1 and 1000 characters." },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/audio/speech",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          voice: OPENAI_VOICE,
          input: text.trim(),
          instructions: ANNOUNCER_INSTRUCTIONS,
          response_format: "wav",
          speed: 1.0,
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const details = await response.text();

      console.error("OpenAI TTS error:", response.status, details);

      return NextResponse.json(
        {
          error: "Audio generation failed.",
          status: response.status,
        },
        { status: 502 }
      );
    }

    const audio = await response.arrayBuffer();

    return new NextResponse(audio, {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Content-Disposition": 'attachment; filename="commentary.wav"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Commentary generation error:", error);

    return NextResponse.json(
      { error: "Unable to generate commentary." },
      { status: 500 }
    );
  }
}
