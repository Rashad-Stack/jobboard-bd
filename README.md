# JobBoard BD

JobBoard BD is a full-stack job marketplace for Bangladesh. Job seekers can search and apply for jobs, maintain a skills profile, track application status, and receive AI-powered recommendations. Employers can publish jobs and manage their application pipeline.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS
- NextAuth Credentials with JWT sessions and bcrypt password hashing
- Prisma 7 with PostgreSQL/Supabase and the `@prisma/adapter-pg` driver
- Zod request validation
- OpenAI GPT-4o structured job matching
- Vitest unit tests
- Vercel deployment

## Local setup

```bash
cp .env.example .env
bun install
bunx --bun prisma migrate dev --name init
bun run dev
```

The app runs at `http://localhost:3000`.

For Windows PowerShell, copy the environment template manually:

```powershell
Copy-Item .env.example .env
```

Run verification:

```bash
bun run build
bunx vitest run
```

## Environment variables

`DATABASE_URL` should use the Supabase pooled connection for application traffic. Prisma migration configuration automatically switches that URL to the direct PostgreSQL port for migration locks.

Never commit `.env` or expose API keys in screenshots, issue comments, or chat. Rotate any credential that has been exposed.

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/jobs` | Public search and filters |
| `/jobs/[id]` | Job details and seeker application |
| `/auth/register` | Seeker/employer registration |
| `/auth/login` | Credentials login |
| `/dashboard` | Seeker application history |
| `/profile` | Skills and bio |
| `/ai-match` | AI-ranked open jobs |
| `/employer/jobs` | Employer jobs and application counts |
| `/employer/jobs/new` | Create a job |
| `/employer/jobs/[id]/applicants` | Review and update applications |

## Business rules

- Applications start as `PENDING`.
- Employers can move applications to `REVIEWED`, then `ACCEPTED` or `REJECTED`.
- A final status cannot be changed.
- A seeker cannot apply to a closed job or apply twice to the same job.
- Employers can only edit, delete, and manage applications for their own jobs.
- All mutation payloads are validated with Zod.

## AI matching

The seeker skills array and all open jobs are sent to GPT-4o. The response is validated before it reaches the UI and must contain `jobId`, `title`, a `0-100` score, and a reason. The feature is keyword-oriented and does not infer seniority or years of experience; it is limited to currently open jobs and requires an OpenAI API key.

## Demo preparation

Create one job-seeker account and one employer account through the registration page. The employer can post a job, while the seeker can add skills, apply, view the dashboard, and run AI matching. Keep production secrets in Vercel Environment Variables rather than in the repository.
