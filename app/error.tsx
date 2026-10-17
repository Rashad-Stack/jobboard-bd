"use client";

import Link from "next/link";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">Unexpected error</p>
      <h1 className="mt-3 text-4xl font-bold text-slate-950">Something went wrong</h1>
      <p className="mt-3 text-slate-600">We could not complete your request. Please try again.</p>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2.5 font-semibold text-slate-700"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
