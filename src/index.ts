import "./setup";

import Koa from "koa";

import router from "./routes";
import poweredBy from "./middleware/poweredBy";
import cors from "./middleware/cors";

const app = new Koa();

app
    .use(poweredBy("rocket-fuel (koa)"))
    .use(router.allowedMethods())
    .use(cors({
        origin: ["https://www.commitrocket.com", "https://commitrocket.com", "http://localhost:3000"]
    }))
    .use(router.routes())
    .listen(3001, async () => console.log("Server started on port 3001 (http://localhost:3001)"));
