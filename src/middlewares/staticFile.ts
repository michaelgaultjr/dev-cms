import {
    Context, 
    send,
    path
} from '../deps.ts';

const ALLOWED_TYPES = new Set<string>((Deno.env.get('ALLOWED-EXTENTSIONS') ?? '.css,.js,.png,.svg').trim().split(','));
const CACHE_DURATION = Deno.env.get('CACHE-DURATION') ?? '1800'; // The time (in seconds) to set the max-age property in the Cache-Control header

// Very basic static file middleware, needs to be upgraded and secured
export default async (ctx: Context, next: any) => {
    if (ALLOWED_TYPES.has(path.parse(ctx.request.url.pathname).ext)) {
        ctx.response.headers.set('Cache-Control', `max-age=${CACHE_DURATION}`);
        await send(ctx, ctx.request.url.pathname, {
            root: Deno.cwd()
        });
    }
    else {
        await next();
    }
}