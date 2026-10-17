"use client";

import JobForm from "@/app/components/JobForm";
import JobListSkeleton from "@/app/components/JobListSkeleton";
import PageHeader from "@/app/components/PageHeader";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";

type Job = {
  title: string;
  company: string;
  location: string;
  salary?: string | null;
  type: string;
  description: string;
  skills: string[];
};

export default function EditJobClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || "Unable to load job.");
        setJob(body.job);
      })
      .catch((reason: Error) => setError(reason.message));
  }, [id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
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
    if (!response.ok) setError(body.error || "Unable to update this job.");
    else router.push("/employer/jobs");
    setLoading(false);
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="Employer workspace"
        title="Edit job posting"
        description="Keep the role details accurate so candidates know what to expect."
      />
      {error && !job ? (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      ) : job ? (
        <JobForm
          loading={loading}
          error={error}
          onSubmit={submit}
          initialValues={job}
          submitLabel="Save changes"
        />
      ) : (
        <JobListSkeleton />
      )}
    </main>
  );
}
