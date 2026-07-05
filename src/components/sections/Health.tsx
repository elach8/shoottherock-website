import Image from "next/image";
import Section from "@/components/Section";

export default function Health() {
  return (
    <Section
      id="health"
      eyebrow="Real Workout"
      title="Train your game. Improve your fitness."
      subtitle="Every Beat a Legend session is automatically recorded as a basketball workout in Apple Fitness, complete with workout duration, heart rate, and active calories."
    >
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-black text-orange-400">TIME</div>
            <p className="mt-2 text-xs text-zinc-400">
              Workout Duration
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-black text-orange-400">CAL</div>
            <p className="mt-2 text-xs text-zinc-400">
              Active Calories
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <div className="text-2xl font-black text-orange-400">BPM</div>
            <p className="mt-2 text-xs text-zinc-400">
              Heart Rate
            </p>
          </div>
        </div>

        <div className="flex justify-center">
  <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0D] shadow-2xl shadow-black/50 max-w-[360px] lg:max-w-[420px]">
    <Image
      src="/images/gameplay/apple-fitness.png"
      alt="ShootTheRock Apple Fitness workout summary"
      width={828}
      height={1792}
      className="h-auto w-full"
    />
  </div>
</div>
      </div>
    </Section>
  );
}