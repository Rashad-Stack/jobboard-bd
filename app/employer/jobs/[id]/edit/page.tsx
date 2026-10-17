import EditJobClient from "./EditJobClient";
import { Suspense } from "react";

export default function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={null}>
      <EditJobClient params={params} />
    </Suspense>
  );
}
