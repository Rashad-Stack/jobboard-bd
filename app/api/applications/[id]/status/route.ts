import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applicationStatusSchema } from "@/lib/validation";
import { getCurrentUser } from "@/lib/session-user";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    const result = applicationStatusSchema.safeParse(await req.json());
    if (!result.success)
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    const application = await prisma.application.findUnique({
      where: { id },
      include: { job: true },
    });
    if (!application)
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    if (!user || (user.role !== "ADMIN" && application.job.employerId !== user.id)) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 403 });
    }
    if (application.status === "ACCEPTED" || application.status === "REJECTED") {
      return NextResponse.json(
        { error: "Final application statuses cannot be changed." },
        { status: 409 },
      );
    }
    const updated = await prisma.application.update({
      where: { id },
      data: { status: result.data.status },
    });
    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("Update application error:", error);
    return NextResponse.json({ error: "Unable to update application." }, { status: 500 });
  }
}
