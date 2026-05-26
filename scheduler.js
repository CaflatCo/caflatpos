window.APP_SCHEDULER =
  window.APP_SCHEDULER || {};

function registerInterval(
  name,
  callback,
  delay
) {

  if (APP_SCHEDULER[name]) {

    clearInterval(
      APP_SCHEDULER[name]
    );

  }

  APP_SCHEDULER[name] =
    setInterval(
      callback,
      delay
    );

}

function clearScheduledTask(
  name
) {

  if (!APP_SCHEDULER[name]) {

    return;

  }

  clearInterval(
    APP_SCHEDULER[name]
  );

  delete APP_SCHEDULER[name];

}

function clearAllScheduledTasks() {

  Object.keys(APP_SCHEDULER)
    .forEach(name => {

      clearInterval(
        APP_SCHEDULER[name]
      );

    });

  window.APP_SCHEDULER = {};

}