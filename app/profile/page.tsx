"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [skills, setSkills] = useState("");
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        const p = d.user?.profile;
        setSkills(p?.skills?.join(", ") || "");
        setBio(p?.bio || "");
        setMessage("");
      })
      .catch(() => setMessage("Unable to load profile."));
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    setMessage("Saving...");
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
    setMessage(res.ok ? "Profile saved successfully." : d.error);
  }
  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold">Your profile</h1>
      <form onSubmit={submit} className="mt-6 space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <label className="block font-medium">
          Skills
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, PostgreSQL"
            className="mt-2 w-full rounded border p-3"
          />
        </label>
        <label className="block font-medium">
          Bio
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="mt-2 w-full rounded border p-3"
          />
        </label>
        <button className="rounded bg-blue-600 px-5 py-3 font-semibold text-white">
          Save profile
        </button>
        {message && <p className="text-sm text-slate-600">{message}</p>}
      </form>
    </main>
  );
}
