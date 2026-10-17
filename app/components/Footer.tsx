import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p>JobBoard BD. Built for better opportunities.</p>
        <div className="flex gap-4">
          <Link href="/jobs" className="hover:text-slate-950">
            Browse jobs
          </Link>
          <Link href="/profile" className="hover:text-slate-950">
            Profile
          </Link>
        </div>
      </div>
    </footer>
  );
}
