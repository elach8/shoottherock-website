import Section from "@/components/Section";

export default function Demo() {
  return (
    <Section
      id="demo"
      eyebrow="Demo"
      title="See ShootTheRock In Action"
      subtitle="Watch a real workout against an NBA legend. No narration. No explanation. Just the game."
    >
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0D] shadow-2xl">
        <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-zinc-900 to-black">
          <div className="text-center">
            <div className="mb-6 text-6xl">▶️</div>

            <h3 className="text-3xl font-black">Demo Video Coming Soon</h3>

            <p className="mt-4 text-zinc-400">
              This placeholder will become your marketing video.
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}