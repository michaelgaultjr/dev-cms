import {
    Context, 
    send,
    path,
} from '../deps.ts';

const ALLOWED_TYPES: Record<string, boolean> = {
    '.css': true,
    '.js': true,
    '.png': true,
    '.svg': true,
    'yml': true,
}

// Very basic static file middleware, needs to be upgraded and secured
export default async (ctx: Context, next: any) => {
    if (ALLOWED_TYPES[path.parse(ctx.request.url.pathname).ext]) {
        await send(ctx, ctx.request.url.pathname, {
            root: `${Deno.cwd()}`
        });
    }
    else {
        await next();
    }
}