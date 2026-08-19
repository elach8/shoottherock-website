"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type Reel = {
  id: string;
  title: string;
  video_url: string;
  sort_order: number;
};

export default function ReelsFeed({ reels }: { reels: Reel[] }) {
    const infiniteReels = [...reels, ...reels, ...reels];
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    const [isMuted, setIsMuted] = useState(true);
    const [hasSwiped, setHasSwiped] = useState(false);
    const sharePage = async () => {
  const shareData = {
    title: "ShootTheRock",
    text: "Check out ShootTheRock.",
    url: window.location.href,
  };

  if (navigator.share) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied.");
  }
};

  useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target as HTMLVideoElement;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          videoRefs.current.forEach((otherVideo) => {
            if (otherVideo && otherVideo !== video) {
              otherVideo.pause();
            }
          });

          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: [0, 0.6, 1],
    }
  );

  videoRefs.current.forEach((video) => {
    if (video) observer.observe(video);
  });

  return () => {
    observer.disconnect();
  };
}, []);

  if (reels.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-lg font-bold text-white/70">
          No reels are available yet.
        </p>
      </div>
    );
  }

  return (
    <div
  onScroll={(event) => {
    if (event.currentTarget.scrollTop > 20) {
      setHasSwiped(true);
    }
  }}
  className="h-screen snap-y snap-mandatory overflow-y-scroll bg-black"
>
      {infiniteReels.map((reel, index) => (
        <section
          key={`${reel.id}-${index}`}
          className="relative flex h-screen snap-start items-center justify-center bg-black"
        >
          <video
            ref={(element) => {
              videoRefs.current[index] = element;
            }}
            src={reel.video_url}
            playsInline
            loop
            muted={isMuted}
            preload="metadata"
            className="h-full w-full object-contain"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

          <div className="absolute right-4 top-4 z-10 flex items-center">
       

            <a
              href="https://apps.apple.com/us/app/shoottherock/id6776022876"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-black"
            >
              Download
            </a>
          </div>
<button
  type="button"
  onClick={() => setIsMuted((current) => !current)}
  className="absolute bottom-40 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-xl backdrop-blur"
  aria-label={isMuted ? "Turn sound on" : "Mute sound"}
>
  {isMuted ? "🔇" : "🔊"}
</button>

<button
  type="button"
  onClick={sharePage}
  className="absolute right-4 bottom-24 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-xl backdrop-blur"
  aria-label="Share ShootTheRock"
>
  <svg
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  className="h-6 w-6"
  aria-hidden="true"
>
  <path d="M12 16V3" />
  <path d="M7 8l5-5 5 5" />
  <path d="M5 11v9h14v-9" />
</svg>
</button>

<Link
  href="/"
  className="absolute bottom-8 right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-black/60 text-xl backdrop-blur"
  aria-label="Visit ShootTheRock website"
>
  🌐
</Link>


          <div className="absolute bottom-8 left-4 right-4 z-10">
            <div className="max-w-xl">
              <h2 className="text-xl font-black">{reel.title}</h2>

              
            </div>
          </div>

         {index === 0 && !hasSwiped && (
  <div className="pointer-events-none absolute bottom-24 left-1/2 z-10 -translate-x-1/2 text-center">
    <div className="text-2xl">↑</div>
    <div className="mt-1 text-xs font-bold text-white/70">
      Swipe for more
    </div>
  </div>
)} 
        </section>
      ))}
    </div>
  );
}