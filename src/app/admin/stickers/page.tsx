import { redirect } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/supabaseServer";

export default async function StickersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

 const { data: stickers, error } = await supabaseAdmin
  .from("qr_stickers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black">Stickers</h1>
          <p className="mt-3 text-white/70">
            Manage QR sticker locations.
          </p>
        </div>

        <Link
          href="/admin/stickers/new"
          className="rounded-full bg-orange-500 px-5 py-3 font-black text-black"
        >
          Add Sticker
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/10 text-white/70">
            <tr>
              <th className="px-4 py-3">Sticker</th>
              <th className="px-4 py-3">Park</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Hoop</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(stickers ?? []).map((sticker) => (
              <tr key={sticker.id} className="border-t border-white/10">
                <td className="px-4 py-3 font-bold">{sticker.sticker_code}</td>
                <td className="px-4 py-3">{sticker.park_name}</td>
                <td className="px-4 py-3">{sticker.city}</td>
                <td className="px-4 py-3">{sticker.hoop_number ?? "-"}</td>
                <td className="px-4 py-3">{sticker.status}</td>
              </tr>
            ))}

            {(stickers ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-white/50">
                  No stickers added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}