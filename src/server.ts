import {
  Application,
  Router,
  Session,
  
  Database,

  green,
  bold,
} from './deps.ts';
import { PageModel, PageContentModel } from './db-models.ts';
import { viewEngine, engineFactory, adapterFactory } from "https://deno.land/x/view_engine@v1.2.0/mod.ts";
import { 
  loggerMiddleware, 
  responseTimeMiddleware, 
  staticFileMiddleware,
  pageMiddleware
} from './middlewares.ts';

import loadPlugins from "./plugin-loader.ts";

const app: Application = new Application();

// View Engine
const denjuckEngine = engineFactory.getDenjuckEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, denjuckEngine))

// Session
const session = new Session({ framework: 'oak' });
await session.init();
app.use(session.use()(session));

// Database
const db: Database = new Database('postgres', {
  host: '127.0.0.1',
  username: 'cms-db',
  password: 'cms-db',
  database: 'dc_data',
});

db.link([
    PageModel,
    PageContentModel
]);

if (Deno.args.includes('--sync')) {
    await db.sync({ drop: Deno.args.includes('--drop') });
}

// Middlewares
app.use(loggerMiddleware);
app.use(responseTimeMiddleware);

await loadPlugins(app);

app.use(pageMiddleware)
app.use(staticFileMiddleware);

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const protocol = secure ? 'https' : 'http'
  console.log(`${green('Listening:')} ${bold(`${protocol}://${hostname || 'localhost'}:${port}`)}`);
});

await app.listen({ port: 8000 });