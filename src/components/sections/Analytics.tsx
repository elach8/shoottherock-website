import Image from "next/image";
import Section from "@/components/Section";

export default function Analytics() {
  return (
    <Section
      id="analytics"
      eyebrow="Analytics"
      title="Know your game."
      subtitle="Analyze shot trends and filter every make and miss to discover exactly where your game is improving."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-3xl font-black">Shot Trends</h3>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B0B0D]">
            <Image
              src="/images/gameplay/shot-trend-cropped.png"
              alt="ShootTheRock shot trend chart"
              width={1200}
              height={900}
              className="h-auto w-full"
            />
          </div>

          <p className="mt-5 leading-7 text-zinc-400">
            Track your shooting percentage over time and see whether your work
            is paying off.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <h3 className="text-3xl font-black">Shot View</h3>

          <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0B0B0D]">
            <Image
              src="/images/gameplay/filtered-shot-view-cropped.png"
              alt="ShootTheRock filtered shot view"
              width={1200}
              height={1600}
              className="h-auto w-full"
            />
          </div>

          <p className="mt-5 leading-7 text-zinc-400">
            Filter by region, shot type, or distance to uncover strengths and
            weaknesses.
          </p>
        </div>
      </div>
    </Section>
  );
}