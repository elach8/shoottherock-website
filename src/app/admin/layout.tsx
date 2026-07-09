import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto flex max-w-6xl">
        <aside className="min-h-screen w-64 border-r border-white/10 px-6 py-8">
          <div className="text-2xl font-black">Shoot The Rock</div>
          <div className="mt-1 text-sm text-white/50">Admin</div>

          <nav className="mt-10 flex flex-col gap-3 text-sm font-bold">
            <Link href="/admin" className="rounded-xl px-3 py-2 hover:bg-white/10">
              Dashboard
            </Link>
            <Link href="/admin/install" className="rounded-xl px-3 py-2 hover:bg-white/10">
                Install Sticker
            </Link>
            
            <Link href="/admin/stickers" className="rounded-xl px-3 py-2 hover:bg-white/10">
              Stickers
            </Link>
            <Link href="/admin/analytics" className="rounded-xl px-3 py-2 hover:bg-white/10">
              Analytics
            </Link>
          </nav>
        </aside>

        <section className="flex-1 px-8 py-8">{children}</section>
      </div>
    </main>
  );
}