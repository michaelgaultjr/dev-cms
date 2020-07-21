import { RouterContext, Router, RouterOptions, Context } from "./deps.ts";
import { ViewConfig, ViewEngine } from './interfaces.ts';

export interface ViewRouterOptions extends RouterOptions {
    viewEngine: ViewEngine;
}

export class ViewRouter extends Router {
    viewEngine: ViewEngine;

    constructor(opts: ViewRouterOptions) {
        super(opts);

        this.viewEngine = opts.viewEngine;
    }
}

// Create view engine system instead of hard coding denjucks
export async function View(ctx: RouterContext, templateName: string, data?: any) {
    const router = ctx.router as ViewRouter;
    const template = await getTemplate(templateName, router.viewEngine.config ?? {});

    ctx.response.body = await router.viewEngine.render(template, data);
    ctx.response.headers.set('Content-Type', 'text/html');

    ctx.response.status = 200;
}

// Implement Caching
async function getTemplate(template: string, config: ViewConfig): Promise<string> {
    const templatePath = `${config.root ?? Deno.cwd()}/${template}${config.ext ?? ''}`;

    return await Deno.readTextFile(templatePath);
}