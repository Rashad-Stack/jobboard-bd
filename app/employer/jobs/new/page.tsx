"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewJobPage() {
  const router = useRouter(); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); const data = Object.fromEntries(new FormData(e.currentTarget)); const res = await fetch("/api/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, skills: String(data.skills).split(",").map(s => s.trim()).filter(Boolean) }) }); const body = await res.json(); if (!res.ok) setError(body.error); else router.push("/employer/jobs"); setLoading(false); }
  return <main className="mx-auto w-full max-w-2xl px-4 py-12"><h1 className="text-3xl font-bold">Post a job</h1><form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">{[["title","Title"],["company","Company"],["location","Location"],["salary","Salary"]].map(([name,label]) => <input key={name} name={name} placeholder={label} required={name !== "salary"} className="w-full rounded border p-3" />)}<select name="type" className="w-full rounded border p-3"><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="REMOTE">Remote</option><option value="CONTRACT">Contract</option></select><textarea name="description" required minLength={20} placeholder="Describe the role (at least 20 characters)" rows={6} className="w-full rounded border p-3" /><input name="skills" required placeholder="Skills, comma separated" className="w-full rounded border p-3" />{error && <p className="text-red-600">{error}</p>}<button disabled={loading} className="rounded bg-blue-600 px-5 py-3 font-semibold text-white">{loading ? "Publishing..." : "Publish job"}</button></form></main>;
}
