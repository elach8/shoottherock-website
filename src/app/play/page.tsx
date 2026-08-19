import { supabaseAdmin } from "@/lib/supabaseAdmin";
import ReelsFeed from "./ReelsFeed";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  const { data: reels, error } = await supabaseAdmin
    .from("reels")
    .select("id,title,video_url,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <ReelsFeed reels={reels ?? []} />
    </main>
  );
}