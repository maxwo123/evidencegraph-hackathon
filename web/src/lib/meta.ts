import "server-only";

import OpenAI from "openai";

import { evidencePassages } from "@/lib/evidence";
import { parseGroundedModelAnswer } from "@/lib/grounding";
import type { GroundedAnswer } from "@/lib/schemas";

const defaultModel = "muse-spark-1.3";
const defaultBaseUrl = "https://api.meta.ai/v1";

function buildPrompt(question: string): string {
  const evidence = evidencePassages
    .map(
      (passage) =>
        `[${passage.id}]\nSource: ${passage.authors} (${passage.year}), p. ${passage.page}, DOI ${passage.doi}\nPassage: ${passage.text}`,
    )
    .join("\n\n");

  return `You are an evidence-constrained scientific research assistant.

Answer the question using only the supplied passages. Separate what the paper directly supports from limitations or interpretation. Never describe the FDA reference collection as proven RNA non-binders. Never claim the study prospectively predicts RNA binding. If the passages do not support the question, set status to "insufficient" and say so.

When comparing the papers, preserve their dataset relationship: Donlic 2022 extends and reclassifies the related R-BIND corpus rather than independently replicating Morgan 2017. Distinguish persistence across a database update from independent validation. Treat prioritization or enrichment as weaker than proof that an unseen molecule binds RNA or a particular RNA target.

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

export class MissingMetaApiKeyError extends Error {
  constructor() {
    super("MODEL_API_KEY is not configured");
    this.name = "MissingMetaApiKeyError";
  }
}

export class InvalidMetaModelResponseError extends Error {
  constructor() {
    super("Meta Model API did not return a valid grounded answer after retrying");
    this.name = "InvalidMetaModelResponseError";
  }
}

export async function askMetaModel(question: string): Promise<GroundedAnswer> {
  const apiKey = process.env.MODEL_API_KEY;
  if (!apiKey) {
    throw new MissingMetaApiKeyError();
  }

  const model = process.env.META_MODEL ?? defaultModel;
  const client = new OpenAI({
    apiKey,
    baseURL: process.env.META_API_BASE_URL ?? defaultBaseUrl,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await client.responses.create({
      model,
      input: buildPrompt(question),
    });

    if (!response.output_text) {
      if (attempt === 1) throw new InvalidMetaModelResponseError();
      continue;
    }

    try {
      return parseGroundedModelAnswer(response.output_text, model);
    } catch {
      if (attempt === 1) throw new InvalidMetaModelResponseError();
    }
  }

  throw new InvalidMetaModelResponseError();
}
