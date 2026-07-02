import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-center md:justify-between">

        <div className="flex items-center gap-4">
          <Image
            src="/images/app-icon.png"
            alt="ShootTheRock app icon"
            width={56}
            height={56}
            className="rounded-2xl"
          />

          <div>
            <h3 className="text-xl font-black text-white">
              ShootTheRock
            </h3>

            <p className="mt-1 text-zinc-400">
              Turn every workout into a game.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-8 text-sm font-semibold">
          <a
            href="/support"
            className="text-zinc-400 transition hover:text-orange-400"
          >
            Support
          </a>

          <a
            href="/privacy"
            className="text-zinc-400 transition hover:text-orange-400"
          >
            Privacy Policy
          </a>

          <a
            href="mailto:support@shoottherockapp.com"
            className="text-zinc-400 transition hover:text-orange-400"
          >
            Contact
          </a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-8 text-center text-sm text-zinc-500">
        © 2026 Elach Technologies. All rights reserved.
      </div>
    </footer>
  );
}