import { installSticker } from "./actions";

export default function InstallStickerPage({
  searchParams,
}: {
  searchParams?: { installed?: string };
}) {
  const installedCode = searchParams?.installed;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-4xl font-black">Install Sticker</h1>

      {installedCode && (
        <div className="mt-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-200">
          Sticker {installedCode} installed.
        </div>
      )}

      <form action={installSticker} className="mt-8 flex flex-col gap-5">
        <input name="sticker_code" required placeholder="Sticker ID" className="rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />
        <input name="park_name" required placeholder="Park Name" className="rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />
        <input name="court_name" placeholder="Court Name" className="rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />
        <input name="city" required defaultValue="Irvine" placeholder="City" className="rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />
        <input name="hoop_number" type="number" placeholder="Hoop Number" className="rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />
        <textarea name="notes" placeholder="Notes" className="min-h-28 rounded-xl border border-white/10 bg-black px-4 py-4 text-white" />

        <button className="rounded-full bg-orange-500 px-6 py-4 text-lg font-black text-black">
          Install Sticker
        </button>
      </form>
    </div>
  );
}