(function () {

  const originalCompleteSale =
    window.completeSale;

  if (!originalCompleteSale)
    return;

  window.completeSale =
    function () {

      originalCompleteSale();

      if (
        typeof refreshDashboard ===
        'function'
      ) {

        refreshDashboard();

      }

      if (
        typeof renderSalesTable ===
        'function'
      ) {

        renderSalesTable();

      }

      if (
        typeof renderInventoryTable ===
        'function'
      ) {

        renderInventoryTable();

      }

      if (
        typeof renderLowStockAlerts ===
        'function'
      ) {

        renderLowStockAlerts();

      }

    };

})();