import { AWSHttpEvent } from "./types";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function validateEvent(event: AWSHttpEvent) {
  const { method, path } = event.requestContext.http;

  if (method !== "POST" || path !== "/feedback") {
    throw new ValidationError("invalid path or method");
  }
}

export function validateBody(rawBody: unknown) {
  const validVotes = [
    "formats",
    "improve-algo",
    "multiple-projections",
    "paper-controls",
  ];

  if (typeof rawBody !== "object" || !rawBody) {
    throw new ValidationError("Body is not an object");
  }
  if ("agreement" in rawBody) {
    throw new ValidationError("Agreement failed");
  }
  if ("vote" in rawBody) {
    if (validVotes.includes(rawBody.vote as string)) {
      return { vote: rawBody.vote as string };
    }
    throw new ValidationError('"vote" has invalid value');
  }
  throw new ValidationError('"vote" is missing');
}
