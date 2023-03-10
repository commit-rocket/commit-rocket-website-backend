import { SlashCommandBuilder, codeBlock } from "discord.js";
import client from "../clients/discord";
import db from "../storage/db";

client.addCommand({

    info: new SlashCommandBuilder()
        .setName("subscribers")
        .setDescription("Get all the mailing list subscribers"),

    execute: async (interaction) => {
        const mailingList = db.collection("mailing-list");
        const emails = (await mailingList.list()).results.map((subscriber) => subscriber.key);


        interaction.reply({
            content: `
            ${codeBlock("json", JSON.stringify(emails, undefined, 2))}
            `,
            ephemeral: true
        });
    }

});
