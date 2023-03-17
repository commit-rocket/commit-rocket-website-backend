import { config as configEnv } from "dotenv";
import z from "zod";

configEnv();
configEnv({ path: ".env.local", override: true });

const envSchema = z.object({
    // Database
    CYCLIC_DB: z.string(),

    // Discord Bot
    DISCORD_TOKEN: z.string(),
    DISCORD_PUBLIC_KEY: z.string(),

    DISCORD_GUILD_ID: z.string(),
    DISCORD_APPLICATION_ID: z.string(),
    DISCORD_FEEDBACK_CHANNEL: z.string(),
    DISCORD_MAIL_CHANNEL: z.string(),

    // AWS Credentials(Refreshes every hour)
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_SESSION_TOKEN: z.string()
});

envSchema.parse(process.env)
