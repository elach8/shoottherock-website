import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black tracking-[0.25em] text-orange-400">
            Support
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            Need help with ShootTheRock?
          </h1>

          <p className="mt-6 text-lg leading-8 text-zinc-400">
            For support, feedback, bugs, or feature requests, email us at{" "}
            <a
              href="mailto:support@shoottherockapp.com"
              className="text-orange-400 hover:text-orange-300"
            >
              support@shoottherockapp.com
            </a>
            .
          </p>

          <div className="mt-12 grid gap-6">
            {[
              {
                title: "Apple Watch connection",
                text: "Make sure your Apple Watch is nearby, unlocked, and connected to your iPhone before starting a session.",
              },
              {
                title: "Microphone permissions",
                text: "ShootTheRock uses microphone access for voice commands during gameplay. You can manage this in iOS Settings.",
              },
              {
                title: "Apple Health permissions",
                text: "Workout data is written to Apple Health only with your permission. You can manage permissions in Apple Health settings.",
              },
              {
                title: "Bluetooth earbuds",
                text: "Earbuds are recommended so you can hear shot prompts and commentary clearly while playing.",
              },
              {
                title: "App-only mode",
                text: "In app-only mode, shot charts are based on the shot location you select during gameplay.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
              >
                <h2 className="text-2xl font-black">{item.title}</h2>
                <p className="mt-4 leading-8 text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}