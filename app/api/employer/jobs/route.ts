import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-user";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !["EMPLOYER", "ADMIN"].includes(user.role))
    return NextResponse.json({ error: "Unauthorized." }, { status: 403 });

  const jobs = await prisma.job.findMany({
    where: user.role === "ADMIN" ? {} : { employerId: user.id },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });
  
  return NextResponse.json({ jobs });
}
