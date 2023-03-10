import "./setup";

import Koa from "koa";
import router from "./routes";

import "./commands";

const app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, async () => console.log("Server started on port 3000 (http://localhost:3000)"));
