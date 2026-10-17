export default function SkeletonCard() {
  return (
    <div
      className="w-full animate-pulse space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
      aria-label="Loading applications"
      aria-busy="true"
    >
      <div className="h-5 w-3/5 max-w-sm rounded bg-slate-200" />
      <div className="h-4 w-2/3 max-w-md rounded bg-slate-200" />
      <div className="mt-4 h-10 w-28 rounded-full bg-slate-200" />
    </div>
  );
}
