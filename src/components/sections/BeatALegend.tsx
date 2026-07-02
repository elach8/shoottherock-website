import Image from "next/image";
import Section from "@/components/Section";

export default function BeatALegend() {
  return (
    <Section
      id="beat-a-legend"
      eyebrow="Beat a Legend"
      title="Every shot has a purpose."
      subtitle="ShootTheRock turns your workout into a live game against NBA legends, with shot locations, shot types, scoring, and commentary driving every possession."
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0D] shadow-2xl shadow-black/50">
          <Image
            src="/images/gameplay/live-session.png"
            alt="ShootTheRock live Beat a Legend session"
            width={1170}
            height={2532}
            className="h-auto w-full"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h3 className="text-3xl font-black">Can you beat Kobe?</h3>
            <p className="mt-4 leading-8 text-zinc-400">
              The app calls out your next shot, tracks your makes and misses,
              and keeps the score while you play.
            </p>
          </div>

          <div className="flex justify-center">
            <div className="overflow-hidden rounded-[34px] border-4 border-zinc-800 shadow-2xl">
  <Image
    src="/images/gameplay/watch.png"
    alt="Apple Watch gameplay prompt"
    width={410}
    height={512}
    className="block h-auto w-auto"
  />
</div>
          </div>
        </div>
      </div>
    </Section>
  );
}