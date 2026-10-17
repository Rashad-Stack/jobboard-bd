import { describe, expect, it } from "vitest";
import { jobSchema } from "../lib/validation";

describe("Job validation", () => {
  it("accepts a complete job payload", () => {
    expect(jobSchema.safeParse({
      title: "Frontend Developer",
      description: "Build accessible, reliable interfaces for our customers.",
      company: "ABC Ltd",
      location: "Dhaka",
      type: "FULL_TIME",
      salary: "50000",
      skills: ["React", "TypeScript"],
    }).success).toBe(true);
  });

  it("rejects missing required job fields", () => {
    expect(jobSchema.safeParse({ title: "A" }).success).toBe(false);
  });
});
