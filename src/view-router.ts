import { RouterContext, Router, RouterOptions } from "./deps.ts";
import { ViewEngine } from './interfaces.ts';

export interface ViewRouterOptions extends RouterOptions {
    viewEngine: ViewEngine;
}

/**
 * A small extention of `Router` class in the `Oak` library that adds a `viewEngine` property to the router to help with rendering views
 */
export class ViewRouter extends Router {
    viewEngine: ViewEngine;

    constructor(opts: ViewRouterOptions) {
        super(opts);

        this.viewEngine = opts.viewEngine;
    }
}

/**
 * Takes a RouterContext, and template name, and renders the template into HTML with the provided data if any, then responds to the request with the rendered HTML with a Status of `200`
 * @param ctx The RouterContext object provided by the request
 * @param templateName The filename of the template. Requires file name plus extention if the extention not defined in the view engine config
 * @param data The data to pass to the view engine for rendering. Not Required
 */
export async function View(ctx: RouterContext, templateName: string, data?: any) {
    const router = ctx.router as ViewRouter;

    ctx.response.body = await router.viewEngine.render(templateName, data);
    ctx.response.headers.set('Content-Type', 'text/html');

    ctx.response.status = 200;
}
