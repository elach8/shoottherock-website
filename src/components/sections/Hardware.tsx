import Section from "@/components/Section";

export default function Hardware() {
  return (
    <Section
      id="hardware"
      eyebrow="Setup"
      title="What you’ll need."
      subtitle="ShootTheRock is built for iPhone and Apple Watch, with earbuds recommended for the best gameplay experience."
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          ["📱", "iPhone", "Runs the ShootTheRock app."],
          ["⌚", "Apple Watch", "Tracks your workout and drives gameplay."],
          ["🎧", "Earbud", "Recommended for voice prompts and commentary."],
          ["🏀", "Basketball", "Bring the rock. ShootTheRock does the rest."],
        ].map(([icon, title, text]) => (
          <div
            key={title}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
          >
            <div className="text-4xl">{icon}</div>
            <h3 className="mt-6 text-2xl font-black">{title}</h3>
            <p className="mt-3 leading-7 text-zinc-400">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[2rem] border border-orange-500/30 bg-orange-500/10 p-8">
        <h3 className="text-2xl font-black text-orange-400">
          Coming Soon: Sensor Tracking
        </h3>
        <p className="mt-3 max-w-3xl leading-8 text-zinc-300">
          The optional ShootTheRock vest and sensors will add automatic shot
          location tracking for players who want the full pro experience.
        </p>
      </div>
    </Section>
  );
}