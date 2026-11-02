import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createAgentAnswerHandler } from "@/app/api/agent-answer/route";
import { reviewedAnswer } from "@/lib/evidence";
import { MissingModalConfigError } from "@/lib/modal";

function request(question = "What evidence does the corpus contain?") {
  return new Request("http://localhost/api/agent-answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}

const successfulRun = {
  answer: reviewedAnswer,
  stages: [
    { name: "completed" as const, status: "completed" as const, detail: "Verified answer returned." },
  ],
  selectedPassageIds: ["morgan-2017-rbind-fda-01"],
  repaired: false,
};

describe("agent answer API", () => {
  it("returns the workflow and grounded answer", async () => {
    const handler = createAgentAnswerHandler(async () => successfulRun);
    const response = await handler(request());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      answer: { status: "supported_with_limitations" },
      repaired: false,
    });
  });

  it("returns 503 when Modal is not configured", async () => {
    const handler = createAgentAnswerHandler(async () => {
      throw new MissingModalConfigError();
    });
    const response = await handler(request());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("not configured"),
    });
  });

  it("rejects invalid questions before running the agent", async () => {
    const run = vi.fn(async () => successfulRun);
    const handler = createAgentAnswerHandler(run);
    const response = await handler(request("short"));

    expect(response.status).toBe(400);
    expect(run).not.toHaveBeenCalled();
  });
});
