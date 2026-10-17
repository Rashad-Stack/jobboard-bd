import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-user";

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== "JOB_SEEKER") return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  const applications = await prisma.application.findMany({
    where: { userId: user.id },
    include: { job: { select: { title: true, company: true, location: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ applications });
}
