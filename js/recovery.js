window.APP_RECOVERY =
  window.APP_RECOVERY || {};

function registerRecoveryHandler(
  name,
  callback
) {

  APP_RECOVERY[name] =
    callback;

}

function attemptRecovery(
  name,
  payload = {}
) {

  const handler =
    APP_RECOVERY[name];

  if (!handler) {

    console.warn(
      `Recovery handler missing: ${name}`
    );

    return false;

  }

  try {

    handler(payload);

    console.info(
      `Recovery succeeded: ${name}`
    );

    return true;

  } catch (error) {

    console.error(
      `Recovery failed: ${name}`,
      error
    );

    return false;

  }

}
