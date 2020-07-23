import { Application, Router } from "./deps.ts";

//#region Plugin Interfaces
export interface PluginConfig {
    name: string;
    version: string;
    description?: string;
    base?: string;
    options?: any;
}

export interface Plugin {
    configureApplication?: (app: Application, config: PluginConfig) => Promise<void>;
    configureRouter?: (router: Router, root: string) => Promise<void>;
}
//#endregion

//#region View Engine Interfaces
export interface ViewConfig {
    root?: string;
    ext?: string;
}

export interface ViewEngine {
    config?: ViewConfig;
    render: (templateName: string, data?: any) => Promise<string>
}
//#endregion

//#region Page Interfaces
type PageStyle = 'default' | 'landing';
type ContentType = 'markdown' | 'template';

export interface Page {
    title: string;
    style: PageStyle,
    type: ContentType;
    content?: string;
    published?: Date;
}

export interface PageStore {
    get: (route: string) => Promise<Page | undefined>;
    save: (route: string, page: Page) => Promise<void>;
}
//#endregion