"use client";

import { useRef, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import {
  createReelUpload,
  finishReelUpload,
} from "./actions";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReelUploader() {
  const formRef = useRef<HTMLFormElement | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setIsUploading(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);

      const title = String(formData.get("title") ?? "").trim();
      const sortOrder = Number(formData.get("sortOrder") ?? 0);
      const file = formData.get("video");

      if (!title) {
        throw new Error("Title is required.");
      }

      if (!(file instanceof File) || file.size === 0) {
        throw new Error("Video file is required.");
      }

      const upload = await createReelUpload(
        file.name,
        file.type
      );

      const { error: uploadError } = await supabase.storage
        .from("reels")
        .uploadToSignedUrl(
          upload.path,
          upload.token,
          file,
          {
            contentType: upload.contentType,
          }
        );

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      await finishReelUpload({
        title,
        sortOrder,
        storagePath: upload.path,
      });

      setMessage("Reel uploaded successfully.");
      formRef.current?.reset();
    } catch (error) {
      console.error(error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Upload failed."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
    >
      <h2 className="text-2xl font-black">
        Upload Reel
      </h2>

      <div className="mt-6">
        <label className="text-sm font-bold text-white/70">
          Title
        </label>

        <input
          name="title"
          type="text"
          required
          placeholder="Don't Be a Corner Boy"
          className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-400"
        />
      </div>

      <div className="mt-5">
        <label className="text-sm font-bold text-white/70">
          Sort Order
        </label>

        <input
          name="sortOrder"
          type="number"
          min="0"
          defaultValue="1"
          required
          className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none focus:border-orange-400"
        />
      </div>

      <div className="mt-5">
        <label className="text-sm font-bold text-white/70">
          Video
        </label>

        <input
          name="video"
          type="file"
          accept="video/*"
          required
          className="mt-2 block w-full text-sm text-white/70"
        />
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="mt-6 rounded-full bg-orange-500 px-7 py-3 font-black text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isUploading ? "Uploading..." : "Upload Reel"}
      </button>

      {message && (
        <p className="mt-4 text-sm font-semibold text-white/70">
          {message}
        </p>
      )}
    </form>
  );
}