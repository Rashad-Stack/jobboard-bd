"use client";

import { useEffect, useState } from "react";

type Applicant = {
  id: string;
  status: string;
  user: { name: string; email: string; profile?: { skills: string[] } };
};
export default function Applicants({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState("");
  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    params.then(({ id: jobId }) => {
      setId(jobId);
      fetch(`/api/applications/job/${jobId}`)
        .then((r) => r.json())
        .then((d) => {
          if (!d.applications) throw new Error(d.error || "Unable to load applicants.");
          setItems(d.applications || []);
        })
        .catch((reason: Error) => setError(reason.message))
        .finally(() => setLoading(false));
    });
  }, [params]);
  async function update(applicationId: string, status: string) {
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await res.json();
    if (!res.ok) setError(d.error || "Unable to update application.");
    else setItems(items.map((item) => (item.id === applicationId ? { ...item, status } : item)));
  }
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Applicants</h1>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}
      {loading ? (
        <div className="mt-6 space-y-4" aria-label="Loading applicants" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <div className="h-5 w-2/5 max-w-xs rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-3/5 max-w-sm rounded bg-slate-200" />
                  <div className="mt-3 h-4 w-full max-w-lg rounded bg-slate-200" />
                </div>
                <div className="h-5 w-24 shrink-0 rounded bg-slate-200" />
              </div>
              <div className="mt-4 flex gap-2">
                <div className="h-9 w-28 rounded bg-slate-200" />
                <div className="h-9 w-20 rounded bg-slate-200" />
                <div className="h-9 w-20 rounded bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="font-semibold text-slate-950">No applicants yet</h2>
          <p className="mt-2 text-sm text-slate-600">Applications for this job will appear here.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{item.user.name}</h2>
                  <p className="text-sm text-slate-600">{item.user.email}</p>
                  <p className="mt-2 text-sm">
                    Skills: {item.user.profile?.skills.join(", ") || "Not provided"}
                  </p>
                </div>
                <span className="font-semibold">{item.status}</span>
              </div>
              {item.status !== "ACCEPTED" && item.status !== "REJECTED" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => update(item.id, "REVIEWED")}
                    className="rounded border px-3 py-2 text-sm"
                  >
                    Mark reviewed
                  </button>
                  <button
                    onClick={() => update(item.id, "ACCEPTED")}
                    className="rounded bg-green-600 px-3 py-2 text-sm text-white"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => update(item.id, "REJECTED")}
                    className="rounded bg-red-600 px-3 py-2 text-sm text-white"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
