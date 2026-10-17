"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Job = { id: string; title: string; company: string; location: string; status: string; _count: { applications: number } };
export default function EmployerJobs() {
  const [jobs, setJobs] = useState<Job[]>([]); const [message, setMessage] = useState("Loading...");
  const load = () => fetch("/api/employer/jobs").then(r => r.json()).then(d => { setJobs(d.jobs || []); setMessage(d.error || ""); }).catch(() => setMessage("Unable to load jobs."));
  useEffect(() => { void load(); }, []);
  return <main className="mx-auto w-full max-w-5xl px-4 py-12"><div className="flex items-center justify-between"><h1 className="text-3xl font-bold">Employer dashboard</h1><Link href="/employer/jobs/new" className="rounded bg-blue-600 px-4 py-2 font-semibold text-white">Post a job</Link></div>{message && <p className="mt-6 text-slate-600">{message}</p>}<div className="mt-6 grid gap-4">{jobs.map(job => <div key={job.id} className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"><div><h2 className="font-semibold">{job.title}</h2><p className="text-sm text-slate-600">{job.company} · {job.location} · {job.status}</p><p className="mt-1 text-sm">{job._count.applications} application(s)</p></div><Link href={`/employer/jobs/${job.id}/applicants`} className="rounded border px-3 py-2 text-sm">View applicants</Link></div>)}</div></main>;
}
