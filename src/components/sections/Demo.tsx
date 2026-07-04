import Section from "@/components/Section";

export default function Demo() {
  return (
    <Section
      id="demo"
      eyebrow="Demo"
      title="Turn every shootaround into a competition."
      subtitle="Watch how ShootTheRock calls every shot, keeps score, tracks your performance, and lets you compete against basketball legends in real time."
    >
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0B0B0D] shadow-2xl">
        <video
          className="aspect-video w-full"
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