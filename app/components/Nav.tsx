"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-6 px-4">
        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-blue-700">JobBoard <span className="text-slate-900">BD</span></Link>
        <div className="flex items-center gap-1 text-sm font-medium text-slate-600">
          <Link href="/jobs" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">Browse jobs</Link>
          {session?.user.role === "JOB_SEEKER" && <><Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">Dashboard</Link><Link href="/ai-match" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">AI Match</Link></>}
          {session?.user.role === "EMPLOYER" && <Link href="/employer/jobs" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">Employer dashboard</Link>}
          {session ? (
            <><Link href="/profile" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">Profile</Link><button onClick={() => signOut({ callbackUrl: "/" })} className="ml-2 rounded-lg bg-slate-900 px-3 py-2 text-white hover:bg-slate-700">Sign out</button></>
          ) : (
            <><Link href="/auth/login" className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-900">Log in</Link><Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700">Get started</Link></>
          )}
        </div>
      </nav>
    </header>
  );
}
