import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import OpenAI from "openai";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const webDir = resolve(scriptDir, "..");
const repoDir = resolve(webDir, "..");

function loadLocalEnv() {
  const envPath = resolve(webDir, ".env.local");
  for (const rawLine of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const separator = line.indexOf("=");
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
    if (!(key in process.env)) process.env[key] = value;
  }
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function extractJson(value) {
  return JSON.parse(value.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, ""));
}

loadLocalEnv();

if (!process.env.MODEL_API_KEY) {
  throw new Error("MODEL_API_KEY is missing from web/.env.local");
}

const model = process.env.META_MODEL ?? "muse-spark-1.3";
const client = new OpenAI({
  apiKey: process.env.MODEL_API_KEY,
  baseURL: process.env.META_API_BASE_URL ?? "https://api.meta.ai/v1",
});

const question = "What molecular-property differences does each paper report?";
const morganPdf = resolve(repoDir, "local-papers/morgan-2017/morgan-2017.pdf");
const morganText = execFileSync("pdftotext", ["-layout", morganPdf, "-"], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});
const donlicText = readFileSync(
  resolve(repoDir, "local-papers/donlic-2022/donlic-2022-full-text.txt"),
  "utf8",
);
const morganRecords = readFileSync(
  resolve(repoDir, "local-papers/morgan-2017/passage-notes.md"),
  "utf8",
);
const donlicRecords = readFileSync(
  resolve(repoDir, "local-papers/donlic-2022/passage-notes.md"),
  "utf8",
);

const instruction = `Answer the scientific comparison using only the supplied evidence. Distinguish direct results from interpretation and limitations. Do not call FDA-approved drugs RNA non-binders. Do not claim prospective prediction for an unseen molecule. Return JSON only:
{
  "answer": "concise comparison",
  "claims": [{"text": "atomic claim", "evidenceRefs": ["source or passage ID"]}],
  "limitations": ["specific limitation"]
}`;

const approaches = [
  {
    id: "A",
    label: "extracted-paper-text",
    evidence: `[morgan-2017]\n${morganText}\n\n[donlic-2022]\n${donlicText}`,
  },
  {
    id: "B",
    label: "evidencegraph-records",
    evidence: `${morganRecords}\n\n${donlicRecords}`,
  },
];

const results = [];
for (const approach of approaches) {
  const startedAt = Date.now();
  const response = await client.responses.create({
    model,
    input: `${instruction}\n\nQuestion: ${question}\n\nEvidence:\n${approach.evidence}`,
  });
  if (!response.output_text) throw new Error(`Approach ${approach.id} returned no text`);
  results.push({
    approach: approach.id,
    label: approach.label,
    elapsedMs: Date.now() - startedAt,
    evidenceSha256: sha256(approach.evidence),
    output: extractJson(response.output_text),
  });
}

const record = {
  runAt: new Date().toISOString(),
  model,
  questionId: "Q1",
  question,
  note: "Reference answers were not included in either prompt.",
  results,
};

const outputPath = resolve(repoDir, "evaluation/two-paper/results/q1-first-run.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(record, null, 2)}\n`);
console.log(`Saved ${outputPath}`);
