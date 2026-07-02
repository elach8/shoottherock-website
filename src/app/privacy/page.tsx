import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />

      <section className="px-6 pb-24 pt-40">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 inline-flex rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2 text-xs font-black tracking-[0.25em] text-orange-400">
            Privacy Policy
          </div>

          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
            Privacy Policy
          </h1>

          <p className="mt-6 text-zinc-400">
            Last updated: July 2, 2026
          </p>

          <div className="mt-12 space-y-10 leading-8 text-zinc-300">
            <section>
              <h2 className="text-2xl font-black text-white">Overview</h2>
              <p className="mt-4">
                ShootTheRock is a basketball workout app that uses iPhone,
                Apple Watch, voice input, shot tracking, and Apple Fitness
                integration to help players turn workouts into games.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Information We Collect</h2>
              <p className="mt-4">
                ShootTheRock may collect gameplay and workout-related data,
                including player profiles, shot results, shot locations, game
                scores, session history, selected legends, court type, workout
                duration, calories, and heart rate when permission is granted.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Microphone Access</h2>
              <p className="mt-4">
                ShootTheRock uses microphone access so players can record makes
                and misses using voice commands during gameplay. Voice input is
                used to operate the app experience and is not sold.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Apple Health and Fitness</h2>
              <p className="mt-4">
                With your permission, ShootTheRock may write basketball workouts
                to Apple Health and Apple Fitness, including workout duration,
                active calories, and related workout data. Health permissions
                are controlled by you through Apple Health settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Cloud Storage</h2>
              <p className="mt-4">
                ShootTheRock may store app data using Apple CloudKit, including
                player information, sessions, shots, and gameplay statistics so
                your history can be saved and displayed in the app.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">How We Use Information</h2>
              <p className="mt-4">
                Information is used to provide gameplay, track performance,
                display shot charts, show session history, save workouts, improve
                the app experience, and support app functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Data Sharing</h2>
              <p className="mt-4">
                ShootTheRock does not sell your personal data. Data may be
                processed through Apple services such as CloudKit and Apple
                Health as needed to provide app functionality.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Your Choices</h2>
              <p className="mt-4">
                You can manage microphone, health, motion, Bluetooth, and other
                app permissions through iOS Settings and Apple Health settings.
                Some features may not work if required permissions are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-white">Contact</h2>
              <p className="mt-4">
                For privacy questions or support, contact us at{" "}
                <a
                  href="mailto:support@shoottherockapp.com"
                  className="text-orange-400 hover:text-orange-300"
                >
                  support@shoottherockapp.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}