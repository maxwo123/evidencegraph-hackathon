import { ZodError } from "zod";

import {
  askMetaModel,
  InvalidMetaModelResponseError,
  MissingMetaApiKeyError,
} from "@/lib/meta";
import { answerRequestSchema } from "@/lib/schemas";

type AnswerGenerator = typeof askMetaModel;

export function createAnswerHandler(generateAnswer: AnswerGenerator = askMetaModel) {
  return async function answerHandler(request: Request) {
    let question: string;

    try {
      const input = answerRequestSchema.parse(await request.json());
      question = input.question;
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
      const answer = await generateAnswer(question);
      return Response.json(answer);
    } catch (error) {
      if (error instanceof MissingMetaApiKeyError) {
        return Response.json(
          {
            error:
              "Meta Model API is not configured. Add MODEL_API_KEY to web/.env.local and restart the development server.",
          },
          { status: 503 },
        );
      }

      if (error instanceof InvalidMetaModelResponseError) {
        return Response.json(
          {
            error:
              "The model could not produce a verifiable answer after two attempts. Try the question again.",
          },
          { status: 502 },
        );
      }

      console.error("Answer generation failed", error);
      return Response.json(
        { error: "The grounded answer could not be generated. Please try again." },
        { status: 502 },
      );
    }
  };
}

export const POST = createAnswerHandler();
