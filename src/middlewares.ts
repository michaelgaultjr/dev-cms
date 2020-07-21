import {
    Context, 

    send,
    readJson,

    green,
    cyan,
    bold
} from './deps.ts';

import { Page, PageDb } from './db-models.ts';
import { Marked } from 'https://deno.land/x/markdown/mod.ts';
import DenjucksEngine from './engines/denjucks-engine.ts';

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

const SITE_CONFIG = await readJson(`${Deno.cwd()}/site.json`);

export const pageMiddleware = async (ctx: Context, next:any) => {
    
    const page = await getPage(ctx);
    if (page) {
        const theme = ctx.app.state['theme'];
        const engine = new DenjucksEngine({
            root: theme.root
        });

        const content: string = page.type == 'markdown' 
            ? Marked.parse(page.content ?? '')
            : await engine.render(page.content ?? '', { header: "Yes, yes they are!" })

        const template = await Deno.readTextFile(`${theme.root}/${theme.default}`);

        ctx.response.body = await engine.render(template, { site: SITE_CONFIG, content });
        ctx.response.headers.set('Content-Type', 'text/html');
        ctx.response.status = 200;

        return;
    }

    await next();
}

async function getPage(ctx: Context): Promise<Page | undefined> {
    const route = ctx.request.url.pathname;

    let page: Page | undefined;
    if (ctx.app.state['pages']) page = ctx.app.state['pages'][route];
    
    if (!page) {
        page = await PageDb.where('route', route).first()

        if (page) ctx.app.state['pages'][route] = page;
    }

    return page;
}

// Temporary for testing purposes

export const staticFileMiddleware = async (ctx: Context, next: any) => {
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}`
    });

    await next();
}