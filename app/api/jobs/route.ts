import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session-user";
import { jobSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title")?.trim();
  const location = searchParams.get("location")?.trim();
  const type = searchParams.get("type");

  const jobs = await prisma.job.findMany({
    where: {
      status: "OPEN",
      ...(title
        ? { OR: [{ title: { contains: title, mode: "insensitive" } }, { skills: { has: title } }] }
        : {}),
      ...(location ? { location: { contains: location, mode: "insensitive" } } : {}),
      ...(type ? { type: type as "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" } : {}),
    },
    include: { _count: { select: { applications: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || !["EMPLOYER", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Employer access required." }, { status: 403 });
    }

    const result = jobSchema.safeParse(await req.json());

    if (!result.success)
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });

    const job = await prisma.job.create({ data: { ...result.data, employerId: user.id } });

    return NextResponse.json({ job }, { status: 201 });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Unable to create job." }, { status: 500 });
  }
}
