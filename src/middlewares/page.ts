import {
    Context, 
    readJson,
} from '../deps.ts';

import { Page, Pages } from '../db-models.ts';
import { Marked } from 'https://deno.land/x/markdown/mod.ts';

const SITE_CONFIG = await readJson(`${Deno.cwd()}/site.json`);

export default async (ctx: Context, next: any) => {
    const page = await getPage(ctx);
    if (page) {
        const theme = ctx.app.state['theme'];

        const content: string = page.type == 'markdown' 
            ? Marked.parse(page.content ?? '')
            : await theme.engine.render(page.content ?? '', {})

        ctx.response.body = await theme.engine.render(page.style, { site: SITE_CONFIG, page, content });
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
        page = await Pages.where('route', route).first()

        if (page) ctx.app.state['pages'][route] = page;
    }

    return page;
}