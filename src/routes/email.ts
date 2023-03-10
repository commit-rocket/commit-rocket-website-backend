import Router from "koa-zod-router";
import { z } from "zod";
import db from "../storage/db";
import { sanitizeHtml } from "../utils/sanitize";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

interface EmailSubscriber {
    email: string;
}

const subscriptionSchema = z.object({
    email: z.string().email().min(3).transform(sanitizeHtml)
});

router.post("/subscribe", async (ctx) => {
    const body = ctx.request.body;
    const mailingList = db.collection("mailing-list");

    const newSubscriber: EmailSubscriber = {
        email: body.email
    };

    await mailingList.set(body.email, newSubscriber, {});

    ctx.body = {
        success: true
    };
}, {
    body: subscriptionSchema
});

router.delete("/unsubscribe", async (ctx) => {
    const body = ctx.request.body;
    const mailingList = db.collection("mailing-list");

    const deleted = await mailingList.delete(body.email);
    ctx.body = { success: deleted };
}, {
    body: subscriptionSchema
});

export default router;
