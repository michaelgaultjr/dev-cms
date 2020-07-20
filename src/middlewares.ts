import {
    Context, 

    send,
    readJson,

    green,
    cyan,
    bold
} from './deps.ts';

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

// Temporary for testing purposes
interface Page {
    content: string;
    type: 'markdown' | 'template';
}


const routes: Record<string, Page> = {
    '/test': {
        content: '### This is the /test page!\n*italic*',
        type: 'markdown'
    },
    '/words/are/cool': {
        content: '{{ header }}\n',
        type: 'template'
    }
}

const SITE_CONFIG = await readJson(`${Deno.cwd()}/site.json`);
const engine = new DenjucksEngine();

export const pageMiddleware = async (ctx: Context, next:any) => {
    const page: Page = routes[ctx.request.url.pathname]
    if (page) {
        const content: string = page.type === 'markdown' 
            ? Marked.parse(page.content)
            : await engine.render(page.content, { header: "Yes, yes they are!" })
        
        const template = ctx.app.state['theme'];

        ctx.response.status = 200;
        ctx.response.headers.set('Content-Type', 'text/html');
        ctx.response.body = await engine.render(template.default, { site: SITE_CONFIG, content });
        return;
    }

    await next();
}

// Temporary for testing purposes

export const staticFileMiddleware = async (ctx: Context, next: any) => {
    await send(ctx, ctx.request.url.pathname, {
        root: `${Deno.cwd()}`
    });

    await next();
}