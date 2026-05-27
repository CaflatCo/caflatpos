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

  if (app) {

    app.style.display =
      'none';

    app.classList.remove(
      'authenticated'
    );

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