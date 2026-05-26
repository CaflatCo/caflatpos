window.APP_LIFECYCLE = {

  initialized: false,

  modules: []

};

function registerModule(
  name,
  initializer
) {

  APP_LIFECYCLE.modules.push({
    name,
    initializer
  });

}

function initializeApp() {

  if (APP_LIFECYCLE.initialized) {

    console.warn(
      'Application already initialized'
    );

    return;

  }

  APP_LIFECYCLE.initialized = true;

  APP_LIFECYCLE.modules.forEach(
    module => {

      safeExecute(() => {

        module.initializer();

      }, `module:${module.name}`);

    }
  );

}
