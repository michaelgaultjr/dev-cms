import { PluginConfig } from "../../src/interfaces.ts";
import { PageDb, Page } from '../../src/db-models.ts';
import { Application, RouterContext, ViewRouter, View } from "../../src/deps.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

// export function configureApplication(app: Application, config: PluginConfig) {
//     // Example Hello, Goodbye Middleware
//     app.use(async(ctx: Context, next: any) => {
//         console.log('Hello');
//         await next();
//         console.log('Goodbye!');
//     })
// }

export async function configureRouter(router: ViewRouter, root: string) {
    router
        .get('/', async (ctx: RouterContext) => await View(ctx, 'dashboard'))
        .get('/settings', async (ctx: RouterContext) => await View(ctx, 'settings'))
        .get('/pages', async (ctx: RouterContext) => {
            const query = ctx.request.url.searchParams.get('query'); // sanitize input

            const pages: Page[] = query 
                ? await PageDb.select('id', 'title', 'route').where('title', 'ilike', `%${query}%`).all()
                : await PageDb.select('id', 'title', 'route').all();

            await View(ctx, 'pages', { pages, query })
        })
        .get('/pages/edit/:id', async (ctx: RouterContext) => {
            const id = ctx.params.id;
            
            const page: Page = await PageDb.where('id', id).first();

            if (!id) {
                ctx.response.status = 404;
                return;
            }

            await View(ctx, 'edit_page', {
                page
            });
        })

    router
        .post('/pages', async (ctx: RouterContext) => {
            const body = await ctx.request.body();
            const { fields } = await body.value.read();

            let id = v4.generate();

            while (await PageDb.where('id', id).count() > 0) {
                id = v4.generate();
            }

            await PageDb.create({
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

            PageDb.where('id', id).update(fields);
            ctx.response.status = 200;

            ctx.response.redirect(ctx.request.url.pathname);
        });

    router
        .get('/pages/delete/:id', async (ctx: RouterContext) => {
            const id = ctx.params.id;

            if (!id) {
                ctx.response.status = 404;
                return;
            }

            await PageDb.where('id', id).delete();
            ctx.response.status = 200;

            ctx.response.redirect('/admin/pages');
        });
}