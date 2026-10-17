"use client";

import { FormEvent } from "react";

type JobFormProps = {
  loading: boolean;
  error: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export default function JobForm({ loading, error, onSubmit }: JobFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="font-medium text-slate-700">
          Job title
          <input
            name="title"
            placeholder="e.g. Frontend Developer"
            required
            className={`${inputClassName} mt-2`}
          />
        </label>
        <label className="font-medium text-slate-700">
          Company
          <input
            name="company"
            placeholder="Company name"
            required
            className={`${inputClassName} mt-2`}
          />
        </label>
        <label className="font-medium text-slate-700">
          Location
          <input
            name="location"
            placeholder="Dhaka, Bangladesh"
            required
            className={`${inputClassName} mt-2`}
          />
        </label>
        <label className="font-medium text-slate-700">
          Salary
          <input
            name="salary"
            placeholder="e.g. ৳50,000/month"
            className={`${inputClassName} mt-2`}
          />
        </label>
      </div>
      <label className="block font-medium text-slate-700">
        Employment type
        <select name="type" className={`${inputClassName} mt-2`}>
          <option value="FULL_TIME">Full time</option>
          <option value="PART_TIME">Part time</option>
          <option value="REMOTE">Remote</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </label>
      <label className="block font-medium text-slate-700">
        Description
        <textarea
          name="description"
          required
          minLength={20}
          rows={6}
          placeholder="Describe the role, responsibilities, and expectations."
          className={`${inputClassName} mt-2`}
        />
      </label>
      <label className="block font-medium text-slate-700">
        Skills
        <input
          name="skills"
          required
          placeholder="React, TypeScript, PostgreSQL"
          className={`${inputClassName} mt-2`}
        />
        <span className="mt-1 block text-xs font-normal text-slate-500">
          Separate skills with commas.
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        disabled={loading}
        className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish job"}
      </button>
    </form>
  );
}
