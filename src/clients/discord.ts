import { Client } from "discord.js";

export interface IClient extends Client {
    /*
    * Waits for client to be ready, if it is already ready it will immidiately resolve
    */
    awaitReady: () => Promise<void>;
}

const client = new Client({
    intents: ["DirectMessages"],
}) as IClient;

client.login(process.env.DISCORD_TOKEN);
client.user?.setStatus("online");

client.awaitReady = async function () {
    const isReady = this.isReady();
    if (isReady) return;

    return new Promise((resolve) => {
        this.on("ready", () => resolve());
    });

};

export default client;
