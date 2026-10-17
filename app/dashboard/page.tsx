"use client";

import ApplicationBadge from "@/app/components/ApplicationBadge";
import SkeletonCard from "@/app/components/SkeletonCard";
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Job Applications</h1>

      {loading ? (
        <SkeletonCard />
      ) : applications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <p className="text-gray-500 text-lg">No applications yet. Start applying to open jobs!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="border p-4 rounded-lg bg-white shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{app.job.title}</h3>
                <p className="text-sm text-gray-600">{app.job.company} • Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
              </div>
              <ApplicationBadge status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}