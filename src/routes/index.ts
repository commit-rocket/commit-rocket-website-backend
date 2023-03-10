import Router from "koa-zod-router";
import discordRouter from "./discord";
import emailRouter from "./email";
import feedbackRouter from "./feedback";
import adminRouter from "./admin";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

router.get("/", (ctx) => {
    ctx.body = {
        status: "online"
    };
});

router.use("/discord", discordRouter.routes());
router.use("/email", emailRouter.routes());
router.use("/feedback", feedbackRouter.routes());
router.use("/admin", adminRouter.routes());

export default router;
