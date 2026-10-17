export default function JobListSkeleton() {
  return (
    <div className="mt-8 grid gap-4" aria-label="Loading job postings" aria-busy="true">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="w-full animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="h-5 w-3/5 max-w-md rounded bg-slate-200" />
          <div className="mt-3 h-4 w-2/3 max-w-sm rounded bg-slate-200" />
          <div className="mt-4 h-4 w-1/3 max-w-xs rounded bg-slate-200" />
          <div className="mt-5 h-10 w-40 rounded-lg bg-slate-200" />
        </div>
      ))}
    </div>
  );
}
