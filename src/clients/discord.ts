import { Client, Events, SlashCommandBuilder, Interaction, CommandInteraction, REST, Routes, InteractionType, ApplicationCommandType } from "discord.js";

export interface Command {
    info: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>;
}

export interface IClient extends Client {
    commands: Map<string, Command>;
    addCommand: (command: Command) => void;
    saveCommands: () => Promise<void>;
}

const client = new Client({
    intents: ["DirectMessages"],
}) as IClient;

const rest = new REST({ version: "10" });

client.commands = new Map<string, Command>();
client.addCommand = (command: Command) => {
    client.commands.set(command.info.name, command);
};
client.saveCommands = async () => {
    const commands = [];
    for (const [_, command] of client.commands.entries()) {
        commands.push(command.info.toJSON());
    }
    await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_APPLICATION_ID!, process.env.DISCORD_GUILD_ID!), {
        body: commands
    });
};

rest.setToken(process.env.DISCORD_TOKEN!);
client.login(process.env.DISCORD_TOKEN);
client.user?.setStatus("online");

client.on("interactionCreateHook", (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        interaction.reply({
            content: "Command does not exist",
            ephemeral: true
        });
        return;
    };

    command.execute(interaction);
});

export default client;
