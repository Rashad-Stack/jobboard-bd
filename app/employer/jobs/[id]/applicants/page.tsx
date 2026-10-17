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
  const [message, setMessage] = useState("Loading...");
  useEffect(() => {
    params.then(({ id: jobId }) => {
      setId(jobId);
      fetch(`/api/applications/job/${jobId}`)
        .then((r) => r.json())
        .then((d) => {
          setItems(d.applications || []);
          setMessage(d.error || "");
        });
    });
  }, [params]);
  async function update(applicationId: string, status: string) {
    const res = await fetch(`/api/applications/${applicationId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const d = await res.json();
    if (!res.ok) setMessage(d.error);
    else setItems(items.map((item) => (item.id === applicationId ? { ...item, status } : item)));
  }
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Applicants</h1>
      {message && <p className="mt-4 text-slate-600">{message}</p>}
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
    </main>
  );
}
