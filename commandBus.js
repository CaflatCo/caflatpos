window.APP_COMMANDS =
  window.APP_COMMANDS || {};

function registerCommand(
  name,
  handler
) {

  APP_COMMANDS[name] =
    handler;

}

async function executeCommand(
  name,
  payload = {}
) {

  const command =
    APP_COMMANDS[name];

  if (!command) {

    console.warn(
      `Command not found: ${name}`
    );

    return null;

  }

  const middlewarePassed =
    runMiddleware(
      name,
      payload
    );

  if (!middlewarePassed) {

    return null;

  }

  return await safeAsync(
    async () => {

      return await command(payload);

    },
    `command:${name}`
  );

}