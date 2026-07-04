import Image from "next/image";
import Section from "@/components/Section";

export default function Health() {
  return (
    <Section
      id="health"
      eyebrow="Real Workout"
      title="Train your game. Improve your fitness."
      subtitle="Every Beat a Legend session is recorded as a basketball workout in Apple Fitness, making it easy to track both your performance and your conditioning."
    >
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <h3 className="text-3xl font-black">
              Every possession keeps you moving.
            </h3>

            <p className="mt-4 leading-8 text-zinc-400">
              Compete against basketball legends while building endurance on the
              court. When you're finished, your workout is automatically saved
              to Apple Fitness with your time, heart rate, and active calories.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="text-3xl font-black text-orange-400">TIME</div>
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