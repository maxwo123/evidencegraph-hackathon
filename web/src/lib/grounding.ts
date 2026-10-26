import { getAllowedPassageIds } from "@/lib/evidence";
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
  const allowedIds = getAllowedPassageIds();

  for (const claim of parsed.claims) {
    for (const passageId of claim.passageIds) {
      if (!allowedIds.has(passageId)) {
        throw new Error(`Model returned an unknown passage ID: ${passageId}`);
      }
    }
  }

  return { ...parsed, model, mode: "live" };
}
