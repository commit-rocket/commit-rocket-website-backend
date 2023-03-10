import Router from "koa-zod-router";
import z from "zod";
import db from "../../storage/db";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

router.get("/subscribers", async (ctx) => {
    const mailingList = db.collection("mailing-list");
    const emails = (await mailingList.list()).results;

    ctx.body = {
        emails: emails.map((subscribe) => subscribe.key)
    };
}, {
    response: z.object({
        emails: z.array(z.string())
    })
});

export default router;
