import {
    Context, 
    send,
} from '../deps.ts';

// Very basic static file middleware, needs to be upgraded and secured
export default async (ctx: Context, next: any) => {
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}`
    });

    await next();
}