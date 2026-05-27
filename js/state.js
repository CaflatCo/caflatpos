const STORAGE_KEY =
  'caflatcopos_v1';

const DEFAULT_STATE = {

  products: [],

  ingredients: [],

  sales: [],

  cart: [],

  heldOrders: [],

  categories: [],

  settings: {

    brandName:
      'Caflat.Co POS',

    currency: '₱',

    taxRate: 0,

    receiptFooter:
      'Thank you for your purchase!'

  }

};

let APP_STATE =
  loadState();

function loadState() {

  try {

    const raw =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!raw) {

      return structuredClone(
        DEFAULT_STATE
      );

    }

    const parsed =
      JSON.parse(raw);

    return {

      ...structuredClone(
        DEFAULT_STATE
      ),

      ...parsed

    };

  } catch (error) {

    console.error(
      'Failed to load state',
      error
    );

    return structuredClone(
      DEFAULT_STATE
    );

  }

}

function saveState() {

  try {

    localStorage.setItem(

      STORAGE_KEY,

      JSON.stringify(
        APP_STATE
      )

    );

  } catch (error) {

    console.error(
      'Failed to save state',
      error
    );

  }

}

function updateState(
  key,
  updater
) {

  if (
    typeof updater !==
    'function'
  ) {

    return;

  }

  const current =
    APP_STATE[key];

  APP_STATE[key] =
    updater(current);

  saveState();

}

function resetState() {

  APP_STATE =
    structuredClone(
      DEFAULT_STATE
    );

  saveState();

}

window.APP_STATE =
  APP_STATE;

window.updateState =
  updateState;

window.saveState =
  saveState;

window.resetState =
  resetState;