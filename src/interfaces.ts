import { Application, Router } from "./deps.ts";

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

export interface ViewConfig {
    root?: string;
    ext?: string;
}

export interface ViewEngine {
    config?: ViewConfig;
    render: (template: string, data?: any) => Promise<string>
}