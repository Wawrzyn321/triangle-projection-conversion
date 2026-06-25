export type AWSHttpEvent = {
  isBase64Encoded: boolean;
  requestContext: {
    http: {
      method: string;
      path: string;
    };
  };
  headers: Record<string, string>;
  body: string;
};

export type Result = {
  headers: Record<string, string>;
  statusCode: number;
  body?: { error: Error };
};
