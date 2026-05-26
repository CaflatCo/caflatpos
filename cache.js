window.APP_CACHE =
  window.APP_CACHE || {};

function setCache(
  key,
  value
) {

  APP_CACHE[key] = {

    value,

    timestamp:
      Date.now()

  };

}

function getCache(key) {

  if (!APP_CACHE[key]) {

    return null;

  }

  return APP_CACHE[key].value;

}

function clearCache(key = null) {

  if (key) {

    delete APP_CACHE[key];

    return;

  }

  window.APP_CACHE = {};

}