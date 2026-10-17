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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Open Jobs</h1>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm border">
        <input
          type="text"
          placeholder="Job title or keywords..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Location (e.g. Dhaka)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Job Types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="REMOTE">Remote</option>
          <option value="CONTRACT">Contract</option>
        </select>
        <button
          onClick={fetchJobs}
          className="bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700"
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
          <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="border p-5 rounded-lg bg-white shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{job.title}</h2>
                <p className="text-gray-700 font-medium">{job.company} • {job.location}</p>
                <p className="text-sm text-gray-500 mt-1">Type: {job.type} | Salary: {job.salary || "Negotiable"}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {job.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                href={`/jobs/${job.id}`}
                className="mt-4 inline-block text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
              >
                View Details & Apply
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}