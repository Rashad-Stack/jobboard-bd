"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Nav() {
  const { data: session } = useSession();
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-blue-700">JobBoard BD</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/jobs">Browse jobs</Link>
          {session?.user.role === "JOB_SEEKER" && <><Link href="/dashboard">Dashboard</Link><Link href="/ai-match">AI Match</Link></>}
          {session?.user.role === "EMPLOYER" && <Link href="/employer/jobs">Employer dashboard</Link>}
          {session ? (
            <><Link href="/profile">Profile</Link><button onClick={() => signOut({ callbackUrl: "/" })} className="rounded bg-slate-900 px-3 py-2 text-white">Sign out</button></>
          ) : (
            <><Link href="/auth/login">Log in</Link><Link href="/auth/register" className="rounded bg-blue-600 px-3 py-2 text-white">Get started</Link></>
          )}
        </div>
      </nav>
    </header>
  );
}
