import { describe, expect, it } from "vitest";

import { defaultQuestion } from "@/lib/evidence";
import { buildEvidencePrompt } from "@/lib/model-prompt";

describe("buildEvidencePrompt", () => {
  it("uses the reviewed question, evidence IDs, and abstention contract", () => {
    const prompt = buildEvidencePrompt(defaultQuestion);

    expect(prompt).toContain(defaultQuestion);
    expect(prompt).toContain("[morgan-2017-rbind-fda-01]");
    expect(prompt).toContain("[donlic-2022-rbind-fda-01]");
    expect(prompt).toContain('set status to "insufficient"');
    expect(prompt).toContain("contiguous, verbatim substring");
  });
});
