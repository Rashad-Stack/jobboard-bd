"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import JobForm from "@/app/components/JobForm";
import PageHeader from "@/app/components/PageHeader";

export default function NewJobPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        skills: String(formData.skills)
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      }),
    });
    const body = await response.json();
    if (!response.ok) setError(body.error || "Unable to publish this job.");
    else router.push("/employer/jobs");
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="Employer workspace"
        title="Post a new job"
        description="Give candidates the information they need to decide if this role is right for them."
      />
      <JobForm loading={loading} error={error} onSubmit={submit} submitLabel="Publish job" />
    </main>
  );
}
