import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { createAnswerHandler } from "@/app/api/answer/route";
import { reviewedAnswer } from "@/lib/evidence";
import {
  InvalidMetaModelResponseError,
  MissingMetaApiKeyError,
} from "@/lib/meta";

function makeRequest(question = "What evidence does the corpus contain?") {
  return new Request("http://localhost/api/answer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
}

describe("answer API failure boundaries", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a successful grounded response", async () => {
    const handler = createAnswerHandler(async () => reviewedAnswer);
    const response = await handler(makeRequest());

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "supported_with_limitations",
    });
  });

  it("returns 503 when the server credential is absent", async () => {
    const handler = createAnswerHandler(async () => {
      throw new MissingMetaApiKeyError();
    });
    const response = await handler(makeRequest());

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("not configured"),
    });
  });

  it("returns a retryable 502 after unverifiable model output", async () => {
    const handler = createAnswerHandler(async () => {
      throw new InvalidMetaModelResponseError();
    });
    const response = await handler(makeRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("Try the question again"),
    });
  });

  it("contains an unexpected Meta service failure", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const handler = createAnswerHandler(async () => {
      throw new Error("simulated upstream outage");
    });
    const response = await handler(makeRequest());

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({
      error: "The grounded answer could not be generated. Please try again.",
    });
  });
});
