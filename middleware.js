window.APP_MIDDLEWARE =
  window.APP_MIDDLEWARE || {};

function registerMiddleware(
  action,
  callback
) {

  if (!APP_MIDDLEWARE[action]) {

    APP_MIDDLEWARE[action] = [];

  }

  APP_MIDDLEWARE[action]
    .push(callback);

}

function runMiddleware(
  action,
  payload = {}
) {

  const middlewareList =
    APP_MIDDLEWARE[action] || [];

  for (const middleware of middlewareList) {

    const result =
      middleware(payload);

    if (result === false) {

      console.warn(
        `Middleware blocked: ${action}`
      );

      return false;

    }

  }

  return true;

}