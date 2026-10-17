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
  const [message, setMessage] = useState("Loading job...");
  useEffect(() => {
    params.then(({ id }) =>
      fetch(`/api/jobs/${id}`)
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setJob(d.job);
          setMessage("");
        })
        .catch((e) => setMessage(e.message)),
    );
  }, [params]);
  async function apply() {
    if (!job) return;
    const res = await fetch(`/api/applications/${job.id}`, { method: "POST" });
    const data = await res.json();
    setMessage(res.ok ? "Application submitted successfully." : data.error || "Unable to apply.");
  }
  if (!job)
    return (
      <main className="mx-auto max-w-3xl px-4 py-12">
        <p>{message}</p>
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
