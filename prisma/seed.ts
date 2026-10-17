import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppStatus, JobStatus, JobType, PrismaClient, Role } from "@prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
const demoPassword = "Password123!";

async function upsertUser(data: { email: string; name: string; role: Role }) {
  const password = await bcrypt.hash(demoPassword, 10);
  return prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.name, role: data.role, password },
    create: { ...data, password },
  });
}

async function upsertJob(data: {
  title: string;
  description: string;
  company: string;
  location: string;
  type: JobType;
  salary: string;
  skills: string[];
  status: JobStatus;
  employerId: string;
}) {
  const existing = await prisma.job.findFirst({
    where: { title: data.title, employerId: data.employerId },
  });

  return existing
    ? prisma.job.update({ where: { id: existing.id }, data })
    : prisma.job.create({ data });
}

async function main() {
  const [employer, secondEmployer, seeker, secondSeeker] = await Promise.all([
    upsertUser({
      email: "employer@jobboard.demo",
      name: "Nadia Rahman",
      role: Role.EMPLOYER,
    }),
    upsertUser({
      email: "hiring@techcorp.demo",
      name: "Arif Hasan",
      role: Role.EMPLOYER,
    }),
    upsertUser({
      email: "seeker@jobboard.demo",
      name: "Sadia Karim",
      role: Role.JOB_SEEKER,
    }),
    upsertUser({
      email: "candidate@jobboard.demo",
      name: "Tanvir Ahmed",
      role: Role.JOB_SEEKER,
    }),
  ]);

  await Promise.all([
    prisma.profile.upsert({
      where: { userId: seeker.id },
      update: {
        bio: "Frontend developer focused on accessible, high-quality web experiences.",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      },
      create: {
        userId: seeker.id,
        bio: "Frontend developer focused on accessible, high-quality web experiences.",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      },
    }),
    prisma.profile.upsert({
      where: { userId: secondSeeker.id },
      update: {
        bio: "Backend engineer who enjoys building reliable APIs and data systems.",
        skills: ["Node.js", "PostgreSQL", "Prisma", "Docker"],
      },
      create: {
        userId: secondSeeker.id,
        bio: "Backend engineer who enjoys building reliable APIs and data systems.",
        skills: ["Node.js", "PostgreSQL", "Prisma", "Docker"],
      },
    }),
  ]);

  const [frontendJob, backendJob, productJob] = await Promise.all([
    upsertJob({
      title: "Frontend Developer",
      description:
        "Build polished, accessible product experiences with our design and engineering teams.",
      company: "JobBoard BD",
      location: "Dhaka, Bangladesh",
      type: JobType.FULL_TIME,
      salary: "৳60,000 - ৳90,000/month",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
      status: JobStatus.OPEN,
      employerId: employer.id,
    }),
    upsertJob({
      title: "Backend Engineer",
      description:
        "Design dependable services, APIs, and data workflows for a growing technology platform.",
      company: "TechCorp Bangladesh",
      location: "Remote",
      type: JobType.REMOTE,
      salary: "৳80,000 - ৳120,000/month",
      skills: ["Node.js", "PostgreSQL", "Prisma", "Docker"],
      status: JobStatus.OPEN,
      employerId: secondEmployer.id,
    }),
    upsertJob({
      title: "Product Designer",
      description:
        "Turn customer problems into clear, intuitive product flows and high-fidelity interfaces.",
      company: "JobBoard BD",
      location: "Dhaka, Bangladesh",
      type: JobType.CONTRACT,
      salary: "৳50,000 - ৳75,000/month",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
      status: JobStatus.CLOSED,
      employerId: employer.id,
    }),
  ]);

  await Promise.all([
    prisma.application.upsert({
      where: { jobId_userId: { jobId: frontendJob.id, userId: seeker.id } },
      update: { status: AppStatus.REVIEWED },
      create: {
        jobId: frontendJob.id,
        userId: seeker.id,
        status: AppStatus.REVIEWED,
      },
    }),
    prisma.application.upsert({
      where: { jobId_userId: { jobId: backendJob.id, userId: secondSeeker.id } },
      update: { status: AppStatus.PENDING },
      create: {
        jobId: backendJob.id,
        userId: secondSeeker.id,
        status: AppStatus.PENDING,
      },
    }),
    prisma.application.upsert({
      where: { jobId_userId: { jobId: productJob.id, userId: secondSeeker.id } },
      update: { status: AppStatus.REJECTED },
      create: {
        jobId: productJob.id,
        userId: secondSeeker.id,
        status: AppStatus.REJECTED,
      },
    }),
  ]);

  console.log("Seed data created successfully.");
  console.log(`Demo password for all accounts: ${demoPassword}`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
