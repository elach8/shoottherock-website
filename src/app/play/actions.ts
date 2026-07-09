"use server";

import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function logPromoEvent(
  stickerCode: string | null,
  visitorId: string | null,
  eventName: string
) {
  const headersList = await headers();

  await supabaseAdmin.from("promo_events").insert({
    sticker_code: stickerCode,
    visitor_id: visitorId,
    event_name: eventName,
    user_agent: headersList.get("user-agent"),
    referrer: headersList.get("referer"),
  });
}