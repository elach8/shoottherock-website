import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-4 z-50 flex justify-center px-4 sm:top-6 sm:px-6">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/75 px-4 py-3 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:px-8 sm:py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3">
          <Image
            src="/images/app-icon.png"
            alt="ShootTheRock app icon"
            width={34}
            height={34}
            className="rounded-xl sm:h-9 sm:w-9"
          />

          <span className="hidden text-lg font-black tracking-tight sm:block">
            ShootTheRock
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 lg:flex">
          <a
            href="/#beat-a-legend"
            className="transition hover:text-orange-400"
          >
            Gameplay
          </a>

          <a
            href="/#demo"
            className="transition hover:text-orange-400"
          >
            Demo
          </a>

          <a
            href="/#analytics"
            className="transition hover:text-orange-400"
          >
            Progress
          </a>

          <a
            href="/#future"
            className="transition hover:text-orange-400"
          >
            What's Next
          </a>
        </div>

        {/* Download Button */}
        <a
          href="/#download"
          className="shrink-0 rounded-full bg-orange-500 px-5 py-3 text-sm font-black text-black transition hover:bg-orange-400 sm:px-7 sm:py-4 sm:text-base"
        >
          Download
        </a>
      </div>
    </nav>
  );
}