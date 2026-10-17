import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-user";

export async function GET(_: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const user = await getCurrentUser();
  const job = await prisma.job.findUnique({ where: { id: jobId }, select: { employerId: true } });
  if (!user || !job || (user.role !== "ADMIN" && job.employerId !== user.id)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
  }
  const applications = await prisma.application.findMany({
    where: { jobId },
    include: { user: { select: { id: true, name: true, email: true, profile: true } } },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json({ applications });
}
