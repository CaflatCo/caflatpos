window.APP_PLUGINS =
  window.APP_PLUGINS || {};

function registerPlugin(
  name,
  plugin
) {

  if (APP_PLUGINS[name]) {

    console.warn(
      `Plugin already registered: ${name}`
    );

    return;

  }

  APP_PLUGINS[name] =
    plugin;

  console.info(
    `Plugin loaded: ${name}`
  );

}

function initializePlugins() {

  Object.keys(APP_PLUGINS)
    .forEach(name => {

      const plugin =
        APP_PLUGINS[name];

      if (
        typeof plugin.initialize ===
        'function'
      ) {

        safeExecute(() => {

          plugin.initialize();

        }, `plugin:${name}`);

      }

    });

}