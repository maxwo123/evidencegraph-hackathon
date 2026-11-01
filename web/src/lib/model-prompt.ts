import { evidencePassages } from "@/lib/evidence";

export function buildEvidencePrompt(question: string): string {
  const evidence = evidencePassages
    .map(
      (passage) =>
        `[${passage.id}]\nSource: ${passage.authors} (${passage.year}), ${passage.location}, DOI ${passage.doi}\nPassage: ${passage.text}`,
    )
    .join("\n\n");

  return `You are an evidence-constrained scientific research assistant.

Answer the question using only the supplied passages. Separate what the paper directly supports from limitations or interpretation. Never describe the FDA reference collection as proven RNA non-binders. Never claim the study prospectively predicts RNA binding. If the passages do not support the question, set status to "insufficient" and say so.

When comparing the papers, preserve their dataset relationship: Donlic 2022 extends and reclassifies the related R-BIND corpus. Its added molecules provide partial but non-independent replication because the update overlaps the earlier corpus and uses related curation and analysis. Distinguish persistence across a database update from independent validation. Attribute the reported MW and ASA version shifts to reclassification, but do not generalize that explanation to every shifted parameter. Treat prioritization or enrichment as weaker than proof that an unseen molecule binds RNA or a particular RNA target.

Return JSON only, with exactly this shape:
{
  "answer": "concise synthesis",
  "status": "supported | supported_with_limitations | mixed | insufficient",
  "claims": [
    {
      "text": "one atomic claim",
      "kind": "direct_evidence | interpretation",
      "citations": [
        {"passageId": "exact-passage-id", "quote": "a contiguous exact quote copied from that passage"}
      ]
    }
  ],
  "limitations": ["one specific limitation"]
}

Use "direct_evidence" for a reported method, measurement, comparison, or result. Use "interpretation" for an author conclusion, proposed implication, or synthesis. If status is "insufficient", return an empty claims array and explain the missing evidence in answer and limitations.

Every citation quote must be a contiguous, verbatim substring of its cited passage. Do not paraphrase inside quote. A valid source ID and exact quote establish provenance, not semantic entailment, so attach only quotes that actually support the claim.

Question:
${question}

Allowed evidence:
${evidence}`;
}
