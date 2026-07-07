// app/play/page.tsx

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PlayPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    setHasStarted(true);
    video.muted = false;
    video.controls = true;
    await video.play();
  };

  const sharePage = async () => {
    const shareData = {
      title: "Shoot The Rock",
      text: "Think you can close out Kobe? Try Shoot The Rock.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied.");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-8 pt-4">
        <button
          type="button"
          onClick={playVideo}
          className="relative w-full overflow-hidden rounded-3xl bg-black shadow-2xl"
          aria-label="Play Shoot The Rock video"
        >
          <video
            ref={videoRef}
            className="w-full"
            playsInline
            preload="metadata"
            poster="/shoot-the-rock-landscape-logo.png"
            onEnded={() => {
              if (videoRef.current) {
                videoRef.current.controls = false;
              }
            }}
          >
            <source src="/ShootTheRockPromoLandscape.mp4" type="video/mp4" />
          </video>

          {!hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-4xl text-black shadow-2xl">
                ▶
              </div>
            </div>
          )}
        </button>

        <div className="mt-7 flex flex-col gap-4">
          <a
            href="YOUR_APP_STORE_LINK_HERE"
            className="rounded-full bg-orange-500 px-8 py-4 text-center text-lg font-black text-black transition hover:bg-orange-400"
          >
            Download on the App Store
          </a>

          <Link
            href="/"
            className="rounded-full border border-white/20 px-8 py-4 text-center text-lg font-bold text-white transition hover:border-orange-400 hover:text-orange-400"
          >
            Visit ShootTheRockApp.com
          </Link>
        </div>

        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-center">
          <p className="text-base font-semibold leading-7 text-white sm:text-xl">
                Shoot The Rock was created by a local hooper. If you know someone who'd love
                competing against basketball legends, please help us spread the word.
            </p>


          <button
            type="button"
            onClick={sharePage}
            aria-label="Share Shoot The Rock"
            className="mx-auto mt-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 text-2xl text-white transition hover:border-orange-400 hover:text-orange-400"
          >
            ↗
          </button>
        </div>
      </section>
    </main>
  );
}