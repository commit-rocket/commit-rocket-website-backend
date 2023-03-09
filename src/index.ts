console.log("Hi");

import Koa from "koa";
import Router from "koa-zod-router";
import { z } from "zod";

const app = new Koa();
const router = Router();

router.get("/", (ctx) => {
    ctx.body = {
        status: "online"
    };
});

router.post("/post", (ctx) => {
    ctx.body = {
        request: ctx.request.body
    };
}, {
    body: z.record(z.string(), z.any()),
    response: z.object({
        request: z.any()
    })
});

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, () => console.log("Server started on port 3000 (http://localhost:3000)"));
