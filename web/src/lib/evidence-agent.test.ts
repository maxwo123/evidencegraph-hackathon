import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { runEvidenceAgent } from "@/lib/evidence-agent";

const model = "meta-models/Muse-Spark-Open-816B-A42B";
const plan = {
  answerability: "answerable",
  evidenceNeeds: ["Morgan molecular complexity comparison"],
  passageIds: ["morgan-2017-rbind-fda-01"],
  comparisonRequired: false,
};
const validAnswer = {
  answer: "Morgan reports lower molecular complexity with limitations.",
  status: "supported_with_limitations",
  claims: [
    {
      text: "R-BIND contained fewer sp3 carbons and stereocenters.",
      kind: "direct_evidence",
      citations: [
        {
          passageId: "morgan-2017-rbind-fda-01",
          quote:
            "R-BIND (SM) contained fewer sp3-hybridized carbons (Fsp3) and stereocenters (nStereo) compared to the FDA library.",
        },
      ],
    },
  ],
  limitations: ["The source-library complexity may confound the comparison."],
};

function completion(value: unknown) {
  return { text: JSON.stringify(value), model };
}

describe("runEvidenceAgent", () => {
  it("plans, retrieves, drafts, and validates a supported answer", async () => {
    const complete = vi
      .fn()
      .mockResolvedValueOnce(completion(plan))
      .mockResolvedValueOnce(completion(validAnswer));

    const run = await runEvidenceAgent(
      "What complexity difference did Morgan report?",
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(2);
    expect(run.answer.status).toBe("supported_with_limitations");
    expect(run.selectedPassageIds).toEqual(["morgan-2017-rbind-fda-01"]);
    expect(run.repaired).toBe(false);
    expect(run.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "validation", status: "completed" }),
        expect.objectContaining({ name: "repair", status: "skipped" }),
      ]),
    );
  });

  it("uses one repair after an altered quotation", async () => {
    const invalidAnswer = structuredClone(validAnswer);
    invalidAnswer.claims[0].citations[0].quote =
      "R-BIND contained more sp3 carbons and stereocenters than the FDA library.";
    const complete = vi
      .fn()
      .mockResolvedValueOnce(completion(plan))
      .mockResolvedValueOnce(completion(invalidAnswer))
      .mockResolvedValueOnce(completion(validAnswer));

    const run = await runEvidenceAgent(
      "What complexity difference did Morgan report?",
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(3);
    expect(run.repaired).toBe(true);
    expect(run.answer.claims).toHaveLength(1);
    expect(run.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "validation", status: "failed" }),
        expect.objectContaining({ name: "repair", status: "completed" }),
      ]),
    );
  });

  it("abstains without drafting when the planner finds no evidence", async () => {
    const complete = vi.fn().mockResolvedValueOnce(
      completion({
        answerability: "insufficient",
        evidenceNeeds: ["Human SARS-CoV-2 RNA-binding evidence"],
        passageIds: [],
        comparisonRequired: false,
      }),
    );

    const run = await runEvidenceAgent(
      "Which molecule binds SARS-CoV-2 RNA in humans?",
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(1);
    expect(run.answer.status).toBe("insufficient");
    expect(run.answer.claims).toEqual([]);
    expect(run.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "drafting", status: "skipped" }),
      ]),
    );
  });

  it("abstains when the single repair also fails", async () => {
    const invalidAnswer = structuredClone(validAnswer);
    invalidAnswer.claims[0].citations[0].passageId = "invented-passage";
    const complete = vi
      .fn()
      .mockResolvedValueOnce(completion(plan))
      .mockResolvedValueOnce(completion(invalidAnswer))
      .mockResolvedValueOnce(completion(invalidAnswer));

    const run = await runEvidenceAgent(
      "What complexity difference did Morgan report?",
      complete,
    );

    expect(complete).toHaveBeenCalledTimes(3);
    expect(run.answer.status).toBe("insufficient");
    expect(run.answer.claims).toEqual([]);
    expect(run.stages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "repair", status: "failed" }),
      ]),
    );
  });
});
