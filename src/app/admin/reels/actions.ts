"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  if (user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Unauthorized");
  }
}

export async function createReelUpload(
  fileName: string,
  contentType: string
) {
  await verifyAdmin();

  const extension = fileName.split(".").pop()?.toLowerCase() || "mp4";
  const storagePath = `${crypto.randomUUID()}.${extension}`;

  const { data, error } = await supabaseAdmin.storage
    .from("reels")
    .createSignedUploadUrl(storagePath);

  if (error) {
    throw new Error(error.message);
  }

  return {
    path: storagePath,
    token: data.token,
    contentType: contentType || "video/mp4",
  };
}

export async function finishReelUpload({
  title,
  sortOrder,
  storagePath,
}: {
  title: string;
  sortOrder: number;
  storagePath: string;
}) {
  await verifyAdmin();

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("reels").getPublicUrl(storagePath);

  const { error } = await supabaseAdmin.from("reels").insert({
    title,
    video_url: publicUrl,
    storage_path: storagePath,
    sort_order: sortOrder,
    is_active: true,
  });

  if (error) {
    await supabaseAdmin.storage.from("reels").remove([storagePath]);
    throw new Error(error.message);
  }

  revalidatePath("/admin/reels");
}