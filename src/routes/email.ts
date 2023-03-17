import Router from "koa-zod-router";
import { z } from "zod";
import db from "../storage/db";
import { logToChannel } from "../storage/discord";
import { sanitizeHtml } from "../utils/sanitize";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

interface EmailSubscriber {
    email: string;
}

const subscriptionResponseSchema = z.object({
    success: z.boolean(),
    message: z.string()
});

const subscriptionSchema = z.object({
    email: z.string().email().min(3).toLowerCase().transform(sanitizeHtml)
});

const successResponse: z.infer<typeof subscriptionResponseSchema> = {
    success: true,
    message: "You successfully subscribed!"
};

router.post("/subscribe", async (ctx) => {
    const body = ctx.request.body;
    const mailingList = db.collection("mailing-list");

    const newSubscriber: EmailSubscriber = {
        email: body.email
    };

    if (await mailingList.get(body.email)) {
        ctx.body = successResponse;
        return;
    }
    await Promise.all([
        mailingList.set(body.email, newSubscriber, {}),
        logToChannel(body.email, process.env.DISCORD_MAIL_CHANNEL!)
    ]);

    ctx.body = successResponse;
}, {
    body: subscriptionSchema,
    response: subscriptionResponseSchema
});

router.post("/unsubscribe", async (ctx) => {
    const body = ctx.request.body;
    const mailingList = db.collection("mailing-list");

    const deleted = await mailingList.delete(body.email);

    ctx.body = {
        success: deleted,
        message: deleted
            ? "You successfully unsubscribed!"
            : "Something went wrong while unsubscribing. Please contact us!"
    };
}, {
    body: subscriptionSchema,
    response: subscriptionResponseSchema
});

export default router;
