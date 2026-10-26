import { z } from "zod";

export const evidenceStatusSchema = z.enum([
  "supported",
  "supported_with_limitations",
  "mixed",
  "insufficient",
]);

export const claimSchema = z.object({
  text: z.string().min(1),
  passageIds: z.array(z.string().min(1)).min(1),
});

export const groundedAnswerSchema = z.object({
  answer: z.string().min(1),
  status: evidenceStatusSchema,
  claims: z.array(claimSchema).min(1),
  limitations: z.array(z.string().min(1)).min(1),
  model: z.string().min(1),
  mode: z.enum(["reviewed", "live"]),
});

export const modelAnswerSchema = groundedAnswerSchema.omit({
  model: true,
  mode: true,
});

export const answerRequestSchema = z.object({
  question: z.string().trim().min(12).max(600),
});

export type GroundedAnswer = z.infer<typeof groundedAnswerSchema>;
