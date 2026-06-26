import { spyOn } from "@vitest/spy";
import { handler } from "../handler";
import { AWSHttpEvent } from "../types";
import { ValidationError } from "../validation";

const BOUNDARY = "----WebKitFormBoundaryJp65dASctHypBYjt";

const putMock = vi.hoisted(() => vi.fn(() => {}));
vi.mock("@aws-sdk/client-dynamodb", () => ({
  DynamoDB: class {},
}));

vi.mock("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocument: {
    from: () => ({ put: putMock }),
  },
}));

function makeEvent(
  fields: Record<string, string>,
  overrides?: Partial<AWSHttpEvent>,
): AWSHttpEvent {
  const parts = Object.entries(fields).map(
    ([name, value]) =>
      `--${BOUNDARY}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}`,
  );
  const body = parts.join("\r\n") + `\r\n--${BOUNDARY}--`;

  return {
    body,
    headers: { "Content-Type": `multipart/form-data; boundary=${BOUNDARY}` },
    isBase64Encoded: false,
    requestContext: { http: { method: "POST", path: "/feedback" } },
    ...overrides,
  };
}

let devConsoleSpy: ReturnType<typeof spyOn>;

describe("handler", () => {
  beforeEach(() => {
    devConsoleSpy = spyOn(console, "log");
  });

  afterEach(() => {
    devConsoleSpy.mockRestore();
    putMock.mockReset();
  });

  it("returns success for valid vote, logs into console on devmode", async () => {
    const result = await handler(makeEvent({ vote: "formats" }), {
      devMode: true,
    });
    expect(result.statusCode).toBe(200);
    expect(result.headers).toEqual({
      "Access-Control-Allow-Origin": "http://localhost:5173",
    });
    expect(devConsoleSpy).toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();
  });

  it("does not log on devmode=false", async () => {
    const result = await handler(makeEvent({ vote: "formats" }), {
      devMode: false,
    });
    expect(result.statusCode).toBe(200);
    expect(devConsoleSpy).not.toHaveBeenCalled();
    expect(putMock).toHaveBeenCalledWith({
      Item: {
        feedbackType: "formats",
        id: expect.any(String),
      },
      TableName: "feedback",
    });
  });
  it("for validation error, returns 400", async () => {
    const result = await handler(makeEvent({ vote: "invalid" }), {
      devMode: true,
    });
    expect(result.statusCode).toBe(400);
    expect(result.body).toEqual({
      error: new ValidationError(`"vote" has invalid value`),
    });
    expect(devConsoleSpy).not.toHaveBeenCalled();
    expect(putMock).not.toHaveBeenCalled();
  });
});
