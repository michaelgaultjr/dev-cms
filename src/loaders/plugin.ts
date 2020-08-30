import { PluginConfig, Plugin } from "../interfaces.ts";
import { 
    Application, 
    ViewRouter,

    fs,

    cyan,
    green,
    red,
} from "../deps.ts";
import DenjucksViewEngine from "../view-engines/denjucks-engine.ts";

const PLUGIN_CONFIG = 'plugin.json';
const PLUGIN_ENTRY = 'plugin.ts';

export async function loadPlugins(app: Application): Promise<void> {
    const pluginsRoot = `${Deno.cwd()}/plugins`

    if (!await fs.exists(pluginsRoot)) return;

    // Get folders in `plugins` that contain a `plugin.json` file
    for await (const pluginDirectory of Deno.readDir(pluginsRoot)) {
        // Check if the filer is a directory, and if it has a `plugin.json` file
        if (pluginDirectory.isDirectory && await fs.exists(`${pluginsRoot}/${pluginDirectory.name}/${PLUGIN_CONFIG}`)) {
            const pluginRoot = `${pluginsRoot}/${pluginDirectory.name}`;

            const pluginConfig = await fs.readJson(`${pluginRoot}/${PLUGIN_CONFIG}`) as PluginConfig;
            if ((pluginConfig.enabled ?? true) == false) {
                console.log(`${cyan(`[${pluginConfig.name}]`)} ${red('Plugin Disabled. Skipping.')}`);
                continue;
            }
            
            try {
                // Confirm Plugin Config has required fields
                if (!pluginConfig.name) throw new Error(`Plugin in folder ${pluginDirectory.name} does not have a name!`);
                if (!pluginConfig.version) throw new Error(`Plugin in folder ${pluginDirectory.name} does not have a version!`);

                // Import `plugin.ts` as a `Plugin` interface implemenation
                const plugin: Plugin = await import(`file://${pluginRoot}/${PLUGIN_ENTRY}`);

                const router = new ViewRouter({
                    prefix: pluginConfig.base,
                    // Use Denjucks View Engine as Default, can be configured in the configureRouter part
                    viewEngine: new DenjucksViewEngine({
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

                console.log(`${cyan(`[${pluginConfig.name}]`)} ${green('Successfully Loaded')}`);
            }
            catch (err) {
                console.error(`${cyan(`[${pluginConfig.name ?? pluginDirectory.name}]`)} ${red('ERROR - LOADING FAILED')}\n-- ERROR LOG --\n${err}`);
            }
        }
    }
}