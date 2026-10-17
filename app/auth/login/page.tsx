"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    if (result?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
    setLoading(false);
  }
  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Welcome back</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
        <p className="text-sm text-slate-600">
          New here?{" "}
          <Link href="/auth/register" className="text-blue-700">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
