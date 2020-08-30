import { Application } from "../deps.ts";
import YmlPageStore from '../page-stores/yml-store.ts';

export async function loadPages(app: Application) { 
    // Create Custom Config class for static typing
    app.state['pageStore'] = new YmlPageStore('pages');
}