import OpenAI from "openai";

import { defaultQuestion } from "../src/lib/evidence";
import { parseGroundedModelAnswer } from "../src/lib/grounding";
import { buildEvidencePrompt } from "../src/lib/model-prompt";

const unsupportedQuestion =
  "Which of the reviewed molecules is proven to bind SARS-CoV-2 RNA in humans?";

type SpikeResult = {
  question: string;
  model: string;
  latencyMs: number;
  status: string;
  answer: string;
  claims: Array<{
    text: string;
    kind: string;
    citations: Array<{ passageId: string; quote: string }>;
  }>;
  limitations: string[];
  claimCount: number;
  citationCount: number;
  provenance: "passed";
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  } | null;
};

async function runQuestion(
  client: OpenAI,
  model: string,
  question: string,
): Promise<SpikeResult> {
  const startedAt = performance.now();
  const response = await client.responses.create({
    model,
    input: buildEvidencePrompt(question),
  });
  const latencyMs = Math.round(performance.now() - startedAt);

  if (!response.output_text) {
    throw new Error("Modal returned no output text");
  }

  const answer = parseGroundedModelAnswer(response.output_text, model);
  const citationCount = answer.claims.reduce(
    (count, claim) => count + claim.citations.length,
    0,
  );

  return {
    question,
    model,
    latencyMs,
    status: answer.status,
    answer: answer.answer,
    claims: answer.claims,
    limitations: answer.limitations,
    claimCount: answer.claims.length,
    citationCount,
    provenance: "passed",
    usage: response.usage
      ? {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          totalTokens: response.usage.total_tokens,
        }
      : null,
  };
}

async function main() {
  process.loadEnvFile(".env.local");

  const apiKey = process.env.MODAL_PROXY_TOKEN;
  const baseURL = process.env.MODAL_API_BASE_URL;
  const model = process.env.MODAL_MODEL;

  if (!apiKey || !baseURL || !model) {
    throw new Error(
      "Set MODAL_PROXY_TOKEN, MODAL_API_BASE_URL, and MODAL_MODEL in .env.local",
    );
  }

  const client = new OpenAI({ apiKey, baseURL });
  const results: SpikeResult[] = [];

  for (const question of [defaultQuestion, unsupportedQuestion]) {
    results.push(await runQuestion(client, model, question));
  }

  console.log(
    JSON.stringify({ provider: "Modal Shared Endpoint", results }, null, 2),
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Unknown spike error");
  process.exitCode = 1;
});
