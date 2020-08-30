![dev-cms Logo](/static/logo.svg)

# dev-cms

dev-cms is a light-weight, extendable CMS written in Deno using [Oak](https://github.com/oakserver/oak) for the HTTP server, [Denjucks](https://github.com/denjucks/denjucks) for templating, and [DenoDB](https://github.com/eveningkid/denodb) for the ORM.

### Install Instructions

Reminder: Add install instructions

### Creating Pages

Pages can be created by creating a yaml file in the pages folder or pages sub-folder. The `index` yaml file will be the default for that folder.

Example: `index.yml`
```yaml
title: Home
type: markdown
style: landing
content: |
    ### Welcome
    This is my website content
```

### Plugins

Plugins can be created by creating a folder in `plugins` with a `plugin.json`, and `plugin.ts` file, example:
```
plugins
    └── example-plugin
        ├── plugin.json
        └── plugin.ts
```

Example `plugin.json`
```
{
    "name": "Example",
    "version": "1.0.0",
    "base": "/example", // base route for plugin router. optional
    "description": "This is an example plugin", // optional
    "enabled": true // optional, true or false, defaults to true if not specified
    "options": { // any options you want to pass to your plugin when it's loaded. optional
        "test": true,
        "can_be": "whatever_you_want"
    }
}
```

Check out the `admin-panel` plugin for an example of what you can do with plugins.

### Themes

Themes are not fully implemented, only an idea for the file structure is in place.


### View Engines

View Engines can be created by implementing the `ViewEngine` interface, can use rendering function you want as long as it can take in a string, and return HTML.

Example: Basic Denjucks View Engine

```typescript
export default class BasicDenjucksEngine implements ViewEngine {
    config?: ViewConfig;

    constructor(config?: ViewConfig) {
        this.config = config;
    }

    async render(template: string, data?: any): Promise<string> {
        if (this.config && this.config.root) denjucks.configure(this.config.root);

        return denjucks.renderString(template, data);
    }
}
```

---

### Please Note

The main purpose of dev-cms is giving me projects to work on for my portfolio, and to host my portfolio on, so I don't recommend using this project in any production situations as I won't be supporting it for long, please use something like [Grav](https://getgrav.org/), or [Pagekit](https://pagekit.com/) instead. 

If you think this is a good starting point for your own project, or want to continue developing it, feel free to fork it and continue working on it, just make sure to credit me.

