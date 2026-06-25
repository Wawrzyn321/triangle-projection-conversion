import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { AWSHttpEvent } from "./types";
import { validateBody, validateEvent } from "./validation";
import { Result } from "./types";
import { withErrorHandling } from "./withErrorHandling";
import { parseMultipart } from "./parseFormData";
import { v4 as uuidv4 } from "uuid";

const ddb = DynamoDBDocument.from(new DynamoDB());

export async function handler(event: AWSHttpEvent): Promise<Result> {
  return withErrorHandling(async () => {
    validateEvent(event);

    const { vote } = validateBody(await parseMultipart(event));

    await ddb.put({
      Item: { feedbackType: vote, id: uuidv4() },
      TableName: "feedback",
    });
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  });
}
