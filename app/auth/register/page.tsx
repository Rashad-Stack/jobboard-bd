"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    });
    const data = await res.json();
    if (!res.ok) setError(data.error || "Unable to register.");
    else router.push("/auth/login");
    setLoading(false);
  }
  return (
    <main className="mx-auto w-full max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold">Create your account</h1>
      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <input
          name="name"
          required
          minLength={2}
          placeholder="Full name"
          className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
        />
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
          minLength={8}
          required
          placeholder="Password (8+ characters)"
          className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
        />
        <select
          name="role"
          className="w-full rounded border border-slate-300 bg-white p-3 text-slate-900"
        >
          <option value="JOB_SEEKER">I am looking for a job</option>
          <option value="EMPLOYER">I am hiring</option>
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/auth/login" className="text-blue-700">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
