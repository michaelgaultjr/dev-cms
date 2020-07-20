import { Application, Router } from "./deps.ts";

export class User {
    id: string;
    username: string;
    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
    }
}

export interface IPluginConfig {
    name: string;
    version: string;
    description?: string;
    base?: string;
    options?: any;
}

export interface IPlugin {
    configureApplication?: (app: Application, config: IPluginConfig) => Promise<void>;
    configureRouter?: (router: Router, root: string) => Promise<void>;
}