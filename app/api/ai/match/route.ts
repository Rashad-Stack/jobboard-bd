import { openai } from "@/lib/openai";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = z
      .object({ skills: z.array(z.string().trim().min(1).max(40)).min(1).max(30) })
      .safeParse(await req.json());
    if (!input.success)
      return NextResponse.json({ error: "At least one valid skill is required." }, { status: 400 });
    const { skills } = input.data;

    const openJobs = await prisma.job.findMany({
      where: { status: "OPEN" },
      select: {
        id: true,
        title: true,
        description: true,
        skills: true,
        company: true,
        location: true,
        salary: true,
        type: true,
      },
    });

    if (openJobs.length === 0) {
      return NextResponse.json({ matches: [] }, { status: 200 });
    }

    const prompt = `Candidate Skills: ${JSON.stringify(skills)}
Available Jobs:
${JSON.stringify(openJobs)}
Return JSON only:
{"matches": [{"jobId": "...", "title": "...", "matchScore": 0-100, "reason": "..."}]}
Rank by matchScore descending.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a job matching assistant. Analyze the candidate's skills and rank the provided jobs by match quality.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    });

    const parsed = z
      .object({
        matches: z.array(
          z.object({
            jobId: z.string(),
            title: z.string(),
            matchScore: z.number().min(0).max(100),
            reason: z.string(),
          }),
        ),
      })
      .safeParse(JSON.parse(completion.choices[0].message.content || '{"matches":[]}'));
    if (!parsed.success)
      return NextResponse.json(
        { error: "The AI returned an invalid match response." },
        { status: 502 },
      );

    return NextResponse.json(parsed.data, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.code === "credit_balance_exhausted") {
        console.error("AI Match unavailable: OpenAI credits are exhausted.");
        return NextResponse.json(
          {
            error: "AI matching is temporarily unavailable because the AI service has no credits.",
          },
          { status: 503 },
        );
      }

      if (error.status === 429) {
        console.error("AI Match rate limited by OpenAI.");
        return NextResponse.json(
          { error: "AI matching is busy right now. Please try again in a moment." },
          { status: 429 },
        );
      }

      console.error("AI Match provider error:", error.status, error.code);
      return NextResponse.json(
        { error: "The AI matching service is temporarily unavailable." },
        { status: 502 },
      );
    }

    console.error("AI Match error:", error);
    return NextResponse.json({ error: "Failed to generate AI matches" }, { status: 500 });
  }
}
