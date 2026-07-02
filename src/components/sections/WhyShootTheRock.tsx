import Section from "@/components/Section";

export default function WhyShootTheRock() {
  return (
    <Section
      id="features"
      eyebrow="Why ShootTheRock"
      title="Basketball workouts get repetitive."
      subtitle="ShootTheRock gives every session a purpose: compete, train, and improve while the game keeps score."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="text-4xl">🏀</div>

          <h3 className="mt-6 text-2xl font-black">
            Compete
          </h3>

          <p className="mt-3 leading-7 text-zinc-400">
            Challenge NBA legends in real basketball workouts that keep score
            from the opening tip until the final shot.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="text-4xl">🎯</div>

          <h3 className="mt-6 text-2xl font-black">
            Train
          </h3>

          <p className="mt-3 leading-7 text-zinc-400">
            Every prompt has a purpose, giving you shot types and locations that
            keep every rep engaging.
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
          <div className="text-4xl">📈</div>

          <h3 className="mt-6 text-2xl font-black">
            Improve
          </h3>

          <p className="mt-3 leading-7 text-zinc-400">
            Review shot charts, trends, session history, and performance after
            every workout.
          </p>
        </div>
      </div>
    </Section>
  );
}