"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function installSticker(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");
  if (user.email !== process.env.ADMIN_EMAIL) redirect("/");

  const stickerCode = String(formData.get("sticker_code") ?? "").trim();
  const parkName = String(formData.get("park_name") ?? "").trim();
  const courtName = String(formData.get("court_name") ?? "").trim();
  const city = String(formData.get("city") ?? "Irvine").trim();
  const hoopNumberRaw = String(formData.get("hoop_number") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const hoopNumber = hoopNumberRaw ? Number(hoopNumberRaw) : null;

  const { error } = await supabaseAdmin.from("qr_stickers").insert({
    sticker_code: stickerCode,
    park_name: parkName,
    court_name: courtName || null,
    city,
    state: "CA",
    hoop_number: hoopNumber,
    installed_by: user.email,
    notes: notes || null,
    status: "active",
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/admin/install?installed=${encodeURIComponent(stickerCode)}`);
}