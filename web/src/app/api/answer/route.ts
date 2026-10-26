import { ZodError } from "zod";

import { askMetaModel, MissingMetaApiKeyError } from "@/lib/meta";
import { answerRequestSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const input = answerRequestSchema.parse(await request.json());
    const answer = await askMetaModel(input.question);
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

    if (error instanceof ZodError || error instanceof SyntaxError) {
      return Response.json(
        { error: "The question or model response did not match the required format." },
        { status: 400 },
      );
    }

    console.error("Answer generation failed", error);
    return Response.json(
      { error: "The grounded answer could not be generated. Please try again." },
      { status: 502 },
    );
  }
}
