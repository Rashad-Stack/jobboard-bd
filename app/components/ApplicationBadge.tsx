export default function ApplicationBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    REVIEWED: "bg-blue-100 text-blue-800 border-blue-300",
    ACCEPTED: "bg-green-100 text-green-800 border-green-300",
    REJECTED: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}