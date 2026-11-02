import { z } from "zod";

export const evidenceStatusSchema = z.enum([
  "supported",
  "supported_with_limitations",
  "mixed",
  "insufficient",
]);

export const citationSchema = z.object({
  passageId: z.string().min(1),
  quote: z.string().trim().min(12),
});

export const claimSchema = z.object({
  text: z.string().min(1),
  kind: z.enum(["direct_evidence", "interpretation"]),
  citations: z.array(citationSchema).min(1),
});

const answerFields = {
  answer: z.string().min(1),
  status: evidenceStatusSchema,
  claims: z.array(claimSchema),
  limitations: z.array(z.string().min(1)).min(1),
};

function requireClaimsUnlessInsufficient(
  value: { status: z.infer<typeof evidenceStatusSchema>; claims: unknown[] },
  context: z.RefinementCtx,
) {
  if (value.status !== "insufficient" && value.claims.length === 0) {
    context.addIssue({
      code: "custom",
      path: ["claims"],
      message: "Supported answers require at least one cited claim",
    });
  }
}

export const groundedAnswerSchema = z.object({
  ...answerFields,
  model: z.string().min(1),
  mode: z.enum(["reviewed", "live"]),
}).superRefine(requireClaimsUnlessInsufficient);

export const modelAnswerSchema = z
  .object(answerFields)
  .superRefine(requireClaimsUnlessInsufficient);

export const answerRequestSchema = z.object({
  question: z.string().trim().min(12).max(600),
});

export const agentStageSchema = z.object({
  name: z.enum([
    "planning",
    "retrieval",
    "comparison",
    "drafting",
    "validation",
    "repair",
    "completed",
  ]),
  status: z.enum(["completed", "skipped", "failed"]),
  detail: z.string().min(1),
});

export const evidenceAgentRunSchema = z.object({
  answer: groundedAnswerSchema,
  stages: z.array(agentStageSchema).min(1),
  selectedPassageIds: z.array(z.string().min(1)),
  repaired: z.boolean(),
});

export type GroundedAnswer = z.infer<typeof groundedAnswerSchema>;
export type EvidenceAgentRun = z.infer<typeof evidenceAgentRunSchema>;
