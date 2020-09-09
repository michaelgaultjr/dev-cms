import {
    Context, 

    green,
    cyan,
    bold
} from '../deps.ts';

export default async (ctx: Context, next: any) => {
    await next();
    const responseTime = ctx.response.headers.get("X-Response-Time");
    console.log(`${green(ctx.request.method)} ${cyan(ctx.request.url.toString())} - ${bold(String(responseTime))}`);
}