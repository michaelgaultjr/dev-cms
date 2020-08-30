![dev-cms Logo](/logo.svg)

# dev-cms

dev-cms is a light-weight, extendable CMS written in [Deno](https://deno.land/) using [Oak](https://github.com/oakserver/oak) for the HTTP server, [Denjucks](https://github.com/denjucks/denjucks) for templating.

### Install Instructions

1. [Install Deno](https://deno.land/#installation) version `1.3.2` or higher

2. [Install Denon](https://github.com/denosaurs/denon/)

3. Clone the project using `git clone https://github.com/thegamingninja/dev-cms`

4. CD into `dev-cms` by running `cd dev-cms` in the terminal of your choice

5. Run the application using `denon start`

### Configuration

dev-cms can be configured using enviroment variables. You can set them in `denon.json` in the `env` section, or by setting them in the terminal for your OS.

- `PORT={number}` - Sets the port of the Application. Default `3000`.
- `CACHE-DURATION={number}` Sets the `max-age` property in the `Cache-Control` header for static files. Default `1800`.
- `ALLOWED-EXTENTSIONS={extentions}` Comma separated list of allowed extentions. Default `.css,.js,.png,.svg`.

### Creating Pages

Pages are file based routed, and can be created by creating a yaml file in the pages folder or sub-folder. (Example: `pages/examples/example1.yml` will be accessible at `https://domain.com/examples/example1`)

The `index` yaml file will be the default for that folder. (both `.yml` and `.yaml` files are supported)

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
    "base": "/example", // optional. base route for plugin router
    "description": "This is an example plugin", // optional
    "enabled": true // optional. true or false, defaults to true if not specified
    "options": { // optional. any options you want to pass to your plugin when it's loaded
        "test": true,
        "can_be": "whatever_you_want"
    }
}
```

Check out the `admin-panel` plugin for an example of what you can do with plugins.

### Themes

Themes are not fully implemented, only an idea for the file structure is in place.

See the `Roadmap` section below for more information.


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

# Roadmap

## Small Improvements
---
Remove `/static` from root

## Major Improvements

Media Library: Create a plugin that's page independant for user uploaded content

Theme Layouts: Load any file in the theme folder named `[name].layout.[extention]` as a possible layout

---

### Please Note

The main purpose of dev-cms is giving me a place to host my portfolio as well as a another project for it, so I don't recommend using this project in any production situations as I won't be designed to support anything more than what I want to do with it. If you need a CMS like this I'd recommend using something like [Grav](https://getgrav.org/), or [Pagekit](https://pagekit.com/).

If you think this is a good starting point for your own project, or want to continue developing it, feel free to submit a pull request with your changes, or fork it and continue working on it, just make sure to credit me.

