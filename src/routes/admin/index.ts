import Router from "koa-zod-router";
import emailRouter from "./email";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

router.use("/email", emailRouter.routes());

export default router;
