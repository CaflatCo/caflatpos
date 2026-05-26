window.APP_CONTAINER =
  window.APP_CONTAINER || {};

function registerDependency(
  name,
  dependency
) {

  APP_CONTAINER[name] =
    dependency;

}

function resolveDependency(
  name
) {

  if (!APP_CONTAINER[name]) {

    console.warn(
      `Dependency missing: ${name}`
    );

    return null;

  }

  return APP_CONTAINER[name];

}
