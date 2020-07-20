import { PluginConfig, Plugin } from "./interfaces.ts";
import { 
    Application, 
    ViewRouter,

    exists,
    readJson,

    cyan,
    green,
    red,
} from "./deps.ts";
import DenjucksEngine from "./engines/denjucks-engine.ts";

const PLUGIN_CONFIG = 'plugin.json';
const PLUGIN_ENTRY = 'plugin.ts';

async function loadPlugins(app: Application): Promise<void> {
    const pluginDirectory = `${Deno.cwd()}/plugins`

    // Get Folders that contain a `plugin.json` file
    const folders = new Array<string>(); 
    for await (const dirEntry of Deno.readDir(pluginDirectory)) {
        if (dirEntry.isDirectory && await exists(`${pluginDirectory}/${dirEntry.name}/${PLUGIN_CONFIG}`)) {
            folders.push(dirEntry.name);
        }
    }

    // Try to load plugins
    for (const folder of folders) {
        const pluginRoot = `${pluginDirectory}/${folder}`;

        const pluginConfig = await readJson(`${pluginRoot}/${PLUGIN_CONFIG}`) as PluginConfig;
        try {
            // Confirm Plugin Config has required fields
            if (!pluginConfig.name) throw new Error(`Plugin in folder ${folder} does not have a name!`);
            if (!pluginConfig.version) throw new Error(`Plugin in folder ${folder} does not have a version!`);

            // Import `plugin.ts` as a `Plugin` Interface
            const plugin: Plugin = await import(`file://${pluginRoot}/${PLUGIN_ENTRY}`);

            const router = new ViewRouter({
                prefix: pluginConfig.base,
                viewEngine: new DenjucksEngine({
                    root: `${pluginRoot}/views`,
                    ext: '.njk',
                }),
            });

            // Check `plugin.ts` has methods and call them
            if (plugin.configureRouter) await plugin.configureRouter(router, pluginRoot);
            if (plugin.configureApplication) await plugin.configureApplication(app, pluginConfig);

            // Register router middleware
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