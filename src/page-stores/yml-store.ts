import { PageStore, Page, PageEntry, Cache } from "../interfaces.ts";
import { path, yml, fs } from '../deps.ts';
import RecordCache from '../record-cache.ts';
import { emptyDir } from "https://deno.land/std@0.67.0/fs/empty_dir.ts";

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

    async findPath(route: string): Promise<string | undefined> {
        for await (const entry of fs.walk(this.root, this.options)) {
            const pathData = path.parse(entry.path);
            const pagePath = path.join(pathData.dir, pathData.base); // Path to page with extentsion
            const pageNamePath = pagePath.substr(0, pagePath.length - pathData.ext.length) // Path to page without extentsion

            if (route == pageNamePath) {
                if (entry.isDirectory) {
                    route = path.join(route, 'index');
                }
                else {
                    return pagePath;
                }
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

    async getAll(): Promise<PageEntry[]> {
        const pages = new Array<PageEntry>();
        for await (const entry of fs.walk(this.root, this.options)) {
            const pathData = path.parse(entry.path);
            const pagePath = path.join(pathData.dir, pathData.base); // Path to page with extentsion
            const pageNamePath = pagePath.substr(0, pagePath.length - pathData.ext.length) // Path to page without extentsion

            if (!entry.isDirectory) {
                const page = await this.getPage(pagePath);
                if (!page) continue;

                pages.push({ 
                    route: pageNamePath.substring(this.root.length + 1).replace('\\', '/'),
                    page: page
                });
            }
        }
        return pages;
    }

    async get(route: string): Promise<Page | undefined> {
        const baseRoute = path.format(path.parse(path.join(this.root, route)))

        if (await this.routeCache.exists(baseRoute)) {
            return await this.getPage(await this.routeCache.get(baseRoute));
        }

        const pagePath = await this.findPath(baseRoute);
        if (pagePath) {
            this.routeCache.set(baseRoute, pagePath);
            return await this.getPage(pagePath);
        }
        
        return undefined;
    }

    async save(route: string, page: Page): Promise<void> {
        const formattedRoute = path.format(path.parse(path.join(this.root, route)));
        let filePath = await this.findPath(formattedRoute);

        if (!filePath) filePath = `${formattedRoute}.yml`;
        const pageYml = yml.stringify(page as any);
        Deno.writeTextFile(filePath, pageYml);

        // Clear Caches to avoid any issues
        this.pageCache.clear();
        this.routeCache.clear();
    }

    async delete(route: string) {
        const formattedRoute = path.format(path.parse(path.join(this.root, route)));
        const filePath = await this.findPath(formattedRoute);

        if (!filePath || !fs.exists(filePath)) return;
        // Do some security checks to make sure file is in not escaping root path
        Deno.remove(filePath);

        // Clear Caches to avoid any issues
        this.pageCache.clear();
        this.routeCache.clear();
    }
}
