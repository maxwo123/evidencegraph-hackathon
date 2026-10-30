import { describe, expect, it } from "vitest";

import { getPassageById } from "@/lib/evidence";
import { parseGroundedModelAnswer } from "@/lib/grounding";
import { verifyCitationProvenance } from "@/lib/provenance";

const validCitation = {
  passageId: "morgan-2017-rbind-fda-01",
  quote:
    "R-BIND (SM) contained fewer sp3-hybridized carbons (Fsp3) and stereocenters (nStereo) compared to the FDA library.",
};

const validModelAnswer = {
  answer: "The paper reports a descriptive comparison with limitations.",
  status: "supported_with_limitations",
  claims: [
    {
      text: "The FDA comparison was molecular-weight restricted.",
      kind: "direct_evidence",
      citations: [validCitation],
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

describe("citation provenance", () => {
  it("accepts an exact quote from an approved passage", () => {
    const result = verifyCitationProvenance(validCitation);

    expect(result.provenance).toBe("valid");
    expect(result.semanticSupport).toBe("not_assessed");
  });

  it("rejects an altered scientific phrase", () => {
    expect(() =>
      verifyCitationProvenance({
        ...validCitation,
        quote:
          "R-BIND (SM) contained more sp3-hybridized carbons (Fsp3) and stereocenters (nStereo) compared to the FDA library.",
      }),
    ).toThrow("quote does not match passage");
  });

  it("does not mistake valid provenance for semantic support", () => {
    const unsupportedClaim = {
      text: "The cited molecules cure viral infections.",
      kind: "direct_evidence",
      citations: [validCitation],
    };

    const result = verifyCitationProvenance(unsupportedClaim.citations[0]);

    expect(result.provenance).toBe("valid");
    expect(result.semanticSupport).toBe("not_assessed");
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
          citations: [
            {
              passageId: "made-up-2026-01",
              quote: "This invented quote is long enough for the schema.",
            },
          ],
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
