import Busboy from "busboy";
import { AWSHttpEvent } from "./types";

export async function parseMultipart(event: AWSHttpEvent) {
  return new Promise((resolve, reject) => {
    const fields: Record<string, string> = {};

    const busboy = Busboy({
      headers: {
        "content-type":
          event.headers["content-type"] || event.headers["Content-Type"],
      },
    });

    busboy.on("field", (name, value) => {
      fields[name] = value;
    });

    busboy.on("finish", () => {
      resolve(fields);
    });

    busboy.on("error", reject);

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body);

    busboy.end(body);
  });
}
