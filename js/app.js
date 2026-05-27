document.addEventListener(
  'DOMContentLoaded',
  () => {

    try {

      if (
        typeof restorePersistedState ===
        'function'
      ) {

        restorePersistedState();

      }

      if (
        typeof renderProductsTable ===
        'function'
      ) {

        renderProductsTable();

      }

      if (
        typeof renderPOSProducts ===
        'function'
      ) {

        renderPOSProducts();

      }

      if (
        typeof renderIngredientsTable ===
        'function'
      ) {

        renderIngredientsTable();

      }

      if (
        typeof renderInventoryTable ===
        'function'
      ) {

        renderInventoryTable();

      }

      if (
        typeof renderSalesTable ===
        'function'
      ) {

        renderSalesTable();

      }

      if (
        typeof renderCategories ===
        'function'
      ) {

        renderCategories();

      }

      if (
        typeof renderCategoryOptions ===
        'function'
      ) {

        renderCategoryOptions();

      }

      if (
        typeof renderIngredientDropdowns ===
        'function'
      ) {

        renderIngredientDropdowns();

      }

      if (
        typeof renderLowStockAlerts ===
        'function'
      ) {

        renderLowStockAlerts();

      }

      if (
        typeof renderBranding ===
        'function'
      ) {

        renderBranding();

      }

      if (
        typeof renderCart ===
        'function'
      ) {

        renderCart();

      }

      if (
        typeof refreshDashboard ===
        'function'
      ) {

        refreshDashboard();

      }

      bindGlobalEvents();

      console.log(
        'Caflat.CoPOS v1 initialized'
      );

    } catch (error) {

      console.error(
        'Initialization failed',
        error
      );

      showNotification(
        'App initialization failed',
        'error'
      );

    }

  }
);

function bindGlobalEvents() {

  bindSearchFilters();

  bindModalClose();

  bindCheckoutInputs();

  bindNavigation();

}

function bindSearchFilters() {

  const productSearch =
    document.getElementById(
      'productSearch'
    );

  const categoryFilter =
    document.getElementById(
      'productCategoryFilter'
    );

  if (productSearch) {

    productSearch.addEventListener(
      'input',
      () => {

        renderProductsTable();

        renderPOSProducts();

      }
    );

  }

  if (categoryFilter) {

    categoryFilter.addEventListener(
      'change',
      () => {

        renderProductsTable();

        renderPOSProducts();

      }
    );

  }

}

function bindModalClose() {

  document
    .querySelectorAll(
      '.modal-overlay'
    )
    .forEach(overlay => {

      overlay.addEventListener(
        'click',
        event => {

          if (
            event.target === overlay
          ) {

            const modal =
              overlay.closest(
                '.modal'
              );

            if (!modal) return;

            closeModal(
              modal.id
            );

          }

        }
      );

    });

}

function bindCheckoutInputs() {

  const tenderedInput =
    document.getElementById(
      'amountTendered'
    );

  if (tenderedInput) {

    tenderedInput.addEventListener(
      'input',
      calculateChange
    );

  }

}

function bindNavigation() {

  const navItems =
    document.querySelectorAll(
      '[data-page]'
    );

  navItems.forEach(item => {

    item.addEventListener(
      'click',
      () => {

        const target =
          item.dataset.page;

        switchPage(target);

      }
    );

  });

}

function switchPage(pageId) {

  document
    .querySelectorAll(
      '.page'
    )
    .forEach(page => {

      page.classList.remove(
        'active'
      );

    });

  document
    .querySelectorAll(
      '[data-page]'
    )
    .forEach(item => {

      item.classList.remove(
        'active'
      );

    });

  const page =
    document.getElementById(
      pageId
    );

  if (page) {

    page.classList.add(
      'active'
    );

  }

  const nav =
    document.querySelector(
      `[data-page="${pageId}"]`
    );

  if (nav) {

    nav.classList.add(
      'active'
    );

  }

}

window.switchPage =
  switchPage;