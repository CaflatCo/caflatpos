const APP_STATE = {

  products: [],
  ingredients: [],
  inventory: [],
  sales: [],
  categories: [],
  heldOrders: [],
  cart: [],

  settings: {
    brandName: 'Caflat.Co POS',
    currency: '₱',
    taxRate: 0,
    receiptFooter: 'Thank you for your purchase!'
  }

};

function saveState() {

  localStorage.setItem(
    'caflat_pos_state',
    JSON.stringify(APP_STATE)
  );

}

function loadState() {

  const savedState = localStorage.getItem(
    'caflat_pos_state'
  );

  if (!savedState) return;

  try {

    const parsedState = JSON.parse(savedState);

    Object.assign(APP_STATE, parsedState);

  } catch (error) {

    console.error(
      'Failed to load application state:',
      error
    );

  }

}

function resetState() {

  localStorage.removeItem(
    'caflat_pos_state'
  );

  location.reload();

}

document.addEventListener(
  'DOMContentLoaded',
  loadState
);
function updateState(key, updater) {

  if (!(key in APP_STATE)) {

    console.warn(
      `Invalid state key: ${key}`
    );

    return;

  }

  try {

    const currentValue =
      APP_STATE[key];

    const updatedValue =
      updater(currentValue);

    APP_STATE[key] =
      updatedValue;

    saveState();

  } catch (error) {

    console.error(
      `State update failed (${key}):`,
      error
    );

  }

}

function getState(key) {

  if (!(key in APP_STATE)) {

    console.warn(
      `Invalid state access: ${key}`
    );

    return null;

  }

  return APP_STATE[key];

}
