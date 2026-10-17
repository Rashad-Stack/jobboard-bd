import { openai } from "@/lib/openai";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || (session.user as { role?: string }).role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { skills } = await req.json();

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return NextResponse.json({ error: "Skills array is required" }, { status: 400 });
    }

    // Fetch all OPEN jobs from database[cite: 10]
    const openJobs = await prisma.job.findMany({
      where: { status: "OPEN" },
      select: { id: true, title: true, description: true, skills: true, company: true, location: true, salary: true, type: true },
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
        { role: "system", content: "You are a job matching assistant. Analyze the candidate's skills and rank the provided jobs by match quality." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"matches":[]}');

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("AI Match error:", error);
    return NextResponse.json({ error: "Failed to generate AI matches" }, { status: 500 });
  }
}