import Image from "next/image";
import Section from "@/components/Section";

export default function BeatALegend() {
  return (
    <Section
      id="beat-a-legend"
      eyebrow="Beat a Legend"
      title="How the game works."
      subtitle="Every possession mirrors the tendencies of a basketball legend. Listen for the call, perform the move, and see how your game stacks up."
    >
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-10 text-center">
          <h3 className="text-3xl font-black">
            Listen. Shoot. Say the result.
          </h3>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            Your earbuds call out a shot type and court location. Perform the
            move, take the shot, then say your personalized make or miss word.
            ShootTheRock logs the outcome, updates the score, and tracks your
            field goal percentage by region and shot type along with heart rate
            and calories burned.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div>
              <div className="text-5xl">🎧</div>
              <h4 className="mt-4 text-xl font-bold">Listen</h4>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Hear the shot type and court location in your earbuds.
              </p>
            </div>

            <div>
              <div className="text-5xl">🏀</div>
              <h4 className="mt-4 text-xl font-bold">Shoot</h4>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Perform the move and take the shot.
              </p>
            </div>

            <div>
              <div className="text-5xl">💬</div>
              <h4 className="mt-4 text-xl font-bold">Speak</h4>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Say your make or miss word to log the result.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="overflow-hidden rounded-[34px] border-4 border-zinc-800 shadow-2xl">
            <Image
              src="/images/gameplay/watch.png"
              alt="Apple Watch gameplay prompt"
              width={410}
              height={512}
              className="block h-auto w-auto"
            />
          </div>
        </div>
      </div>
    </Section>
  );
}