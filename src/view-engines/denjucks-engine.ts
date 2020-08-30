// @deno-types="https://raw.githubusercontent.com/thegamingninja/denjucks/master/mod.d.ts"
import denjucks from "https://raw.githubusercontent.com/thegamingninja/denjucks/master/mod.js";

import { ViewEngine, ViewConfig } from '../interfaces.ts';

export default class DenjucksViewEngine implements ViewEngine {
    config?: ViewConfig;

    constructor(config?: ViewConfig) {
        this.config = config;
    }

    async render(templateName: string, data?: any): Promise<string> {
        if (this.config && this.config.root) denjucks.configure(this.config.root);
        const template = await this.getTemplate(templateName, this.config ?? {});

        return denjucks.renderString(template, data);
    }

    // Implement Caching
    async getTemplate(template: string, config: ViewConfig): Promise<string> {
        const templatePath = `${config.root ?? Deno.cwd()}/${template}${config.ext ?? ''}`;

        return await Deno.readTextFile(templatePath);
    }
}