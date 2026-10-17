"use client";

import ApplicationBadge from "@/app/components/ApplicationBadge";
import EmptyState from "@/app/components/EmptyState";
import PageHeader from "@/app/components/PageHeader";
import SkeletonCard from "@/app/components/SkeletonCard";
import Link from "next/link";
import { useEffect, useState } from "react";

type Application = {
  id: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
    company: string;
  };
};

export default function SeekerDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications/my");
        const data = await res.json();
        setApplications(data.applications || []);
      } catch (error) {
        console.error("Failed to load applications", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <PageHeader
        eyebrow="Job seeker dashboard"
        title="My applications"
        description="Track every opportunity from your first application to the final decision."
        action={
          <Link
            href="/jobs"
            className="inline-flex w-fit items-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            Find more jobs
          </Link>
        }
      />

      {loading ? (
        <SkeletonCard />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Start exploring open roles and your applications will appear here."
          action={
            <Link
              href="/jobs"
              className="inline-flex rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700"
            >
              Browse open jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="text-slate-900">
                <h3 className="text-lg font-semibold text-slate-950">{app.job.title}</h3>
                <p className="mt-1 text-sm text-slate-600">
                  {app.job.company} · Applied {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>
              <ApplicationBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
