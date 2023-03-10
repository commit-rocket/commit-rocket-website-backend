import { verifyKey, InteractionType as HookInteractionType, InteractionResponseType as HookInteractionResponseType } from "discord-interactions";
import {
    InteractionType,
    ApplicationCommandType,
    ComponentType,
    ChatInputCommandInteraction,
    UserContextMenuCommandInteraction,
    MessageContextMenuCommandInteraction,
    ButtonInteraction,
    StringSelectMenuInteraction,
    UserSelectMenuInteraction,
    RoleSelectMenuInteraction,
    MentionableSelectMenuInteraction,
    ChannelSelectMenuInteraction,
    AutocompleteInteraction,
    ModalSubmitInteraction,
    Interaction,
    Events,
    Partials
} from "discord.js";
import Router from "koa-zod-router";
import z from "zod";
import client from "../../clients/discord";
import db from "../../storage/db";

const router = Router({
    zodRouter: { exposeRequestErrors: true }
});

const getPayload = (data: any, manager: any, id: any, partialType: any, cache?: any) => {
    const existing = manager.cache.get(id);
    if (!existing && client.options.partials!.includes(partialType)) {
        return manager._add(data, cache);
    }
    return existing;
};

const getChannel = (data: any) => getPayload(
    {
        id: data.channel_id ?? data.id,
        guild_id: data.guild_id,
        recipients: [data.author ?? data.user ?? { id: data.user_id }],
    },
    client.channels,
    data.channel_id ?? data.id,
    Partials.Channel,
);

// https://backend.commitrocket.com/discord/interactions
router.post("/", async (ctx) => {

    const isValidRequest = verifyKey(
        ctx.request.rawBody,
        ctx.request.headers["x-signature-ed25519"],
        ctx.request.headers["x-signature-timestamp"],
        process.env.PUBLIC_KEY!
    );

    if (!isValidRequest) {
        ctx.status = 401;
        ctx.body = { error: "Bad request signature" };
        return;
    }

    const body = ctx.request.body!;

    const channel = getChannel(body);

    let InteractionClass;

    switch (body.type) {
        case HookInteractionType.PING: {
            ctx.body = { type: HookInteractionResponseType.PONG };
            return;
        }
        case InteractionType.ApplicationCommand: {
            switch (body.data?.type) {
                case ApplicationCommandType.ChatInput:
                    InteractionClass = ChatInputCommandInteraction;
                    break;
                case ApplicationCommandType.User:
                    InteractionClass = UserContextMenuCommandInteraction;
                    break;
                case ApplicationCommandType.Message:
                    if (channel && !channel.isTextBased()) return;
                    InteractionClass = MessageContextMenuCommandInteraction;
                    break;
                default:
                    client.emit(
                        Events.Debug,
                        `[INTERACTION] Received application command interaction with unknown type: ${body.data?.type}`,
                    );
                    return;
            }
            break;
        }
        case InteractionType.MessageComponent: {
            if (channel && !channel.isTextBased()) return;

            switch (body.data?.component_type) {
                case ComponentType.Button:
                    InteractionClass = ButtonInteraction;
                    break;
                case ComponentType.StringSelect:
                    InteractionClass = StringSelectMenuInteraction;
                    break;
                case ComponentType.UserSelect:
                    InteractionClass = UserSelectMenuInteraction;
                    break;
                case ComponentType.RoleSelect:
                    InteractionClass = RoleSelectMenuInteraction;
                    break;
                case ComponentType.MentionableSelect:
                    InteractionClass = MentionableSelectMenuInteraction;
                    break;
                case ComponentType.ChannelSelect:
                    InteractionClass = ChannelSelectMenuInteraction;
                    break;
                default:
                    client.emit(Events.Debug, `[INTERACTION] Received component interaction with unknown type: ${body.data?.component_type}`);
                    return;
            }
            break;
        }
        case InteractionType.ApplicationCommandAutocomplete: {
            InteractionClass = AutocompleteInteraction;
            break;
        }
        case InteractionType.ModalSubmit: {
            InteractionClass = ModalSubmitInteraction;
            break;
        }
        default: {
            client.emit(Events.Debug, `[INTERACTION] Received interaction with unknown type: ${body.type}`);
            return;
        }
    }

    // @ts-ignore
    const interaction: Interaction = new InteractionClass(client, data);
    console.log(interaction);

    /**
     * Emitted when an interaction is created.
     * @event Client#interactionCreate
     * @param {BaseInteraction} interaction The interaction which was created
     */
    client.emit(Events.InteractionCreate, interaction);
}, {
    headers: z.object({
        "x-signature-ed25519": z.string(),
        "x-signature-timestamp": z.string()
    }),
    body: z.object({
        type: z.nullable(z.nativeEnum(HookInteractionType).or(z.number())),
        data: z.nullable(z.object({
            type: z.number().int().nullable(),
            component_type: z.number().int().nullable()
        }))
    }).nullable()
});

export default router;
