import {
    RouterContext,

    Pages,
    Page,

    ViewRouter,
    View
} from '../../src/api.ts';

import { v4 } from "https://deno.land/std/uuid/mod.ts";

// export function configureApplication(app: Application, config: PluginConfig) {
//     // Example Hello, Goodbye Middleware
//     app.use(async(ctx: Context, next: any) => {
//         console.log('Hello');
//         await next();
//         console.log('Goodbye!');
//     })
// }

export async function configureRouter(router: ViewRouter) {
    router
        .get('/', async (ctx: RouterContext) => await View(ctx, 'dashboard'))
        .get('/settings', async (ctx: RouterContext) => await View(ctx, 'settings'))
        .get('/pages', async (ctx: RouterContext) => {
            const query = ctx.request.url.searchParams.get('query');

            const pages: Page[] = query // Fix: ILIKE is PGSQL only, should be changed to work with other databases
                ? await Pages.select('id', 'title', 'route').where('title', 'ilike', `%${query}%`).orderBy('route').all()
                : await Pages.select('id', 'title', 'route').orderBy('route').all();

            await View(ctx, 'pages', { pages, query })
        })
        .get('/pages/edit/:id', async (ctx: RouterContext) => {
            const id = ctx.params.id;
            const page: Page = await Pages.where('id', id).first();

            if (!id) {
                ctx.response.status = 404;
                return;
            }

            await View(ctx, 'edit_page', {
                page,
                styles: [ 'default', 'landing' ],
                types: [ 'markdown', 'template' ]
            });
        })

    router
        .post('/pages', async (ctx: RouterContext) => {
            const body = await ctx.request.body();
            const { fields } = await body.value.read();

            let id = v4.generate();

            while (await Pages.where('id', id).count() > 0) {
                id = v4.generate();
            }

            await Pages.create({
                id,
                ...fields,
                style: 'default',
                type: 'markdown'
            });

            ctx.response.redirect(ctx.request.url.pathname);
        })
        .post('/pages/edit/:id', async (ctx: RouterContext) => {
            const id = ctx.params.id;

            if (!id) {
                ctx.response.status = 404;
                return;
            }

            const body = await ctx.request.body();
            const { fields } = await body.value.read();

            Pages.where('id', id).update(fields);

            ctx.app.state['pages'] = {};
            ctx.response.redirect(ctx.request.url.pathname);
        });

    router
        .get('/pages/delete/:id', async (ctx: RouterContext) => {
            const id = ctx.params.id;

            if (!id) {
                ctx.response.status = 404;
                return;
            }

            await Pages.where('id', id).delete();
            
            ctx.app.state['pages'] = {};
            ctx.response.redirect('/admin/pages');
        });
}