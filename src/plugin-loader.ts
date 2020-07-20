import { readJson, exists } from "https://deno.land/std/fs/mod.ts";
import { IPluginConfig, IPlugin } from "./models.ts";
import { 
    Application, 
    Router,
    cyan,
    green,
    red,
} from "./deps.ts";

const PLUGIN_CONFIG = 'plugin.json';
const PLUGIN_ENTRY = 'plugin.ts';

const siteConfig = await readJson(`${Deno.cwd()}/site.json`);

async function loadPlugins(app: Application): Promise<void> {
    const pluginDirectory = `${Deno.cwd()}/plugins`

    // Get Folders that contain a `plugin.json` file
    const folders = new Array<string>(); 
    for await (const dirEntry of Deno.readDir(pluginDirectory)) {
        if (dirEntry.isDirectory && await exists(`${pluginDirectory}/${dirEntry.name}/${PLUGIN_CONFIG}`)) {
            folders.push(dirEntry.name);
        }
    }

    // Load Plugins
    for (const folder of folders) {
        const pluginRoot = `${pluginDirectory}/${folder}`;

        const pluginConfig = await readJson(`${pluginRoot}/${PLUGIN_CONFIG}`) as IPluginConfig;
        try {
            if (!pluginConfig.name) throw new Error(`Plugin in folder ${folder} does not have a name!`);
            if (!pluginConfig.version) throw new Error(`Plugin in folder ${folder} does not have a version!`);

            const plugin: IPlugin = await import(`file://${pluginRoot}/${PLUGIN_ENTRY}`);

            const router = new Router({
                prefix: pluginConfig.base
            });

            if (plugin.configureRouter) await plugin.configureRouter(router, pluginRoot);
            if (plugin.configureApplication) await plugin.configureApplication(app, pluginConfig);

            app.use(router.routes());
	        app.use(router.allowedMethods());

            console.log(`${cyan(`[${pluginConfig.name}]:`)} ${green('Successfully Loaded')}`);
        }
        catch (err) {
            
            console.error(`${cyan(`[${pluginConfig.name ?? folder}]:`)} ${red('ERROR - LOADING FAILED')}\n-- ERROR LOG --\n${err}`);
        }
    }
}


export default loadPlugins;