import YmlFileStore from '../src/page-stores/yml-store.ts';
import { assert } from "https://deno.land/std@0.65.0/_util/assert.ts";
import { Page } from "../src/interfaces.ts";

const fileStore = new YmlFileStore('tests\\pages')

Deno.test({
    name: "Yaml File Store - Index Search",
    async fn() {
        const expected = 'tests\\pages\\index.yml';
        const route = await fileStore.findRoute('tests\\pages');

        assert(route == expected, `Route was ${route}. Expected ${expected}.`);
    } 
})

Deno.test({
    name: "Yaml File Store - Folder Search",
    async fn() {
        const expected = 'tests\\pages\\sub\\about.yaml';
        const route = await fileStore.findRoute('tests\\pages\\sub\\about');

        assert(route == expected, `Route was ${route}. Expected ${expected}.`);
        assert
    } 
})

Deno.test({
    name: "Yaml File Store - Read Page",
    async fn() {
        const expected: Page = {
            title: 'Home',
            style: 'landing',
            type: 'markdown',
            content: 'Test Content',
        }
        const content = await fileStore.readPage('tests\\pages\\index.yml')

        assert(JSON.stringify(content) == JSON.stringify(expected), `Content was '${JSON.stringify(content)}'. Expected ${JSON.stringify(expected)}`)
    }
})