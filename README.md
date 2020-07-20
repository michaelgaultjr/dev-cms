# dev-cms

dev-cms is a light-weight, extendable CMS written in Deno using [Oak](https://github.com/oakserver/oak) for the HTTP server, [Denjucks](https://github.com/denjucks/denjucks) for templating, and [DenoDB](https://github.com/eveningkid/denodb) for the ORM.

### Install Instructions
Reminder: Add install instructions

### Plugins

Plugins can be created by creating a folder in `plugins` with a `plugin.json`, and `plugin.ts` file, example:
```
plugins
    └── example-plugin
        ├── plugin.json
        └── plugin.ts
```

Example `plugin.json`
```json
{
    "name": "Example",
    "version": "1.0.0",
    "base": "/example" // base route for plugin router. optional
    "description": "This is an example plugin" // optional
    "options": { // any options you want to pass to your plugin when it's loaded. optional
        "test": true,
        "can_be": "whatever_you_want"
    }
}
```

Check out the `admin-panel` plugin in the plugins folder for a better example.

### Themes
Themes are not currently implemented, only an idea for the file structure is in place.

---

### Please Note
The main purpose of dev-cms is giving me projects to work on for my portfolio, and to host my portfolio on, so I wouldn't really recommend using this project as anything other than to play around with and learn from, as I won't be supporting it for long, please use something like [Grav](https://getgrav.org/), or [Pagekit](https://pagekit.com/) instead. If you think this is a good starting point for your own project, or want to continue developing it, feel free to fork it and continue working on it, just make sure to credit me.

