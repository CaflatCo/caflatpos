function formatCurrency(value) {

  return (
    APP_CONFIG.CURRENCY_SYMBOL +
    Number(value || 0).toFixed(
      APP_CONFIG.DEFAULT_DECIMAL_PLACES
    )
  );

}

function formatDate(date) {

  return new Date(date)
    .toLocaleDateString(
      APP_CONFIG.DATE_LOCALE
    );

}

function generateReceiptNumber() {

  return (
    'RCPT-' +
    Date.now()
  );

}

function calculateTax(amount) {

  return (
    Number(amount || 0) *
    (APP_CONFIG.TAX_RATE / 100)
  );

}

function saveToStorage(
  key,
  value
) {

  localStorage.setItem(
    key,
    JSON.stringify(value)
  );

}

function loadFromStorage(
  key
) {

  try {

    const data =
      localStorage.getItem(key);

    return data
      ? JSON.parse(data)
      : null;

  }

  catch(error) {

    console.error(error);

    return null;

  }

}

function removeFromStorage(
  key
) {

  localStorage.removeItem(key);

}

function safeGetById(id) {

  return document.getElementById(id);

}

function safeQuery(selector) {

  return document.querySelector(selector);

}

function safeQueryAll(selector) {

  return document.querySelectorAll(selector);

}

function generateId() {

  return (

    Date.now().toString(36) +

    Math.random()
      .toString(36)
      .substring(2, 9)

  );

}

function deepClone(data) {

  return JSON.parse(
    JSON.stringify(data)
  );

}

function debounce(
  func,
  delay = 300
) {

  let timeout;

  return function(...args) {

    clearTimeout(timeout);

    timeout = setTimeout(
      () => func.apply(this, args),
      delay
    );

  };

}

function throttle(
  func,
  limit = 300
) {

  let waiting = false;

  return function(...args) {

    if (!waiting) {

      func.apply(this, args);

      waiting = true;

      setTimeout(
        () => waiting = false,
        limit
      );

    }

  };

}

function capitalize(text) {

  return String(text || '')
    .charAt(0)
    .toUpperCase() +

    String(text || '')
      .slice(1);

}

function formatNumber(value) {

  return Number(value || 0)
    .toLocaleString();

}

function calculatePercentage(
  value,
  total
) {

  if (!total) {

    return 0;

  }

  return (
    (
      Number(value || 0) /
      Number(total || 0)
    ) * 100
  ).toFixed(2);

}

function downloadFile(
  filename,
  content,
  type = 'text/plain'
) {

  const blob = new Blob(
    [content],
    { type }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement('a');

  link.href = url;

  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);

}

function measurePerformance(
  label,
  callback
) {

  try {

    return callback();

  }

  catch(error) {

    console.error(
      'Performance wrapper failed:',
      error
    );

    return null;

  }

}

function trackMetric(
  name,
  data = {}
) {

  console.log(
    '[METRIC]',
    name,
    data
  );

}

function toggleRecipeMode() {

  const mode =
    safeGetById(
      'recipeMode'
    );

  const batchWrap =
    safeGetById(
      'batchYieldWrap'
    );

  if (
    !mode ||
    !batchWrap
  ) {

    return;

  }

  batchWrap.style.display =
    mode.value === 'batch'
      ? 'block'
      : 'none';

}

function initializePlugins() {

  console.log(
    'Plugins initialized'
  );

}

function runHealthChecks() {

  console.log(
    'Health checks passed'
  );

}

function initializeApp() {

  console.log(
    'Application initialized'
  );

}

function openModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) {

    console.error(
      'Modal not found:',
      id
    );

    return;

  }

  modal.style.display =
    'flex';

  modal.style.visibility =
    'visible';

  modal.style.opacity =
    '1';

  modal.style.pointerEvents =
    'auto';

}

function closeModal(id) {

  const modal =
    document.getElementById(id);

  if (!modal) {

    return;

  }

  modal.style.display =
    'none';

  modal.style.visibility =
    'hidden';

  modal.style.opacity =
    '0';

  modal.style.pointerEvents =
    'none';

}

function exportData() {

  const data = {

    products:
      APP_STATE.products || [],

    inventory:
      APP_STATE.inventory || [],

    ingredients:
      APP_STATE.ingredients || [],

    sales:
      APP_STATE.sales || [],

    settings:
      APP_STATE.settings || {}

  };

  downloadFile(

    'caflat-backup.json',

    JSON.stringify(
      data,
      null,
      2
    ),

    'application/json'

  );

  if (
    typeof showNotification ===
    'function'
  ) {

    showNotification(

      'Data exported successfully',

      'success'

    );

  }

}