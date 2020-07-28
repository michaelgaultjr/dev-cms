import {
  Application,
  Session,
  
  Database,

  green,
  bold,
} from './deps.ts';
import { Pages } from './db-models.ts';
import { 
  loggerMiddleware, 
  responseTimeMiddleware, 
  staticFileMiddleware,
  pageMiddleware
} from './middlewares/mod.ts';

import {
  loadPlugins,
  loadThemes,
  loadPages,
} from './loaders/mod.ts';

const app: Application = new Application();

//#region Currently Unused Code
// Session
// const session = new Session({ framework: 'oak' });
// await session.init();
// app.use(session.use()(session));

// // Database
// const db: Database = new Database('postgres', {
//   host: '127.0.0.1',
//   username: 'cms-db',
//   password: 'cms-db',
//   database: 'dc_data',
// });

// db.link([
// 	Pages
// ]);

// if (Deno.args.includes('--sync')) {
//     await db.sync({ drop: Deno.args.includes('--drop') });
// }
//#endregion

// Middlewares
app.use(loggerMiddleware);
app.use(responseTimeMiddleware);

await loadPlugins(app); 
await loadThemes(app);
await loadPages(app);

app.use(pageMiddleware)
app.use(staticFileMiddleware);

app.addEventListener('listen', ({ hostname, port, secure }) => {
    const protocol = secure ? 'https' : 'http'
    console.log(`${green('Listening:')} ${bold(`${protocol}://${hostname || 'localhost'}:${port}`)}`);
});

await app.listen({ port: 8000 });