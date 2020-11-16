import {
    RouterContext,

    Page,

    ViewRouter,
    View
} from '../../src/api.ts';

import { PageEntry } from "../../src/interfaces.ts";
import { getQuery } from "https://deno.land/x/oak@v6.3.2/helpers.ts";

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

            let pageEntries = await ctx.app.state['pageStore'].getAll() as PageEntry[];

            if (query) {
                pageEntries = pageEntries.filter(entry => entry.page.title.toLowerCase().includes(query.toLowerCase()));
            }
 
            await View(ctx, 'pages', { pageEntries, query })
        })
        .get('/pages/edit', async (ctx: RouterContext) => {
            const params = getQuery(ctx);
            const route = params.route;

            if (!route) {
                ctx.response.status = 404;
                return;
            }

            const page: Page = await ctx.app.state['pageStore'].get(route);

            if (!page) {
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
            const body = ctx.request.body({ type: 'form-data'});
            const { fields } = await body.value.read();

            await ctx.app.state['pageStore'].save(fields.route, {
                title: fields.title,
                style: 'default',
                type: 'markdown'
            })

            ctx.response.redirect(ctx.request.url.toString());
        })
        .post('/pages/edit', async (ctx: RouterContext) => {
            const params = getQuery(ctx);
            const route = params.route;

            if (!route) {
                ctx.response.status = 404;
                return;
            }

            const body = ctx.request.body({ type: 'form-data'});
            const { fields } = await body.value.read();

            await ctx.app.state['pageStore'].save(route, {
                // Defaults can be set before importing the fields
                ...fields,
            })

            ctx.response.redirect(ctx.request.url.toString());
        });

    router
        .get('/pages/delete', async (ctx: RouterContext) => {
            const params = getQuery(ctx);
            const route = params.route;

            if (!route) {
                ctx.response.status = 404;
                return;
            }

            await ctx.app.state['pageStore'].delete(route);

            ctx.response.redirect('/admin/pages');
        });
}