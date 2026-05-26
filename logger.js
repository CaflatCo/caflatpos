window.APP_LOGS =
  window.APP_LOGS || [];

function logInfo(message, data = null) {

  const entry = {

    type: 'info',

    message,

    data,

    timestamp: new Date().toISOString()

  };

  APP_LOGS.push(entry);

  if (APP_CONFIG.ENABLE_DEBUG_LOGS) {

    console.log(
      '[INFO]',
      message,
      data
    );

  }

}

function logError(message, error = null) {

  const entry = {

    type: 'error',

    message,

    error,

    timestamp: new Date().toISOString()

  };

  APP_LOGS.push(entry);

  console.error(
    '[ERROR]',
    message,
    error
  );

}

function getLogs() {

  return APP_LOGS;

}