const STORAGE_VERSION =
  '1.0.0';

function getStorageKey() {

  return STORAGE_KEY;

}

function persistAppState() {

  try {

    const payload = {

      version:
        STORAGE_VERSION,

      updatedAt:
        new Date().toISOString(),

      data:
        APP_STATE

    };

    localStorage.setItem(

      getStorageKey(),

      JSON.stringify(payload)

    );

    return true;

  } catch (error) {

    console.error(
      'Persist state failed',
      error
    );

    showNotification(
      'Failed to save local data',
      'error'
    );

    return false;

  }

}

function restorePersistedState() {

  try {

    const raw =
      localStorage.getItem(
        getStorageKey()
      );

    if (!raw) {

      return false;

    }

    const parsed =
      JSON.parse(raw);

    if (!parsed.data) {

      return false;

    }

    APP_STATE = {

      ...structuredClone(
        DEFAULT_STATE
      ),

      ...parsed.data

    };

    window.APP_STATE =
      APP_STATE;

    return true;

  } catch (error) {

    console.error(
      'Restore state failed',
      error
    );

    return false;

  }

}

function exportData() {

  try {

    const payload = {

      version:
        STORAGE_VERSION,

      exportedAt:
        new Date().toISOString(),

      data:
        APP_STATE

    };

    downloadFile(

      `caflatcopos-backup-${Date.now()}.json`,

      JSON.stringify(
        payload,
        null,
        2
      ),

      'application/json'

    );

    showNotification(
      'Backup exported',
      'success'
    );

  } catch (error) {

    console.error(
      'Export failed',
      error
    );

    showNotification(
      'Export failed',
      'error'
    );

  }

}

function importData(
  event
) {

  const file =
    event.target.files?.[0];

  if (!file) return;

  const reader =
    new FileReader();

  reader.onload =
    function(loadEvent) {

      try {

        const parsed =
          JSON.parse(
            loadEvent.target.result
          );

        if (!parsed.data) {

          throw new Error(
            'Invalid backup format'
          );

        }

        APP_STATE = {

          ...structuredClone(
            DEFAULT_STATE
          ),

          ...parsed.data

        };

        window.APP_STATE =
          APP_STATE;

        persistAppState();

        if (
          typeof renderProductsTable
          ===
          'function'
        ) {

          renderProductsTable();

        }

        if (
          typeof renderPOSProducts
          ===
          'function'
        ) {

          renderPOSProducts();

        }

        if (
          typeof renderIngredientsTable
          ===
          'function'
        ) {

          renderIngredientsTable();

        }

        if (
          typeof renderInventoryTable
          ===
          'function'
        ) {

          renderInventoryTable();

        }

        if (
          typeof renderSalesTable
          ===
          'function'
        ) {

          renderSalesTable();

        }

        if (
          typeof renderCategories
          ===
          'function'
        ) {

          renderCategories();

        }

        if (
          typeof renderCategoryOptions
          ===
          'function'
        ) {

          renderCategoryOptions();

        }

        if (
          typeof renderCart
          ===
          'function'
        ) {

          renderCart();

        }

        if (
          typeof renderLowStockAlerts
          ===
          'function'
        ) {

          renderLowStockAlerts();

        }

        if (
          typeof refreshDashboard
          ===
          'function'
        ) {

          refreshDashboard();

        }

        showNotification(
          'Backup restored',
          'success'
        );

      } catch (error) {

        console.error(
          'Import failed',
          error
        );

        showNotification(
          'Invalid backup file',
          'error'
        );

      }

    };

  reader.readAsText(file);

}

window.persistAppState =
  persistAppState;

window.restorePersistedState =
  restorePersistedState;

window.exportData =
  exportData;

window.importData =
  importData;