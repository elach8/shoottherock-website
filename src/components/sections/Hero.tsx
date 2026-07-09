import Image from "next/image";
import Button from "@/components/Button";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(249,115,22,0.25),transparent_35%),radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.12),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div>
          <div className="mb-6 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black tracking-[0.25em] text-orange-400">
            ShootTheRock
          </div>

          <h1 className="max-w-3xl text-6xl font-black leading-[0.88] tracking-[-0.06em] sm:text-7xl md:text-8xl">
            Lace up against legends.
            <span className="block text-orange-500">
              Beat them at their own game.
            </span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
            Face the greatest shooters in basketball history. ShootTheRock
            recreates their real shot selection, locations, and shooting
            percentages, challenging you to match their performance one
            possession at a time.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button>Download Soon</Button>
            
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 rounded-full bg-orange-500/15 blur-[140px]" />

          <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[#0B0B0D] shadow-2xl shadow-black/50">
            <Image
              src="/images/splash.png"
              alt="ShootTheRock artwork"
              width={650}
              height={1050}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}