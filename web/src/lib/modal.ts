import "server-only";

import OpenAI from "openai";

import { parseGroundedModelAnswer } from "@/lib/grounding";
import { buildEvidencePrompt } from "@/lib/model-prompt";
import type { GroundedAnswer } from "@/lib/schemas";

export class MissingModalConfigError extends Error {
  constructor() {
    super("Modal endpoint configuration is incomplete");
    this.name = "MissingModalConfigError";
  }
}

export class InvalidModalModelResponseError extends Error {
  constructor() {
    super("Modal endpoint did not return a valid grounded answer after retrying");
    this.name = "InvalidModalModelResponseError";
  }
}

export async function askModalModel(question: string): Promise<GroundedAnswer> {
  const apiKey = process.env.MODAL_PROXY_TOKEN;
  const baseURL = process.env.MODAL_API_BASE_URL;
  const model = process.env.MODAL_MODEL;

  if (!apiKey || !baseURL || !model) {
    throw new MissingModalConfigError();
  }

  const client = new OpenAI({ apiKey, baseURL });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await client.responses.create({
      model,
      input: buildEvidencePrompt(question),
    });

    if (!response.output_text) {
      if (attempt === 1) throw new InvalidModalModelResponseError();
      continue;
    }

    try {
      return parseGroundedModelAnswer(response.output_text, model);
    } catch {
      if (attempt === 1) throw new InvalidModalModelResponseError();
    }
  }

  throw new InvalidModalModelResponseError();
}
