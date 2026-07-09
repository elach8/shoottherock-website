"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("Signing in...");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-6">
        <h1 className="text-3xl font-black">Admin Login</h1>

        <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
          <input
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="rounded-xl border border-white/10 bg-black px-4 py-3 text-white"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="rounded-full bg-orange-500 px-6 py-3 font-black text-black">
            Sign In
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
      </div>
    </main>
  );
}