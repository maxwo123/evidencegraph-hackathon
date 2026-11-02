import "server-only";

import { z } from "zod";

import {
  evidencePassages,
  getPassageById,
  type EvidencePassage,
} from "@/lib/evidence";
import { parseGroundedModelAnswer } from "@/lib/grounding";
import {
  completeWithModal,
  type ModalCompletion,
} from "@/lib/modal";
import type { GroundedAnswer } from "@/lib/schemas";

const planSchema = z.object({
  answerability: z.enum(["answerable", "insufficient"]),
  evidenceNeeds: z.array(z.string().min(1)).min(1).max(6),
  passageIds: z.array(z.string().min(1)).max(6),
  comparisonRequired: z.boolean(),
});

export type AgentStageName =
  | "planning"
  | "retrieval"
  | "comparison"
  | "drafting"
  | "validation"
  | "repair"
  | "completed";

export type AgentStage = {
  name: AgentStageName;
  status: "completed" | "skipped" | "failed";
  detail: string;
};

export type EvidenceAgentRun = {
  answer: GroundedAnswer;
  stages: AgentStage[];
  selectedPassageIds: string[];
  repaired: boolean;
};

type CompleteModel = (input: string) => Promise<ModalCompletion>;

export class EvidenceAgentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EvidenceAgentError";
  }
}

function extractJson(text: string): unknown {
  return JSON.parse(
    text
      .trim()
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/, ""),
  );
}

function catalogForPlanning(): string {
  return evidencePassages
    .map(
      (passage) =>
        `[${passage.id}] ${passage.authors} (${passage.year}), ${passage.location}\n${passage.text}`,
    )
    .join("\n\n");
}

function buildPlanningPrompt(question: string): string {
  return `You are the evidence planner for a scientific research agent.

Decide whether the reviewed passage catalog can address the question and select only the passages needed. The Donlic passages update and overlap the earlier R-BIND corpus; they are not an independent validation dataset. Do not answer the scientific question yet.

Return JSON only:
{
  "answerability": "answerable | insufficient",
  "evidenceNeeds": ["short description of evidence needed"],
  "passageIds": ["exact reviewed passage ID"],
  "comparisonRequired": true
}

If the catalog contains no evidence about the requested target, population, assay, or outcome, return "insufficient" and an empty passageIds array. Never invent an ID.

Question:\n${question}

Reviewed catalog:\n${catalogForPlanning()}`;
}

function evidenceBundle(passages: EvidencePassage[]): string {
  return passages
    .map(
      (passage) =>
        `[${passage.id}]\nSource: ${passage.authors} (${passage.year}), ${passage.location}, DOI ${passage.doi}\nPassage: ${passage.text}`,
    )
    .join("\n\n");
}

function buildDraftPrompt(
  question: string,
  passages: EvidencePassage[],
  evidenceNeeds: string[],
): string {
  return `You are the drafting stage of an evidence-verification agent.

Answer using only the retrieved passages below. Draft atomic claims and attach contiguous exact quotations. The FDA set is a reference library, not a proven non-binder control. Morgan's complexity observation may be confounded by source-library complexity. Donlic adds molecules to an overlapping corpus, providing partial but non-independent replication. Attribute the reported MW and ASA shifts to reclassification, not every shifted parameter. Never claim prospective RNA-binding prediction.

The planner identified these evidence needs:\n- ${evidenceNeeds.join("\n- ")}

Return JSON only, with exactly this shape:
{
  "answer": "concise synthesis",
  "status": "supported | supported_with_limitations | mixed | insufficient",
  "claims": [{
    "text": "one atomic claim",
    "kind": "direct_evidence | interpretation",
    "citations": [{"passageId": "exact-passage-id", "quote": "contiguous exact quote"}]
  }],
  "limitations": ["specific limitation"]
}

If evidence is insufficient, use status "insufficient" with an empty claims array. Every non-insufficient claim needs a citation from the retrieved IDs.

Question:\n${question}

Retrieved evidence:\n${evidenceBundle(passages)}`;
}

function buildRepairPrompt(
  question: string,
  passages: EvidencePassage[],
  invalidOutput: string,
  validationError: string,
): string {
  return `Repair a rejected scientific answer. Return the same JSON answer shape only.

Validation failure: ${validationError}

Use only these retrieved passage IDs: ${passages.map((passage) => passage.id).join(", ")}.
Every quote must be a contiguous verbatim substring of its passage. Remove any claim that cannot be supported. If a valid answer cannot be produced, return status "insufficient", an empty claims array, and a clear limitation.

Question:\n${question}

Rejected output:\n${invalidOutput}

Retrieved evidence:\n${evidenceBundle(passages)}`;
}

