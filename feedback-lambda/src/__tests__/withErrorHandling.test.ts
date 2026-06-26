import { Result } from "../types";
import { ValidationError } from "../validation";
import { withErrorHandling } from "../withErrorHandling";

const mockResult: Result = {
  headers: {},
  statusCode: 204,
};

describe("withErrorHandling", () => {
  it("return original for no exceptions", async () => {
    const result = await withErrorHandling(() => Promise.resolve(mockResult));

    expect(result).toBe(mockResult);
  });

  it("return 400 for validation error", async () => {
    const result = await withErrorHandling(() => {
      throw new ValidationError("validation failed");
    });

    expect(result).toMatchObject({
      statusCode: 400,
      body: {
        error: new ValidationError("validation failed"),
      },
    });
  });

  it("return 500 for exception", async () => {
    const result = await withErrorHandling(() => {
      throw Error("error!");
    });

    expect(result).toMatchObject({
      statusCode: 500,
      body: {
        error: Error("error!"),
      },
    });
  });
});
