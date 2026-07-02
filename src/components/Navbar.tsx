import Image from "next/image";
import Button from "@/components/Button";

export default function Navbar() {
  return (
    <nav className="fixed left-0 right-0 top-6 z-50 flex justify-center px-6">
      <div className="flex w-full max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/60 px-8 py-4 shadow-2xl shadow-black/40 backdrop-blur-2xl">

        <a href="#" className="flex items-center gap-3">
          <Image
            src="/images/app-icon.png"
            alt="ShootTheRock app icon"
            width={36}
            height={36}
            className="rounded-xl"
          />

          <span className="text-lg font-black tracking-tight">
            ShootTheRock
          </span>
        </a>

        <div className="hidden items-center gap-8 text-sm font-semibold text-zinc-300 md:flex">
          <a href="/#demo" className="transition hover:text-orange-400">
            Demo
          </a>

          <a href="/#analytics" className="transition hover:text-orange-400">
            Analytics
          </a>

          <a href="/#future" className="transition hover:text-orange-400">
            What's Next
          </a>
        </div>

        <Button href="/#download">
          Download
        </Button>

      </div>
    </nav>
  );
}