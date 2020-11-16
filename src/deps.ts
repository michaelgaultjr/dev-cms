export { 
    Application,
    Router,
    send,
} from "https://deno.land/x/oak@v6.3.2/mod.ts";

export type { 
  Middleware,
  Context,
  RouterContext,
  RouterOptions,
} from "https://deno.land/x/oak@v6.3.2/mod.ts";

export {
    ViewRouter,
    View,
} from '../src/view-router.ts';

export {
  green,
  red,
  cyan,
  bold,
} from "https://deno.land/std@0.78.0/fmt/colors.ts";

export * as fs from "https://deno.land/std@0.78.0/fs/mod.ts";

export * as path from "https://deno.land/std@0.78.0/path/mod.ts";
export * as yml from "https://deno.land/std@0.78.0/encoding/yaml.ts";

export async function readJson(path: string): Promise<any> {
	return JSON.parse(await Deno.readTextFile(path));
}