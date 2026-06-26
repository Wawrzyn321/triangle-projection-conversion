import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { AWSHttpEvent } from "./types";
import { validateBody, validateEvent } from "./validation";
import { Result } from "./types";
import { withErrorHandling } from "./withErrorHandling";
import { parseMultipart } from "./parseFormData";
import { v4 as uuidv4 } from "uuid";
import { CORS_HEADERS } from "./const";

const ddb = DynamoDBDocument.from(new DynamoDB());

type Options = {
  devMode: boolean;
};

export async function handler(
  event: AWSHttpEvent,
  { devMode }: Options = { devMode: false },
): Promise<Result> {
  return withErrorHandling(async () => {
    validateEvent(event);

    const { vote } = validateBody(await parseMultipart(event));

    const payload = {
      Item: { feedbackType: vote, id: uuidv4() },
      TableName: "feedback",
    };

    if (devMode) {
      console.log("[DEVMODE]: mocked PUT: ", payload);
    } else {
      await ddb.put(payload);
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
    };
  });
}
