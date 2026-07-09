import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const { count: stickerCount } = await supabaseAdmin
    .from("qr_stickers")
    .select("*", { count: "exact", head: true });

  const { count: scanCount } = await supabaseAdmin
    .from("qr_scan_events")
    .select("*", { count: "exact", head: true });

  const { data: scanVisitors } = await supabaseAdmin
    .from("qr_scan_events")
    .select("visitor_id")
    .not("visitor_id", "is", null);

  const uniqueVisitorCount = new Set(
    (scanVisitors ?? []).map((row) => row.visitor_id)
  ).size;

  const { count: videoStartedCount } = await supabaseAdmin
    .from("promo_events")
    .select("*", { count: "exact", head: true })
    .eq("event_name", "video_started");

  const { count: videoCompletedCount } = await supabaseAdmin
    .from("promo_events")
    .select("*", { count: "exact", head: true })
    .eq("event_name", "video_completed");

  const { count: appStoreClickCount } = await supabaseAdmin
    .from("promo_events")
    .select("*", { count: "exact", head: true })
    .eq("event_name", "app_store_clicked");

  const videoCompletionRate =
    videoStartedCount && videoStartedCount > 0
      ? Math.round(((videoCompletedCount ?? 0) / videoStartedCount) * 100)
      : 0;

  const appStoreClickRate =
    uniqueVisitorCount > 0
      ? Math.round(((appStoreClickCount ?? 0) / uniqueVisitorCount) * 100)
      : 0;

  const cards = [
    { label: "Stickers Installed", value: stickerCount ?? 0 },
    { label: "QR Scans", value: scanCount ?? 0 },
    { label: "Unique Visitors", value: uniqueVisitorCount },
    { label: "Video Starts", value: videoStartedCount ?? 0 },
    { label: "Video Completes", value: videoCompletedCount ?? 0 },
    { label: "App Store Clicks", value: appStoreClickCount ?? 0 },
    { label: "Video Completion Rate", value: `${videoCompletionRate}%` },
    { label: "App Store Click Rate", value: `${appStoreClickRate}%` },
  ];

  return (
    <div>
      <h1 className="text-4xl font-black">Dashboard</h1>
      <p className="mt-3 text-white/70">
        Sticker campaign performance overview.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
          >
            <div className="text-sm font-bold text-white/50">{card.label}</div>
            <div className="mt-3 text-4xl font-black">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}