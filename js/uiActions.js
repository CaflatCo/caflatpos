window.openIngredientModal =
  function () {

    if (
      typeof resetIngredientForm ===
      'function'
    ) {

      resetIngredientForm();

    }

    openModal(
      'ingredientModal'
    );

  };

window.openInventoryModal =
  function () {

    openModal(
      'inventoryModal'
    );

  };

window.openProductModal =
  function () {

    if (
      typeof resetProductForm ===
      'function'
    ) {

      resetProductForm();

    }

    if (
      typeof renderCategoryOptions ===
      'function'
    ) {

      renderCategoryOptions();

    }

    openModal(
      'productModal'
    );

  };

window.addVariantRow =
  function (data = {}) {

    const builder =
      document.getElementById(
        'variantBuilder'
      );

    if (!builder) return;

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'variant-card';

    card.innerHTML = `

      <div class="variant-card-head">

        <strong>
          Variant
        </strong>

        <button
          type="button"
          class="btn btn-secondary btn-sm remove-variant-btn">

          Remove

        </button>

      </div>

      <div class="form-row">

        <div class="form-group">

          <label>
            Variant Name
          </label>

          <input
            type="text"
            class="variant-name"
            placeholder="e.g. Box of 6"
            value="${data.label || data.name || ''}"
          />

        </div>

        <div class="form-group">

          <label>
            Price
          </label>

          <input
            type="number"
            class="variant-price"
            min="0"
            step="0.01"
            value="${data.price || 0}"
          />

        </div>

      </div>

    `;

    card.querySelector(
      '.remove-variant-btn'
    ).addEventListener(
      'click',
      () => card.remove()
    );

    builder.appendChild(card);

  };

window.renderBranding =
  function () {

    const brand =
      document.getElementById(
        'brandName'
      );

    if (!brand) return;

    brand.textContent =
      APP_STATE.settings
        ?.brandName ||

      'Caflat.Co POS';

  };

window.saveSettings =
  function () {

    const settings = {

      brandName:
        document.getElementById(
          'setBrandName'
        )?.value?.trim()

        ||

        'Caflat.Co POS',

      currency:
        document.getElementById(
          'setCurrency'
        )?.value || '₱',

      taxRate:
        Number(
          document.getElementById(
            'setTaxRate'
          )?.value || 0
        ),

      receiptFooter:
        document.getElementById(
          'setReceiptFooter'
        )?.value || ''

    };

    updateState(
      'settings',
      () => settings
    );

    renderBranding();

    showNotification(
      'Settings saved',
      'success'
    );

  };

window.addCategory =
  function () {

    const input =
      document.getElementById(
        'newCategoryInput'
      );

    if (!input) return;

    const value =
      input.value.trim();

    if (!value) {

      showNotification(
        'Category name required',
        'error'
      );

      return;

    }

    const categories =
      Array.isArray(
        APP_STATE.categories
      )

        ? [...APP_STATE.categories]

        : [];

    const exists =
      categories.some(
        category =>

          category.toLowerCase()
          ===
          value.toLowerCase()
      );

    if (exists) {

      showNotification(
        'Category already exists',
        'error'
      );

      return;

    }

    categories.push(value);

    updateState(
      'categories',
      () => categories
    );

    input.value = '';

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

    showNotification(
      'Category added',
      'success'
    );

  };

window.exportSalesCSV =
  function () {

    const sales =
      APP_STATE.sales || [];

    const rows = [

      'Receipt,Date,Total'

    ];

    sales.forEach(sale => {

      rows.push([

        sale.receiptNumber || '',
        sale.createdAt || '',
        Number(sale.total || 0)
          .toFixed(2)

      ].join(','));

    });

    downloadFile(

      'sales.csv',

      rows.join('\n'),

      'text/csv'

    );

    showNotification(
      'Sales exported',
      'success'
    );

  };

window.loadDemoData =
  function () {

    const demoCategories = [

      'Cookies',
      'Chewy Cookies',
      'Beverages'

    ];

    const demoIngredients = [

      {

        id:
          generateId(),

        name: 'Flour',

        unit: 'g',

        packageQty: 5000,

        packageCost: 199,

        stock: 4000,

        reorderLevel: 500

      },

      {

        id:
          generateId(),

        name: 'Sugar',

        unit: 'g',

        packageQty: 1000,

        packageCost: 56,

        stock: 750,

        reorderLevel: 200

      },

      {

        id:
          generateId(),

        name: 'Butter',

        unit: 'g',

        packageQty: 500,

        packageCost: 175,

        stock: 120,

        reorderLevel: 200

      }

    ];

    const demoProducts = [

      {

        id:
          generateId(),

        sku: 'CK-001',

        name:
          'Classic Cookie',

        category:
          'Cookies',

        cost: 45,

        price: 85,

        stock: 24,

        reorderLevel: 5,

        variants: []

      },

      {

        id:
          generateId(),

        sku: 'RV-001',

        name:
          'Red Velvet Cookie',

        category:
          'Cookies',

        cost: 55,

        price: 95,

        stock: 12,

        reorderLevel: 5,

        variants: [

          {

            id:
              generateId(),

            name:
              'Box of 4',

            price: 360

          },

          {

            id:
              generateId(),

            name:
              'Box of 6',

            price: 520

          }

        ]

      }

    ];

    updateState(
      'categories',
      () => demoCategories
    );

    updateState(
      'ingredients',
      () => demoIngredients
    );

    updateState(
      'products',
      () => demoProducts
    );

    renderCategories();

    renderCategoryOptions();

    renderProductsTable();

    renderPOSProducts();

    renderIngredientsTable();

    renderIngredientDropdowns();

    renderBranding();

    showNotification(
      'Demo data loaded',
      'success'
    );

  };

window.resetData =
  function () {

    const confirmed =
      confirm(
        'Reset all data?'
      );

    if (!confirmed) return;

    localStorage.clear();

    location.reload();

  };

document.addEventListener(
  'DOMContentLoaded',
  () => {

    renderBranding();

  }
);