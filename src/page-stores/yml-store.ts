import { PageStore, Page, Cache } from "../interfaces.ts";
import { path, yml, fs } from '../deps.ts';
import RecordCache from '../record-cache.ts';

async function readPage(path: string): Promise<Page | undefined> {
    try {
        const content = await Deno.readTextFile(path);
        return yml.parse(content) as Page;
    } 
    catch (e) {
        console.error(e);
        return undefined;
    }
}

const DEFAULT_OPTIONS = {
    exts: [ '.yml', '.yaml', '' ],
    includeDirs: true
}

export default class YmlPageStore implements PageStore {
    root: string;
    options: fs.WalkOptions;
    cache: Cache<string, string>;

    constructor(root: string, options?: fs.WalkOptions) {
        this.root = root;
        this.options = options ?? DEFAULT_OPTIONS;
        this.cache = new RecordCache<string, string>()
    }

    async get(route: string): Promise<Page | undefined> {
        const baseRoute = path.format(path.parse(path.join(this.root, route)))

        if (await this.cache.exists(baseRoute)) {
            return await readPage(await this.cache.get(baseRoute));
        }
        
        route = baseRoute;
        for await (const entry of fs.walk(this.root, this.options)) {
            const pathData = path.parse(entry.path);
            const pagePath = path.join(pathData.dir, pathData.base); // Path to page with extentsion
            const pageNamePath = pagePath.substr(0, pagePath.length - pathData.ext.length) // Path to page without extentsion

            if (route == pageNamePath && !entry.isDirectory) {
                this.cache.set(baseRoute, pagePath);
                return await readPage(pagePath);
            }
            else if (pageNamePath == route && entry.isDirectory) {
                route = path.join(route, 'index'); // Append 'index' to route if we know we're in a folder
            }
        }

        return undefined;
    }

    async save(route: string, page: Page): Promise<void> {
        throw new Error('Not Implemented');
    }
}
