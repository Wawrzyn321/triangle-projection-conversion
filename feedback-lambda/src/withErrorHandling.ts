import { Result } from "./types";
import { ValidationError } from "./validation";

export async function withErrorHandling(
  callback: () => Promise<Result>,
): Promise<Result> {
  try {
    return await callback();
  } catch (error) {
    console.log(
      error,
      error instanceof Error,
      error instanceof ValidationError,
    );
    if (!(error instanceof Error)) {
      throw error;
    }

    const statusCode = error instanceof ValidationError ? 400 : 500;

    return {
      statusCode,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: { error },
    };
  }
}
