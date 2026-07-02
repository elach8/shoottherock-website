import Section from "@/components/Section";

export default function Future() {
  const items = [
    {
      title: "🏆 Tournament Mode",
      text: "Compete through tournament brackets and advance toward a championship.",
    },
    {
      title: "🔥 Legendary Performances",
      text: "Relive iconic NBA games like Kobe's 81-point performance one possession at a time.",
    },
    {
      title: "⏱ Two Minute Drill",
      text: "Race against the clock and see how many points you can score before time expires.",
    },
    {
      title: "📡 Sensor Tracking",
      text: "Optional wearable sensors will automatically track your shot location with no manual input.",
    },
  ];

  return (
    <Section
      id="future"
      eyebrow="The Future"
      title="ShootTheRock is just getting started."
      subtitle="We're building new ways to compete, train, and improve with every update."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
          >
            <h3 className="text-2xl font-black">{item.title}</h3>

            <p className="mt-4 leading-8 text-zinc-400">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}