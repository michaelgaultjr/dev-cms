import { PageStore, Page } from "../interfaces.ts";
import { Pages } from '../api.ts';

export default class DbPageStore implements PageStore {
    async get(route: string): Promise<Page> {
        const page = await Pages.where('route', route).first()

        return page;
    }

    async save(route: string, page: Page): Promise<void> {

    }
}