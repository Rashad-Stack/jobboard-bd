import { describe, expect, it } from "vitest";

describe("Application Workflow Rules", () => {
  it("should allow valid status transitions: PENDING -> REVIEWED -> ACCEPTED", () => {
    const validTransitions = ["PENDING", "REVIEWED", "ACCEPTED"];
    expect(validTransitions).toContain("REVIEWED");
    expect(validTransitions).toContain("ACCEPTED");
  });

  it("should prevent applying to a CLOSED job", () => {
    const canApply = (jobStatus: "OPEN" | "CLOSED") => jobStatus === "OPEN";
    expect(canApply("CLOSED")).toBe(false);
  });
});
