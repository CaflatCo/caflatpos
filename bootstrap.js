function bootstrapApplication() {

  logInfo(
    'Application bootstrap started'
  );

  safeExecute(() => {

    initializePlugins();

  }, 'plugins');

  safeExecute(() => {

    runHealthChecks();

  }, 'health-checks');

  safeExecute(() => {

    initializeApp();

  }, 'lifecycle');

  trackMetric(
    'application_bootstrap',
    {

      status: 'completed'

    }
  );

  logInfo(
    'Application bootstrap completed'
  );

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    bootstrapApplication();

  }
);