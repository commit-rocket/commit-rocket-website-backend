import { ChannelType } from "discord.js";
import client from "../clients/discord";

export const logToChannel = async (text: string, channelID: string) => {
    const channel = await client.channels.fetch(channelID, { cache: true });

    if (!channel)
        throw new Error("Channel doesn't exist");

    if (channel.type !== ChannelType.GuildText)
        throw new Error("Channel needs to be a Text-based channel");

    await channel.send({
        content: text,
    });
};
