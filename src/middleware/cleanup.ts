import Koa, { DefaultContext } from "koa";
import { ZodContext } from "koa-zod-router";

export type CleanupFunction = (ctx: DefaultContext) => Promise<void | any>;

declare module "koa" {
    interface DefaultContext {
        /**
         * Adds a cleanup function that will be called once the next middleware is finished
         */
        addCleanup: (fn: CleanupFunction) => void;
    }
}

declare module "koa-zod-router" {
    interface ZodContext<Headers, Params, Query, Body, Files> extends DefaultContext {

    }
}


const cleanup = (): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any> => async (ctx, next) => {
    // A list that contains all the cleanup functions for the entire request context
    const cleanupList: CleanupFunction[] = [];

    ctx.addCleanup = (fn: CleanupFunction) => {
        cleanupList.push(fn);
    };

    const runCleanup = async (ctx: DefaultContext) => {
        await Promise.all(cleanupList.map((fn) => fn(ctx)));
    };

    await next();

    // Runs the cleanup functions without waiting for them to finish
    runCleanup(ctx);
};

export default cleanup;
