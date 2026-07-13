"use client";

import { useRef, useState } from "react";
import Button from "@/components/Button";
import { logPromoEvent } from "@/app/play/actions";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);

  const getTrackingParams = () => {
    const params = new URLSearchParams(window.location.search);

    return {
      stickerCode: params.get("src"),
      visitorId: params.get("v"),
    };
  };

  const playVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    const { stickerCode, visitorId } = getTrackingParams();

    setHasStarted(true);
    setHasEnded(false);

    logPromoEvent(stickerCode, visitorId, "video_started");

    video.muted = false;

    try {
      await video.play();
    } catch (error) {
      console.error("Video playback failed:", error);
    }
  };

  const replayVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setHasStarted(true);
    setHasEnded(false);

    try {
      await video.play();
    } catch (error) {
      console.error("Video playback failed:", error);
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;

    if (!video || !hasStarted || hasEnded) return;

    if (video.paused) {
      video.play().catch((error) => {
        console.error("Video playback failed:", error);
      });
    } else {
      video.pause();
    }
  };

  const handleVideoEnded = () => {
    const { stickerCode, visitorId } = getTrackingParams();

    logPromoEvent(stickerCode, visitorId, "video_completed");

    setHasEnded(true);
  };

  const handleAppStoreClick = () => {
    const { stickerCode, visitorId } = getTrackingParams();

    logPromoEvent(stickerCode, visitorId, "app_store_clicked");
  };

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(249,115,22,0.22),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.10),transparent_30%)]" />

      <div className="relative mx-auto max-w-7xl">
        {/* VIDEO HERO */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/50">
          <video
            ref={videoRef}
            className="block w-full cursor-pointer"
            playsInline
            preload="metadata"
            poster="/shoot-the-rock-landscape-logo.png"
            onClick={togglePlayback}
            onEnded={handleVideoEnded}
          >
            <source
              src="/ShootTheRockPromoLandscape.mp4"
              type="video/mp4"
            />
          </video>

          {/* INITIAL PLAY OVERLAY */}
          {!hasStarted && (
            <button
              type="button"
              onClick={playVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/10"
              aria-label="Play Shoot The Rock video"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/90 pl-1 text-4xl text-black shadow-2xl transition hover:scale-105">
                ▶
              </div>
            </button>
          )}

          {/* REPLAY OVERLAY */}
          {hasEnded && (
            <button
              type="button"
              onClick={replayVideo}
              className="absolute inset-0 flex items-center justify-center bg-black/40"
              aria-label="Replay Shoot The Rock video"
            >
              <div className="rounded-full border border-white/20 bg-black/70 px-7 py-4 text-lg font-black text-white backdrop-blur-sm transition hover:border-orange-400 hover:text-orange-400">
                Replay
              </div>
            </button>
          )}
        </div>

        {/* HERO COPY */}
        <div className="mt-16 max-w-5xl">
          <div className="mb-6 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black tracking-[0.25em] text-orange-400">
            ShootTheRock
          </div>

          <h1 className="max-w-5xl text-5xl font-black leading-[0.9] tracking-[-0.06em] sm:text-6xl md:text-8xl">
            Lace up against legends.
            <span className="block text-orange-500">
              Beat them at their own game.
            </span>
          </h1>

          <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-400 sm:text-xl">
            Face the greatest shooters in basketball history. ShootTheRock
            recreates their real shot selection, locations, and shooting
            percentages, challenging you to match their performance one
            possession at a time.
          </p>

          <div
            className="mt-10 flex justify-start"
            onClick={handleAppStoreClick}
          >
            <Button>Download Soon</Button>
          </div>
        </div>
      </div>
    </section>
  );
}