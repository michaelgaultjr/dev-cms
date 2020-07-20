// @deno-types="https://deno.land/x/denjucks/mod.d.ts"
import denjucks from "https://deno.land/x/denjucks/mod.js"

import { ViewEngine, ViewConfig } from '../interfaces.ts';

export default class DenjucksEngine implements ViewEngine {
    config?: ViewConfig;

    constructor(config?: ViewConfig) {
        this.config = config;
    }

    async render(template: string, data?: any): Promise<string> {
        if (this.config && this.config.root) denjucks.configure(this.config.root);

        return denjucks.renderString(template, data);
    }
}