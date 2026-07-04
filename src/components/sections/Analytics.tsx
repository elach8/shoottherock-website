import Image from "next/image";
import Section from "@/components/Section";

export default function Analytics() {
  return (
    <Section
      id="analytics"
      eyebrow="Track Your Progress"
      title="See where your game is improving."
      subtitle="Every shot is automatically logged so you can review your sessions, identify strengths and weaknesses, and measure your progress over time."
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-2xl font-black">Shot Chart</h3>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B0B0D]">
            <Image
              src="/images/gameplay/live-session.png"
              alt="Overall shot chart"
              width={1200}
              height={1600}
              className="h-auto w-full"
            />
          </div>

          <p className="mt-5 leading-7 text-zinc-400">
            Review every make and miss from your session to visualize where
            you're shooting your best.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-2xl font-black">Filtered Analysis</h3>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B0B0D]">
            <Image
              src="/images/gameplay/filtered-shot-view-cropped.png"
              alt="Filtered shot chart"
              width={1200}
              height={1600}
              className="h-auto w-full"
            />
          </div>

          <p className="mt-5 leading-7 text-zinc-400">
            Filter by region, shot type, or distance to uncover strengths and
            pinpoint areas that need more work.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-2xl font-black">FG% Trend</h3>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B0B0D]">
            <Image
              src="/images/gameplay/shot-trend-cropped.png"
              alt="Field goal percentage trend"
              width={1200}
              height={900}
              className="h-auto w-full"
            />
          </div>

          <p className="mt-5 leading-7 text-zinc-400">
            Track your field goal percentage over time and watch your hard work
            translate into better shooting.
          </p>
        </div>
      </div>
    </Section>
  );
}