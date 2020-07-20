import { PluginConfig } from "../../src/interfaces.ts";
import { Router, Application, RouterContext, View } from "../../src/deps.ts";

export function configureApplication(app: Application, config: PluginConfig) {
    // Example Hello, Goodbye Middleware
    // app.use(async(ctx: Context, next: any) => {
    //     console.log('Hello');
    //     await next();
    //     console.log('Goodbye!');
    // })
}

export async function configureRouter(router: Router, root: string) {
    router
        .get('/', async (ctx: RouterContext) => await View(ctx, 'dashboard'))
        .get('/settings', async (ctx: any) => await View(ctx, 'settings'))
        .get('/pages', async (ctx: any) => {
            await View(ctx, 'pages', {
                pages: [
                    {
                        id: '1938',
                        title: 'Home',
                        route: '/home' 
                    },
                    {
                        id: '3827',
                        title: 'About',
                        route: '/about' 
                    }
                ]
            })
        })
        .get('/pages/edit/:id', async (ctx: any) => {
            const pages: Record<string, any> = {
                "1938": {
                    id: '1938',
                    title: "Home",
                    content: "Welcome to the home page!"
                }
            }

            const id = ctx.params.id;

            await View(ctx, 'edit_page', {
                page: pages[id]
            });
        })

    router
        .post('/pages/edit/:id', async (ctx: any) => {
            const id = ctx.params.id;
            const body = await ctx.request.body({ type: 'form-data '});
            const { fields: { title, content } } = await body.value.read();
            console.log(id, title, content);
            ctx.response.status = 200;

            ctx.response.redirect(ctx.request.url.pathname);
        });
}