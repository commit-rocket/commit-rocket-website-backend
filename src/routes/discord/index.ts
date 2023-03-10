import Router from "koa-zod-router";
import interactionsRouter from "./interactions";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

router.use("/interactions", interactionsRouter.routes());

export default router;
