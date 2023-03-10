import "./setup";

import Koa from "koa";
import router from "./routes";

import client from "./clients/discord";
import "./commands";

const app = new Koa();

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3000, async () => {
        // console.log("Saving commands");
        // await client.saveCommands();
        // console.log("Done saving commands");

        console.log("Server started on port 3000 (http://localhost:3000)");
    });
