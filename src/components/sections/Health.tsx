import Image from "next/image";
import Section from "@/components/Section";

export default function Health() {
  return (
    <Section
      id="health"
      eyebrow="Apple Fitness"
      title="Every game counts."
      subtitle="ShootTheRock records your session as a basketball workout, including time, calories, and heart rate."
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h3 className="text-3xl font-black">Close your rings.</h3>
            <p className="mt-4 leading-8 text-zinc-400">
              Beat a Legend is more than a shooting game. It becomes a real
              workout that shows up in Apple Fitness.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-3xl font-black text-orange-400">Time</div>
              <p className="mt-2 text-zinc-400">Workout duration</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-3xl font-black text-orange-400">CAL</div>
              <p className="mt-2 text-zinc-400">Active calories</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-3xl font-black text-orange-400">BPM</div>
              <p className="mt-2 text-zinc-400">Heart rate</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0D] shadow-2xl shadow-black/50">
          <Image
            src="/images/gameplay/apple-fitness.png"
            alt="ShootTheRock Apple Fitness workout summary"
            width={828}
            height={1792}
            className="h-auto w-full"
          />
        </div>
      </div>
    </Section>
  );
}