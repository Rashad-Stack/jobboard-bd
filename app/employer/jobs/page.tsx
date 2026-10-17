"use client";

import EmptyState from "@/app/components/EmptyState";
import JobListSkeleton from "@/app/components/JobListSkeleton";
import PageHeader from "@/app/components/PageHeader";
import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  status: string;
  _count: { applications: number };
};
export default function EmployerJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () =>
    fetch("/api/employer/jobs")
      .then((r) => r.json())
      .then((d) => {
        setJobs(d.jobs || []);
        setError(d.error || "");
      })
      .catch(() => setError("Unable to load jobs."))
      .finally(() => setLoading(false));

  useEffect(() => {
    void load();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <PageHeader
        eyebrow="Employer workspace"
        title="Manage your openings"
        description="Publish roles and move great candidates through your hiring pipeline."
        action={
          <Link
            href="/employer/jobs/new"
            className="inline-flex w-fit rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Post a job
          </Link>
        }
      />
      {loading ? (
        <JobListSkeleton />
      ) : error ? (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : jobs.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title="No job postings yet"
            description="Create your first opening to start receiving applications."
            action={
              <Link
                href="/employer/jobs/new"
                className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700"
              >
                Post your first job
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-slate-900">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-slate-950">{job.title}</h2>
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                    {job.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  {job.company} · {job.location}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-700">
                  {job._count.applications} application(s)
                </p>
              </div>
              <Link
                href={`/employer/jobs/${job.id}/applicants`}
                className="rounded-lg border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-900 hover:text-slate-900"
              >
                View applicants
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