function validateSelectedAnswer(
  text: string,
  model: string,
  selectedIds: Set<string>,
): GroundedAnswer {
  const answer = parseGroundedModelAnswer(text, model);

  for (const claim of answer.claims) {
    for (const citation of claim.citations) {
      if (!selectedIds.has(citation.passageId)) {
        throw new EvidenceAgentError(
          `Citation used an unselected passage: ${citation.passageId}`,
        );
      }
    }
  }

  return answer;
}

function abstention(model: string, reason: string): GroundedAnswer {
  return {
    answer:
      "The reviewed corpus does not contain enough verified evidence to answer this question.",
    status: "insufficient",
    claims: [],
    limitations: [reason],
    model,
    mode: "live",
  };
}

export async function runEvidenceAgent(
  question: string,
  complete: CompleteModel = completeWithModal,
): Promise<EvidenceAgentRun> {
  const stages: AgentStage[] = [];
  const planCompletion = await complete(buildPlanningPrompt(question));
  const plan = planSchema.parse(extractJson(planCompletion.text));
  stages.push({
    name: "planning",
    status: "completed",
    detail: `${plan.evidenceNeeds.length} evidence need${plan.evidenceNeeds.length === 1 ? "" : "s"} identified.`,
  });

  const passages = plan.passageIds.map((id) => {
    const passage = getPassageById(id);
    if (!passage) throw new EvidenceAgentError(`Planner selected unknown passage: ${id}`);
    return passage;
  });
  const selectedPassageIds = passages.map((passage) => passage.id);
  stages.push({
    name: "retrieval",
    status: "completed",
    detail: `${passages.length} reviewed passage${passages.length === 1 ? "" : "s"} retrieved.`,
  });

  if (plan.answerability === "insufficient" || passages.length === 0) {
    stages.push({ name: "comparison", status: "skipped", detail: "No supported comparison available." });
    stages.push({ name: "drafting", status: "skipped", detail: "Drafting skipped to prevent unsupported claims." });
    stages.push({ name: "validation", status: "completed", detail: "Abstention contains no unverifiable citations." });
    stages.push({ name: "completed", status: "completed", detail: "Insufficient evidence returned." });
    return {
      answer: abstention(planCompletion.model, "The evidence planner found no reviewed passages that address the requested evidence."),
      stages,
      selectedPassageIds,
      repaired: false,
    };
  }

  stages.push({
    name: "comparison",
    status: plan.comparisonRequired ? "completed" : "skipped",
    detail: plan.comparisonRequired
      ? "Dataset overlap and paper lineage constraints applied."
      : "A cross-paper comparison was not required.",
  });

  const draftCompletion = await complete(
    buildDraftPrompt(question, passages, plan.evidenceNeeds),
  );
  stages.push({ name: "drafting", status: "completed", detail: "Atomic claims and exact quotations proposed." });
  const selectedIds = new Set(selectedPassageIds);

  try {
    const answer = validateSelectedAnswer(draftCompletion.text, draftCompletion.model, selectedIds);
    stages.push({ name: "validation", status: "completed", detail: "Schema, passage IDs, and exact quotations passed." });
    stages.push({ name: "repair", status: "skipped", detail: "No repair was needed." });
    stages.push({ name: "completed", status: "completed", detail: answer.status === "insufficient" ? "Insufficient evidence returned." : "Verified answer returned." });
    return { answer, stages, selectedPassageIds, repaired: false };
  } catch (error) {
    const validationError = error instanceof Error ? error.message : "Unknown validation failure";
    stages.push({ name: "validation", status: "failed", detail: "The first draft failed deterministic validation." });
    const repairCompletion = await complete(
      buildRepairPrompt(question, passages, draftCompletion.text, validationError),
    );

    try {
      const answer = validateSelectedAnswer(repairCompletion.text, repairCompletion.model, selectedIds);
      stages.push({ name: "repair", status: "completed", detail: "One bounded repair produced a valid answer." });
      stages.push({ name: "completed", status: "completed", detail: answer.status === "insufficient" ? "Insufficient evidence returned." : "Verified answer returned." });
      return { answer, stages, selectedPassageIds, repaired: true };
    } catch {
      stages.push({ name: "repair", status: "failed", detail: "The single allowed repair also failed validation." });
      stages.push({ name: "completed", status: "completed", detail: "The agent abstained instead of returning unverifiable claims." });
      return {
        answer: abstention(repairCompletion.model, "The model could not produce a mechanically verifiable answer after one repair attempt."),
        stages,
        selectedPassageIds,
        repaired: true,
      };
    }
  }
}
