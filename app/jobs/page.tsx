"use client";

import SkeletonCard from "@/app/components/SkeletonCard";
import Link from "next/link";
import { useEffect, useState } from "react";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  skills: string[];
};

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (title) query.append("title", title);
      if (location) query.append("location", location);
      if (type) query.append("type", type);

      const res = await fetch(`/api/jobs?${query.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadInitialJobs = async () => {
      try {
        const res = await fetch("/api/jobs?");
        const data = await res.json();
        if (!cancelled) {
          setJobs(data.jobs || []);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadInitialJobs();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-700">
          Opportunities across Bangladesh
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find your next role</h1>
        <p className="mt-2 text-slate-600">
          Search open positions by role, location, or work arrangement.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-8 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          type="text"
          placeholder="Job title or keywords..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Job Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="REMOTE">Remote</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <button
          onClick={fetchJobs}
          className="rounded-lg bg-blue-600 p-3 font-semibold text-white shadow-sm hover:bg-blue-700"
        >
          Filter Jobs
        </button>
      </div>

      {/* Loading, Empty, and Content States */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-lg font-semibold text-slate-900">No jobs found</p>
          <p className="mt-2 text-slate-500">Try a broader search or clear one of your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-900">{job.title}</h2>
                <p className="mt-1 font-medium text-slate-600">
                  {job.company} · {job.location}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  {job.type.replace("_", " ")} · {job.salary || "Salary negotiable"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="mt-6 inline-block rounded-lg bg-slate-900 py-2.5 text-center font-semibold text-white hover:bg-slate-700"
              >
                View Details & Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
