"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  skills: string[];
};

export default function JobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    params.then(({ id }) =>
      fetch(`/api/jobs/${id}`)
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setJob(d.job);
        })
        .catch((e) => setError(e.message || "Unable to load this job."))
        .finally(() => setLoading(false)),
    );
  }, [params]);
  async function apply() {
    if (!job) return;
    const res = await fetch(`/api/applications/${job.id}`, { method: "POST" });
    const data = await res.json();
    setMessage(res.ok ? "Application submitted successfully." : data.error || "Unable to apply.");
  }
  if (loading)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="animate-pulse space-y-5" aria-label="Loading job details" aria-busy="true">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="h-4 w-2/3 max-w-xs rounded bg-slate-200" />
            <div className="mt-4 h-10 w-full max-w-2xl rounded bg-slate-200" />
            <div className="mt-4 h-5 w-3/4 max-w-md rounded bg-slate-200" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-11/12 rounded bg-slate-200" />
              <div className="h-4 w-10/12 rounded bg-slate-200" />
            </div>
            <div className="mt-8 flex gap-2">
              <div className="h-8 w-24 rounded-full bg-slate-200" />
              <div className="h-8 w-28 rounded-full bg-slate-200" />
              <div className="h-8 w-20 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>
      </main>
    );
  if (!job)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div role="alert" className="rounded-xl bg-red-50 p-5 text-red-700">
          {error || "Unable to load this job."}
        </div>
        <Link href="/jobs" className="mt-5 inline-flex text-sm font-semibold text-blue-700">
          Back to jobs
        </Link>
      </main>
    );
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/jobs" className="text-sm text-blue-700">
        ← Back to jobs
      </Link>
      <article className="mt-6 rounded-xl border bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold text-blue-700">
          {job.company} · {job.location}
        </p>
        <h1 className="mt-2 text-4xl font-bold">{job.title}</h1>
        <p className="mt-3 text-slate-600">
          {job.type} · {job.salary || "Salary negotiable"}
        </p>
        <div className="mt-8 whitespace-pre-wrap text-slate-700">{job.description}</div>
        <div className="mt-6 flex flex-wrap gap-2">
          {job.skills.map((skill) => (
            <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
              {skill}
            </span>
          ))}
        </div>
        {session?.user.role === "JOB_SEEKER" && (
          <button
            onClick={apply}
            className="mt-8 rounded bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            Apply now
          </button>
        )}
        {message && <p className="mt-4 text-sm text-slate-600">{message}</p>}
      </article>
    </main>
  );
}
