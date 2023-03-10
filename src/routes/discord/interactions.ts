import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions";
// import { Interaction } from "discord.js";
import Router from "koa-zod-router";
import z from "zod";
import client from "../../clients/discord";
import db from "../../storage/db";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

// https://backend.commitrocket.com/discord/interactions
// router.post("/", async (ctx) => {

//     const isValidRequest = verifyKey(
//         ctx.request.rawBody,
//         ctx.request.headers["x-signature-ed25519"],
//         ctx.request.headers["x-signature-timestamp"],
//         process.env.PUBLIC_KEY!
//     );

//     if (!isValidRequest) {
//         ctx.status = 401;
//         ctx.body = { error: "Bad request signature" };
//         return;
//     }

//     switch (ctx.request.body.type) {
//         case InteractionType.PING: {
//             ctx.body = { type: InteractionResponseType.PONG };
//             return;
//         }
//         case InteractionType.APPLICATION_COMMAND: {

//             client.emit("interactionCreate",);
//             ctx.body = {};
//         }
//     }


//     ctx.body = {
//         emails: emails.map((subscribe) => subscribe.key)
//     };
// }, {
//     headers: z.object({
//         "x-signature-ed25519": z.string(),
//         "x-signature-timestamp": z.string()
//     }),
//     body: z.object({
//         type: z.nativeEnum(InteractionType).or(z.number())
//     })
// });

export default router;
