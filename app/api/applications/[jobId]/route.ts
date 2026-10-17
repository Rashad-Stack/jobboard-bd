import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const session = await getServerSession();
    const user = session?.user as { role?: string; id?: string } | undefined;
    if (!user || user.role !== "JOB_SEEKER" || !user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const jobId = params.jobId;
    const userId = user.id;

   
    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || job.status !== "OPEN") {
      return NextResponse.json({ error: "Job is closed or not found" }, { status: 400 });
    }

  
    const application = await prisma.application.create({
      data: {
        jobId,
        userId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ message: "Applied successfully", application }, { status: 201 });
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "You have already applied for this job." }, { status: 409 });
    }
    console.error("Apply error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}