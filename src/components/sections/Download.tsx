import Image from "next/image";
import Button from "@/components/Button";
import Section from "@/components/Section";

export default function Download() {
  return (
    <Section
      id="download"
      eyebrow="Download"
      title="Ready to shoot?"
      subtitle="Turn your next basketball workout into a game against the legends."
    >
      <div className="rounded-[2.5rem] border border-orange-500/30 bg-orange-500/10 p-10 text-center shadow-2xl shadow-orange-500/10">
        <div className="mx-auto mb-8 h-20 w-20 overflow-hidden rounded-3xl">
          <Image
            src="/images/app-icon.png"
            alt="ShootTheRock app icon"
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        </div>

        <h3 className="text-4xl font-black tracking-tight sm:text-5xl">
          ShootTheRock
        </h3>

        <p className="mx-auto mt-4 max-w-2xl leading-8 text-zinc-300">
          App Store launch coming soon. For now, follow development and get ready
          to run it back.
        </p>

        <div className="mt-8">
          <Button>Download Soon</Button>
        </div>
      </div>
    </Section>
  );
}