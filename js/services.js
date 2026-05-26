window.APP_SERVICES =
  window.APP_SERVICES || {};

function registerService(
  name,
  service
) {

  if (APP_SERVICES[name]) {

    console.warn(
      `Service already exists: ${name}`
    );

    return;

  }

  APP_SERVICES[name] =
    service;

}

function getService(name) {

  if (!APP_SERVICES[name]) {

    console.warn(
      `Service not found: ${name}`
    );

    return null;

  }

  return APP_SERVICES[name];

}
