import { PageStore, Page, Cache } from "../interfaces.ts";
import { path, yml, fs } from '../deps.ts';
import RecordCache from '../record-cache.ts';

const DEFAULT_OPTIONS = {
    exts: [ '.yml', '.yaml', '' ],
    includeDirs: true
}

export default class YmlPageStore implements PageStore {
    root: string;
    options: fs.WalkOptions;
    routeCache: Cache<string, string>;
    pageCache: Cache<string, Page | undefined>;

    constructor(root: string, options?: fs.WalkOptions) {
        this.root = root;
        this.options = options ?? DEFAULT_OPTIONS;
        this.routeCache = new RecordCache<string, string>();
        this.pageCache = new RecordCache<string, Page | undefined>(150000);
    }

    async findRoute(route: string): Promise<string | undefined> {
        for await (const entry of fs.walk(this.root, this.options)) {
            const pathData = path.parse(entry.path);
            const pagePath = path.join(pathData.dir, pathData.base); // Path to page with extentsion
            const pageNamePath = pagePath.substr(0, pagePath.length - pathData.ext.length) // Path to page without extentsion

            if (route == pageNamePath && !entry.isDirectory) {
                return pagePath;
            }
            else if (pageNamePath == route && entry.isDirectory) {
                route = path.join(route, 'index'); // Append 'index' to route if we know we're in a folder
            }
        }

        return undefined;
    }

    async getPage(path: string): Promise<Page | undefined> {

        if (await this.pageCache.exists(path)) {
            return this.pageCache.get(path);
        }

        try {
            const content = await Deno.readTextFile(path);
            const page = yml.parse(content) as Page;
            this.pageCache.set(path, page);
            return page;
        } 
        catch (e) {
            console.error(e);
            return undefined;
        }
    }

    async get(route: string): Promise<Page | undefined> {
        const baseRoute = path.format(path.parse(path.join(this.root, route)))

        if (await this.routeCache.exists(baseRoute)) {
            return await this.getPage(await this.routeCache.get(baseRoute));
        }

        const pagePath = await this.findRoute(baseRoute);
        if (pagePath) {
            this.routeCache.set(baseRoute, pagePath);
            return await this.getPage(pagePath);
        }
        
        return undefined;
    }

    async save(route: string, page: Page): Promise<void> {
        throw new Error('Not Implemented');
    }
}
