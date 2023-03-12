import Koa from "koa";

const poweredBy = (name: string): Koa.Middleware<Koa.DefaultState, Koa.DefaultContext, any> => async (ctx, next) => {
    ctx.set("x-powered-by", name);
    await next();
};

export default poweredBy;
