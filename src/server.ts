import {
  Application,
  Session,
  
  Database,

  green,
  bold,
} from './deps.ts';
import { PageDb, Page } from './db-models.ts';
import { 
  loggerMiddleware, 
  responseTimeMiddleware, 
  staticFileMiddleware,
  pageMiddleware
} from './middlewares.ts';

import loadPlugins from "./plugin-loader.ts";

const app: Application = new Application();

app.state['theme'] = {
	root: `${Deno.cwd()}/themes/default`,
	default: 'home.njk'
}

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
	PageDb
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

// Load pages from db -- Temporary for testing purposes, will be moved
const pages: Page[] = await PageDb.all();

app.state['pages'] = {};
pages.forEach(page => {
	app.state['pages'][page.route] = page;
});

await app.listen({ port: 8000 });