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

Return JSON only, with exactly this shape:
{
  "answer": "concise synthesis",
  "status": "supported | supported_with_limitations | mixed | insufficient",
  "claims": [
    {"text": "one atomic claim", "passageIds": ["exact-passage-id"]}
  ],
  "limitations": ["one specific limitation"]
}

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

  const response = await client.responses.create({
    model,
    input: buildPrompt(question),
  });

  if (!response.output_text) {
    throw new Error("Meta Model API returned no text output");
  }

  return parseGroundedModelAnswer(response.output_text, model);
}
