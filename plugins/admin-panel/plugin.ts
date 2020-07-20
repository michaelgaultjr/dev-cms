import { IPluginConfig } from "../../src/models.ts";
import { Router, Application, Context } from "../../src/deps.ts";

export function configureApplication(app: Application, config: IPluginConfig) {
    // Example Hello, Goodbye Middleware
    // app.use(async(ctx: Context, next: any) => {
    //     console.log('Hello');
    //     await next();
    //     console.log('Goodbye!');
    // })
}

// This way of configuring the router is terrible and will be changed soon, this is just temporary to help test
export async function configureRouter(router: Router, root: string) {
    router
        .get('/', (ctx: any) => {
            ctx.app.view = {
                viewRoot: `${root}/views`,
                viewExt: '.njk'
            }

            ctx.render('dashboard');
        })
        .get('/settings', (ctx: any) => {
            ctx.app.view = {
                viewRoot: `${root}/views`,
                viewExt: '.njk'
            }

            ctx.render('settings');
        })
        .get('/pages', (ctx: any) => {
            ctx.app.view = {
                viewRoot: `${root}/views`,
                viewExt: '.njk'
            }

            ctx.render('pages', {
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
        .get('/pages/edit/:id', (ctx: any) => {
            ctx.app.view = {
                viewRoot: `${root}/views`,
                viewExt: '.njk'
            }

            const pages: Record<string, any> = {
                "1938": {
                    id: '1938',
                    title: "Home",
                    content: "Welcome to the home page!"
                }
            }

            const id = ctx.params.id;

            ctx.render('edit_page', {
                page: pages[id]
            });
        })

    router
        .post('/pages/edit/:id', async (ctx: any) => {
            const id = ctx.params.id;

            const body = await ctx.request.body({ type: 'form-data '});
            const { fields: { title, content } } = await body.value.read();
            console.log(title, content);
            ctx.response.redirect("/admin/pages/edit/" + id);
        });
}