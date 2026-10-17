import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-user";
import { jobSchema } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, { params }: Context) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
    include: {
      employer: { select: { name: true, email: true } },
      _count: { select: { applications: true } },
    },
  });
  if (!job) return NextResponse.json({ error: "Job not found." }, { status: 404 });
  return NextResponse.json({ job });
}

export async function PATCH(req: Request, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Job not found." }, { status: 404 });
    if (!user || (user.role !== "ADMIN" && existing.employerId !== user.id)) {
      return NextResponse.json({ error: "You do not own this job." }, { status: 403 });
    }
    const result = jobSchema.partial().safeParse(await req.json());
    if (!result.success)
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    const job = await prisma.job.update({ where: { id }, data: result.data });
    return NextResponse.json({ job });
  } catch (error) {
    console.error("Update job error:", error);
    return NextResponse.json({ error: "Unable to update job." }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Context) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Job not found." }, { status: 404 });
    if (!user || (user.role !== "ADMIN" && existing.employerId !== user.id)) {
      return NextResponse.json({ error: "You do not own this job." }, { status: 403 });
    }
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: "Job deleted." });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Unable to delete job." }, { status: 500 });
  }
}
