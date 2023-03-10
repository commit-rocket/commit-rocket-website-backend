import Router from "koa-zod-router";
import { v4 as generateUuidV4 } from "uuid";
import { z } from "zod";
import db from "../storage/db";
import { logToChannel } from "../storage/discord";
import { sanitizeHtml } from "../utils/sanitize";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

const feedbackPostSchema = z.object({
    text: z.string().transform(sanitizeHtml)
});

router.post("/", async (ctx) => {
    const body = ctx.request.body;

    await logToChannel(body.text, process.env.DISCORD_FEEDBACK_CHANNEL!);

    ctx.body = {
        success: true
    };
}, {
    body: feedbackPostSchema
});

export default router;
