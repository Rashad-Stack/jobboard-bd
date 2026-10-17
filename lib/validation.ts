import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().trim().min(3).max(100),
  description: z.string().trim().min(20).max(5000),
  company: z.string().trim().min(2).max(120),
  location: z.string().trim().min(2).max(120),
  type: z.enum(["FULL_TIME", "PART_TIME", "REMOTE", "CONTRACT"]),
  salary: z.string().trim().max(80).optional(),
  skills: z.array(z.string().trim().min(1).max(40)).min(1).max(20),
});

export const jobUpdateSchema = jobSchema.partial().extend({
  status: z.enum(["OPEN", "CLOSED"]).optional(),
});

export const profileSchema = z.object({
  skills: z.array(z.string().trim().min(1).max(40)).max(30),
  bio: z.string().trim().max(1000).optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["REVIEWED", "ACCEPTED", "REJECTED"]),
});
