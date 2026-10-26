import { describe, expect, it } from "vitest";

import { getPassageById } from "@/lib/evidence";
import { parseGroundedModelAnswer } from "@/lib/grounding";

const validModelAnswer = {
  answer: "The paper reports a descriptive comparison with limitations.",
  status: "supported_with_limitations",
  claims: [
    {
      text: "The FDA comparison was molecular-weight restricted.",
      passageIds: ["morgan-2017-rbind-fda-01"],
    },
  ],
  limitations: ["This does not establish prospective prediction."],
};

describe("evidence fixture", () => {
  it("resolves a reviewed source and rejects unknown IDs", () => {
    expect(getPassageById("morgan-2017-rbind-fda-01")?.page).toBe(4);
    expect(getPassageById("invented-source")).toBeUndefined();
  });
});

describe("parseGroundedModelAnswer", () => {
  it("accepts valid JSON, including a fenced response", () => {
    const result = parseGroundedModelAnswer(
      `\`\`\`json\n${JSON.stringify(validModelAnswer)}\n\`\`\``,
      "muse-spark-1.3",
    );

    expect(result.mode).toBe("live");
    expect(result.model).toBe("muse-spark-1.3");
  });

  it("rejects a citation that is not in the approved fixture", () => {
    const answer = {
      ...validModelAnswer,
      claims: [{ text: "Unsupported", passageIds: ["made-up-2026-01"] }],
    };

    expect(() =>
      parseGroundedModelAnswer(JSON.stringify(answer), "muse-spark-1.3"),
    ).toThrow("unknown passage ID");
  });

  it("rejects responses that omit required limitations", () => {
    const answer = {
      answer: validModelAnswer.answer,
      status: validModelAnswer.status,
      claims: validModelAnswer.claims,
    };

    expect(() =>
      parseGroundedModelAnswer(JSON.stringify(answer), "muse-spark-1.3"),
    ).toThrow();
  });
});
