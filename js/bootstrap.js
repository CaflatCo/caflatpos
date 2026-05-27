function bootstrapApplication() {

  logInfo(
    'Application bootstrap started'
  );

  const app =
    safeGetById(
      'app'
    );

  const loginScreen =
    safeGetById(
      'loginScreen'
    );

  const authData =
    loadFromStorage(
      'caflat_auth'
    );

  if (!authData) {

    if (app) {

      app.style.display =
        'none';

    }

    if (loginScreen) {

      loginScreen.style.display =
        'flex';

      loginScreen.style.visibility =
        'visible';

      loginScreen.style.opacity =
        '1';

      loginScreen.style.pointerEvents =
        'auto';

    }

    logInfo(
      'Authentication required'
    );

    return;

  }

  if (loginScreen) {

    loginScreen.style.display =
      'none';

    loginScreen.style.visibility =
      'hidden';

    loginScreen.style.opacity =
      '0';

    loginScreen.style.pointerEvents =
      'none';

  }

  if (app) {

    app.style.display =
      'block';

    app.style.visibility =
      'visible';

    app.style.opacity =
      '1';

    app.style.pointerEvents =
      'auto';

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