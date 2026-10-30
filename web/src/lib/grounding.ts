import { verifyCitationProvenance } from "@/lib/provenance";
import { modelAnswerSchema, type GroundedAnswer } from "@/lib/schemas";

function extractJson(text: string): unknown {
  const withoutFence = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  return JSON.parse(withoutFence);
}

export function parseGroundedModelAnswer(
  text: string,
  model: string,
): GroundedAnswer {
  const parsed = modelAnswerSchema.parse(extractJson(text));

  for (const claim of parsed.claims) {
    for (const citation of claim.citations) {
      verifyCitationProvenance(citation);
    }
  }

  return { ...parsed, model, mode: "live" };
}
