import Router from "koa-zod-router";
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

router.use("/email", emailRouter.routes());
router.use("/feedback", feedbackRouter.routes());

// NOTE: Admin routes are protected with Basic Auth via Cyclic.sh
router.use("/admin", adminRouter.routes());

export default router;
