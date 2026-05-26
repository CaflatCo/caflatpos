window.APP_TELEMETRY =
  window.APP_TELEMETRY || [];

function trackMetric(
  event,
  data = {}
) {

  APP_TELEMETRY.push({

    event,

    data,

    timestamp:
      new Date().toISOString()

  });

}

function measurePerformance(
  label,
  callback
) {

  const start =
    performance.now();

  const result =
    callback();

  const end =
    performance.now();

  trackMetric(
    'performance',
    {

      label,

      duration:
        end - start

    }
  );

  return result;

}
