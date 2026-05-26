window.APP_HEALTH = {

  status: 'healthy',

  checks: []

};

function registerHealthCheck(
  name,
  callback
) {

  APP_HEALTH.checks.push({
    name,
    callback
  });

}

function runHealthChecks() {

  const results = [];

  APP_HEALTH.checks.forEach(
    check => {

      try {

        const result =
          check.callback();

        results.push({
          name: check.name,
          status: result
            ? 'healthy'
            : 'failed'
        });

      } catch (error) {

        results.push({
          name: check.name,
          status: 'error',
          error
        });

      }

    }
  );

  return results;

}
