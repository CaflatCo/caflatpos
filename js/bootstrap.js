function bootstrapApplication() {

  logInfo(
    'Application bootstrap started'
  );

  const authData =

    loadFromStorage(
      'caflat_auth'
    );

  const loginScreen =
    document.getElementById(
      'loginScreen'
    );

  const appContainer =
    document.getElementById(
      'app'
    );

  if (!authData) {

    if (loginScreen) {

      loginScreen.style.display =
        'flex';

    }

    if (appContainer) {

      appContainer.style.display =
        'none';

    }

    logInfo(
      'Authentication required'
    );

    return;

  }

  if (loginScreen) {

    loginScreen.style.display =
      'none';

  }

  if (appContainer) {

    appContainer.style.display =
      'block';

  }

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