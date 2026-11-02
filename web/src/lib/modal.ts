import "server-only";

import OpenAI from "openai";

import { parseGroundedModelAnswer } from "@/lib/grounding";
import { buildEvidencePrompt } from "@/lib/model-prompt";
import type { GroundedAnswer } from "@/lib/schemas";

export type ModalCompletion = {
  text: string;
  model: string;
};

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

export async function completeWithModal(input: string): Promise<ModalCompletion> {
  const apiKey = process.env.MODAL_PROXY_TOKEN;
  const baseURL = process.env.MODAL_API_BASE_URL;
  const model = process.env.MODAL_MODEL;

  if (!apiKey || !baseURL || !model) {
    throw new MissingModalConfigError();
  }

  const client = new OpenAI({ apiKey, baseURL });
  const response = await client.responses.create({ model, input });

  if (!response.output_text) {
    throw new InvalidModalModelResponseError();
  }

  return { text: response.output_text, model };
}

export async function askModalModel(question: string): Promise<GroundedAnswer> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let completion: ModalCompletion;

    try {
      completion = await completeWithModal(buildEvidencePrompt(question));
      return parseGroundedModelAnswer(completion.text, completion.model);
    } catch (error) {
      if (error instanceof MissingModalConfigError) throw error;
      if (attempt === 1) throw new InvalidModalModelResponseError();
    }
  }

  throw new InvalidModalModelResponseError();
}
