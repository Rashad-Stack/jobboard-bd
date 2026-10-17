"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) throw new Error(d.error || "Unable to load profile.");
        const p = d.user?.profile;
        setSkills(p?.skills?.join(", ") || "");
        setBio(p?.bio || "");
      })
      .catch((reason: Error) => setError(reason.message))
      .finally(() => setLoading(false));
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        skills: skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        bio,
      }),
    });
    const d = await res.json();
    if (res.ok) setMessage("Profile saved successfully.");
    else setError(d.error || "Unable to save profile.");
    setSaving(false);
  }
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Your profile</h1>
      {loading ? (
        <div
          className="mt-6 animate-pulse space-y-5 rounded-xl border bg-white p-6 shadow-sm"
          aria-label="Loading profile"
          aria-busy="true"
        >
          <div className="h-5 w-24 rounded bg-slate-200" />
          <div className="h-12 w-full rounded bg-slate-200" />
          <div className="h-5 w-20 rounded bg-slate-200" />
          <div className="h-32 w-full rounded bg-slate-200" />
          <div className="h-12 w-36 rounded bg-slate-200" />
        </div>
      ) : error && !skills && !bio ? (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">
          <label className="block font-medium">
            Skills
            <input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, TypeScript, PostgreSQL"
              className="mt-2 w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
            />
          </label>
          <label className="block font-medium">
            Bio
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="mt-2 w-full rounded border border-slate-300 bg-white p-3 text-slate-900 placeholder:text-slate-500"
            />
          </label>
          <button
            disabled={saving}
            className="rounded bg-blue-600 px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
        </form>
      )}
    </main>
  );
}
