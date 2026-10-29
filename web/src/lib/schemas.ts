import { z } from "zod";

export const evidenceStatusSchema = z.enum([
  "supported",
  "supported_with_limitations",
  "mixed",
  "insufficient",
]);

export const claimSchema = z.object({
  text: z.string().min(1),
  kind: z.enum(["direct_evidence", "interpretation"]),
  passageIds: z.array(z.string().min(1)).min(1),
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

export type GroundedAnswer = z.infer<typeof groundedAnswerSchema>;
