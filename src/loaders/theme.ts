import { Application, fs, green, cyan, readJson } from "../deps.ts";
import DenjucksViewEngine from '../view-engines/denjucks-engine.ts'

const THEME_CONFIG = 'theme.json';
// Create site config interface
const SITE_CONFIG: any = await readJson(`${Deno.cwd()}/site.json`);

export async function loadThemes(app: Application) {
    const themesDirectory = `${Deno.cwd()}/themes`
    app.state['themes'] = {}

    if (!await fs.exists(themesDirectory)) throw new Error('No Themes Directory');

    // Get directories in `themes` that contain a `theme.json` file
    for await (const themeDirectory of Deno.readDir(themesDirectory)) {
        const THEME_CONFIG_PATH = `${themesDirectory}/${themeDirectory.name}/${THEME_CONFIG}`;

        if (themeDirectory.isDirectory && await fs.exists(THEME_CONFIG_PATH)) {
            const themeConfig: any = await readJson(`${themesDirectory}/${themeDirectory.name}/${THEME_CONFIG}`);
            const THEME_ROOT = `${themesDirectory}/${themeDirectory.name}`;

            app.state['themes'][themeConfig.id] = {
                config: themeConfig,
                root: THEME_ROOT
            }

            if (SITE_CONFIG.theme === themeConfig.id) {
                setTheme(app, THEME_ROOT, themeConfig);
            }
        }
    }

    if (!app.state['theme']) throw new Error('Unable to load theme');
}

function setTheme(app: Application, root: string, themeConfig: any) {
    app.state['theme'] = {
        config: themeConfig,
        engine: new DenjucksViewEngine({
            root: `${Deno.cwd()}/themes/default`,
            ext: '.njk'
        })
    }
    console.log(`${cyan(`[Theme]`)} ${green(`'${themeConfig.name}' Successfully Loaded`)}`);
}