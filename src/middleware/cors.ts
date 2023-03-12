import koaCors from "@koa/cors";
import { Context } from "koa";

interface Options extends Omit<koaCors.Options, "origin"> {
    origin?: string[] | koaCors.Options["origin"];
}

const cors = (options: Options) => {
    const origin = Array.isArray(options.origin)
        ? (ctx: Context) => {
            const requestOrigin = ctx.request.header.origin ?? ctx.request.origin;
            return (options.origin as string[]).includes(requestOrigin) ? requestOrigin : "";
        }
        : options.origin;

    return koaCors({
        ...options,
        origin
    });
};

export default cors;
