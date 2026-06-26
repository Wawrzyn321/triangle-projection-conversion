import cors from "@koa/cors";
import Koa from "koa";
import KoaRouter from "koa-router";
import { handler } from "./handler";

const { PORT } = process.env;

const app = new Koa();

app.use(cors());

const router = new KoaRouter();

router.post("/feedback", async (ctx) => {
  const rawBody = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    ctx.req.on("data", (chunk) => chunks.push(chunk));
    ctx.req.on("end", () => resolve(Buffer.concat(chunks).toString()));
    ctx.req.on("error", reject);
  });

  const result = await handler(
    {
      isBase64Encoded: false,
      requestContext: {
        http: {
          method: "POST",
          path: "/feedback",
        },
      },
      headers: ctx.request.headers as Record<string, string>,
      body: rawBody,
    },
    { devMode: true },
  );

  ctx.status = result.statusCode;
  ctx.body = result.body;
});

app.use(router.routes());

app.listen(PORT ?? 9010);
