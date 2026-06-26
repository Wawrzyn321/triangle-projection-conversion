import { validateBody, validateEvent } from "../validation";

const mockEvent = {
  body: "",
  headers: {},
  isBase64Encoded: false,
  requestContext: {
    http: {
      method: "POST",
      path: "/feedback",
    },
  },
};

describe("validateEvent", () => {
  it("validates valid event", async () => {
    expect(() => validateEvent(mockEvent)).not.toThrow();
  });

  it("throws on invalid method", async () => {
    const invalidEvent = structuredClone(mockEvent);
    invalidEvent.requestContext.http.method = "GET";

    expect(() => validateEvent(invalidEvent)).toThrow("invalid path or method");
  });

  it("throws on invalid path", async () => {
    const invalidEvent = structuredClone(mockEvent);
    invalidEvent.requestContext.http.path = "/";

    expect(() => validateEvent(invalidEvent)).toThrow("invalid path or method");
  });
});

describe("validateBody", () => {
  it("returns body content on valid body", () => {
    const result = validateBody({ vote: "improve-algo" });
    expect(result).toEqual({ vote: "improve-algo" });
  });

  it("throws on non-object body", () => {
    expect(() => validateBody(2)).toThrow("Body is not an object");
  });

  it("throws on nullish body", () => {
    expect(() => validateBody(null)).toThrow("Body is not an object");
  });

  // anti-bot honeypot
  it('throws on "agreement" in body', () => {
    expect(() => validateBody({ agreement: true })).toThrow("Agreement failed");
  });

  it('throws on missing "vote" prop', () => {
    expect(() => validateBody({})).toThrow('"vote" is missing');
  });

  it('throws on invalid "vote" prop', () => {
    expect(() => validateBody({ vote: "custom" })).toThrow(
      '"vote" has invalid value',
    );
  });
});
