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
  <video
    className="w-full aspect-video"
    controls
    playsInline
    preload="metadata"
    poster="/ShootTheRockVideoPoster.png"
  >
    <source src="/ShootTheRockGameplay720.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
    </Section>
  );
}