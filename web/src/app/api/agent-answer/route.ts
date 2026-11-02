import { ZodError } from "zod";

import {
  EvidenceAgentError,
  runEvidenceAgent,
} from "@/lib/evidence-agent";
import {
  InvalidModalModelResponseError,
  MissingModalConfigError,
} from "@/lib/modal";
import { answerRequestSchema } from "@/lib/schemas";

type AgentRunner = typeof runEvidenceAgent;

export function createAgentAnswerHandler(runAgent: AgentRunner = runEvidenceAgent) {
  return async function agentAnswerHandler(request: Request) {
    let question: string;

    try {
      question = answerRequestSchema.parse(await request.json()).question;
    } catch (error) {
      if (error instanceof ZodError || error instanceof SyntaxError) {
        return Response.json(
          { error: "Enter a question between 12 and 600 characters." },
          { status: 400 },
        );
      }
      throw error;
    }

    try {
      return Response.json(await runAgent(question));
    } catch (error) {
      if (error instanceof MissingModalConfigError) {
        return Response.json(
          {
            error:
              "The Modal agent is not configured. Add its server-only endpoint settings and restart the development server.",
          },
          { status: 503 },
        );
      }

      if (
        error instanceof InvalidModalModelResponseError ||
        error instanceof EvidenceAgentError ||
        error instanceof ZodError ||
        error instanceof SyntaxError
      ) {
        return Response.json(
          {
            error:
              "The evidence agent could not complete a valid workflow. The direct answer path is still available.",
          },
          { status: 502 },
        );
      }

      console.error("Evidence agent failed", error);
      return Response.json(
        { error: "The evidence agent is temporarily unavailable." },
        { status: 502 },
      );
    }
  };
}

export const POST = createAgentAnswerHandler();
