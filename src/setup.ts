import { config as configEnv } from "dotenv";

configEnv();
configEnv({ path: ".env.local", override: true });
