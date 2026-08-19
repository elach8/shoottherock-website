import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

import ReelUploader from "./ReelUploader";

export default async function ReelsAdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const { data: reels, error } = await supabaseAdmin
    .from("reels")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div>
      <h1 className="text-4xl font-black">Reels</h1>

      <p className="mt-3 text-white/70">
        Upload and manage videos used on the Shoot The Rock reels page.
      </p>

      <div className="mt-8 max-w-2xl">
        <ReelUploader />
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-black">Current Reels</h2>

        {reels && reels.length > 0 ? (
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            {reels.map((reel) => (
              <div
                key={reel.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <video
                  src={reel.video_url}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-[9/16] max-h-[500px] w-full rounded-xl bg-black object-contain"
                />

                <div className="mt-4 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-black">{reel.title}</div>

                    <div className="mt-1 text-sm text-white/50">
                      Order {reel.sort_order}
                    </div>
                  </div>

                  <div
                    className={`rounded-full px-3 py-1 text-xs font-black ${
                      reel.is_active
                        ? "bg-green-500/20 text-green-300"
                        : "bg-white/10 text-white/50"
                    }`}
                  >
                    {reel.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/60">
            No reels uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}