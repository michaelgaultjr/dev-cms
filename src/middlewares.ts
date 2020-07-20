import {
    Context, 
    send,

    green,
    cyan,
    bold
} from './deps.ts';

export const loggerMiddleware = async (ctx: Context, next: any) => {
    await next();
    const responseTime = ctx.response.headers.get("X-Response-Time");
    console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.pathname)} - ${bold(String(responseTime))}`);
}

export const responseTimeMiddleware = async (ctx: Context, next: any) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
}

// Temporary for testing purposes
const routes: Record<string, string> = {
    '/test': 'This is the /test page!',
    '/words/are/cool': 'Yes, yes they are.'
}

export const pageMiddleware = async (ctx: Context, next:any) => {
    const route: string = routes[ctx.request.url.pathname]
    if (route) {
        ctx.response.body = route;
        return;
    }

    await next();
}

export const staticFileMiddleware = async (ctx: Context, next: any) => {
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}`
    });

    await next();
}