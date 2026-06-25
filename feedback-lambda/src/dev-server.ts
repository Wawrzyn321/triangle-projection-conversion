import cors from "@koa/cors";
import Koa from "koa";
import KoaBodyparser from "koa-bodyparser";
import KoaRouter from "koa-router";
import { koaBody } from "koa-body";
import { handler } from "./handler";

const { PORT } = process.env;

const app = new Koa();

app.use(KoaBodyparser());
app.use(cors());
app.use(
  koaBody({
    multipart: true,
  }),
);

const router = new KoaRouter();

router.post("/feedback", async (ctx) => {
  const result = await handler({
    isBase64Encoded: false,
    requestContext: {
      http: {
        method: "POST",
        path: "/feedback",
      },
    },
    headers: {},
    body: JSON.stringify(ctx.request.body),
  });

  ctx.status = result.statusCode;
  ctx.body = result.body;
});

app.use(router.routes());

app.listen(PORT ?? 9010);
