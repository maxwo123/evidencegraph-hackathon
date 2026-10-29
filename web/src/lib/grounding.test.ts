import { describe, expect, it } from "vitest";

import { getPassageById } from "@/lib/evidence";
import { parseGroundedModelAnswer } from "@/lib/grounding";

const validModelAnswer = {
  answer: "The paper reports a descriptive comparison with limitations.",
  status: "supported_with_limitations",
  claims: [
    {
      text: "The FDA comparison was molecular-weight restricted.",
      kind: "direct_evidence",
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

  it("resolves the reviewed Donlic evidence", () => {
    expect(getPassageById("donlic-2022-rbind-fda-01")?.year).toBe(2022);
    expect(getPassageById("donlic-2022-rbind-fda-01")?.location).toBe(
      "R-BIND (SM) 2.0 vs FDA",
    );
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
      claims: [
        {
          text: "Unsupported",
          kind: "direct_evidence",
          passageIds: ["made-up-2026-01"],
        },
      ],
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

  it("accepts an insufficient answer without invented claims", () => {
    const result = parseGroundedModelAnswer(
      JSON.stringify({
        answer: "The supplied passages do not address this question.",
        status: "insufficient",
        claims: [],
        limitations: ["No relevant evidence is present in the reviewed corpus."],
      }),
      "muse-spark-1.3",
    );

    expect(result.status).toBe("insufficient");
    expect(result.claims).toEqual([]);
  });
});
