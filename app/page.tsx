import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-4 py-20">
      <div className="max-w-3xl">
        <p className="mb-4 font-semibold text-blue-700">A better way to find work</p>
        <h1 className="text-5xl font-bold tracking-tight text-slate-900">
          Find meaningful jobs. Build your future.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          JobBoard BD connects talented people with growing companies across Bangladesh, with smart
          recommendations to help you move faster.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/jobs" className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white">
            Explore jobs
          </Link>
          <Link href="/auth/register" className="rounded-lg border px-5 py-3 font-semibold">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
