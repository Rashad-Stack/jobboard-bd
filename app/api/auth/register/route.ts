import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72),
  role: z.enum(["JOB_SEEKER", "EMPLOYER"]).default("JOB_SEEKER"),
});

export async function POST(req: Request) {
  try {
    const result = schema.safeParse(await req.json());
    if (!result.success)
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    const data = result.data;
    const email = data.email.toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email,
        password: await bcrypt.hash(data.password, 12),
        role: data.role,
        profile: { create: { skills: [], bio: "" } },
      },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
