window.APP_RUNTIME = window.APP_RUNTIME || {
  initialized: false,
  listeners: new Set()
};

function safeInitialize(key, callback) {

  if (window.APP_RUNTIME.listeners.has(key)) {
    console.warn('Skipped duplicate init:', key);
    return;
  }

  window.APP_RUNTIME.listeners.add(key);

  try {
    callback();
  } catch (error) {
    console.error(
      'Initialization failed:',
      key,
      error
    );
  }

}

document.addEventListener(
  'DOMContentLoaded',
  () => {

    if (window.APP_RUNTIME.initialized) {

      console.warn(
        'Duplicate DOMContentLoaded blocked'
      );

      return;

    }

    window.APP_RUNTIME.initialized = true;

    console.log(
      'Runtime stabilization active'
    );

  }
);
window.addEventListener(
  'error',
  (event) => {

    console.error(
      'Global runtime error:',
      event.error
    );

  }
);

window.addEventListener(
  'unhandledrejection',
  (event) => {

    console.error(
      'Unhandled promise rejection:',
      event.reason
    );

  }
);

function safeExecute(callback, context = 'unknown') {

  try {

    callback();

  } catch (error) {

    console.error(
      `Safe execution failed (${context}):`,
      error
    );

  }

}
function safeQuery(selector) {

  const element =
    document.querySelector(selector);

  if (!element) {

    console.warn(
      `Element not found: ${selector}`
    );

    return null;

  }

  return element;

}

function safeQueryAll(selector) {

  const elements =
    document.querySelectorAll(selector);

  if (!elements.length) {

    console.warn(
      `No elements found: ${selector}`
    );

  }

  return elements;

}

function safeGetById(id) {

  const element =
    document.getElementById(id);

  if (!element) {

    console.warn(
      `Element ID not found: ${id}`
    );

    return null;

  }

  return element;

}
window.APP_RENDER_STATE =
  window.APP_RENDER_STATE || {};

function safeRender(key, callback) {

  if (window.APP_RENDER_STATE[key]) {

    console.warn(
      `Render blocked (already rendering): ${key}`
    );

    return;

  }

  window.APP_RENDER_STATE[key] = true;

  try {

    callback();

  } catch (error) {

    console.error(
      `Render failed (${key}):`,
      error
    );

  } finally {

    window.APP_RENDER_STATE[key] = false;

  }

}
window.APP_EVENTS =
  window.APP_EVENTS || {};

function emitEvent(eventName, payload = {}) {

  if (!window.APP_EVENTS[eventName]) {
    return;
  }

  window.APP_EVENTS[eventName]
    .forEach(listener => {

      safeExecute(() => {
        listener(payload);
      }, `event:${eventName}`);

    });

}

function onEvent(eventName, callback) {

  if (!window.APP_EVENTS[eventName]) {

    window.APP_EVENTS[eventName] = [];

  }

  window.APP_EVENTS[eventName]
    .push(callback);

}
async function safeAsync(
  callback,
  context = 'async-operation'
) {

  try {

    return await callback();

  } catch (error) {

    console.error(
      `Async operation failed (${context}):`,
      error
    );

    return null;

  }

}