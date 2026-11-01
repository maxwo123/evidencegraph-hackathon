import "server-only";

import OpenAI from "openai";

import { parseGroundedModelAnswer } from "@/lib/grounding";
import { buildEvidencePrompt } from "@/lib/model-prompt";
import type { GroundedAnswer } from "@/lib/schemas";

const defaultModel = "muse-spark-1.3";
const defaultBaseUrl = "https://api.meta.ai/v1";

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
      input: buildEvidencePrompt(question),
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
