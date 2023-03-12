import "./setup";

import Koa from "koa";

import router from "./routes";
import poweredBy from "./middleware/poweredBy";
import cors from "./middleware/cors";

// import "./commands";

const app = new Koa();

app
    .use(cors({
        allowMethods: ["GET", "POST", "DELETE"],
        origin: ["https://www.commitrocket.com", "https://commitrocket.com", "http://localhost:3000"]
    }))
    .use(poweredBy("rocket-fuel (koa)"))
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(3001, async () => console.log("Server started on port 3001 (http://localhost:3001)"));
