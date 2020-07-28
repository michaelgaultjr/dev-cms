import { PageStore, Page } from "../interfaces.ts";
import { path, yml, fs } from '../deps.ts';

// I don't like this implemenation, but it'll do for now
export default class YmlPageStore implements PageStore {
    root: string;
    pages: FileCache;

    constructor(root: string) {
        this.root = root;
        this.pages = new FileCache(root, {
            exts: [ '.yml', '.yaml', '' ],
            includeDirs: true,
        });
    }

    async get(route: string): Promise<Page | undefined> {
        const filePath = await this.pages.getPath(route);

        if (!filePath) return undefined;

        const ymlContent = await Deno.readTextFile(filePath);
        const page = yml.parse(ymlContent) as Page;
        
        return page;
    }

    async save(route: string, page: Page): Promise<void> {
        if (route == '/') route = '/index';

        const ymlContent = yml.stringify(page);
        Deno.writeTextFile(path.join(this.root, route),ymlContent);

        throw new Error('Not Implemented');
    }
}

interface CacheMap<TKey extends string | number | symbol, TValue> {
    expires?: number;
    map?: Record<TKey, TValue>;
}

class FileCache {
    root: string;
    options: fs.WalkOptions;

    fileCache: CacheMap<string, string>;

    constructor(root: string, options: fs.WalkOptions) {
        this.root = root;
        this.options = options;

        this.fileCache = {};
    }

    async getPath(route: string): Promise<string | undefined> {
        if (!this.fileCache.map || (this.fileCache.expires && this.fileCache.expires < Date.now())) {
            await this.cache();
        }
        if (!this.fileCache.map) return undefined;

        return this.fileCache.map[route != '/'
            ? route.replace(/\/$/, '')
            : route];
    }

    async cache() {
        const fileMap: Record<string, string> = {}

        for await (const entry of fs.walk(this.root, this.options)) {
            const entPath = path.parse(entry.path.substring(this.root.length));

            const route = path.join(entPath.dir, entPath.name).replaceAll('\\', '/');

            fileMap[route == '.' ? '/' : route] = entPath.ext == '' 
                ? path.join(entry.path, 'index.yml')
                : entry.path;

            this.fileCache = {
                expires: Date.now() + (5 * 60000), // Expires in 5 minutes
                map: fileMap
            };
        }
    }
}