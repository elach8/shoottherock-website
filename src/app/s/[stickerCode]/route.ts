import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ stickerCode: string }> }
) {
  const { stickerCode } = await params;

  const visitorId = crypto.randomUUID();

  await supabaseAdmin.from("qr_scan_events").insert({
    sticker_code: stickerCode,
    visitor_id: visitorId,
    user_agent: request.headers.get("user-agent"),
    referrer: request.headers.get("referer"),
  });

  const redirectUrl = new URL("/play", request.url);
  redirectUrl.searchParams.set("src", stickerCode);
  redirectUrl.searchParams.set("v", visitorId);

  return NextResponse.redirect(redirectUrl);
}