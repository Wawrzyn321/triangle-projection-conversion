import { CORS_HEADERS } from "./const";
import { Result } from "./types";
import { ValidationError } from "./validation";

export async function withErrorHandling(
  callback: () => Promise<Result>,
): Promise<Result> {
  try {
    return await callback();
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }

    const statusCode = error instanceof ValidationError ? 400 : 500;

    return {
      statusCode,
      headers: CORS_HEADERS,
      body: { error },
    };
  }
}
