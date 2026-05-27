window.openIngredientModal = function() {

  resetIngredientForm?.();

  openModal(
    'ingredientModal'
  );

};

window.openInventoryModal = function() {

  openModal(
    'inventoryModal'
  );

};

window.openProductModal = function() {

  resetProductForm?.();

  openModal(
    'productModal'
  );

};

window.addVariantRow = function() {

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

  card.style = `
    border:1px solid #000;
    padding:16px;
    margin-bottom:14px;
    border-radius:12px;
    background:#fff;
  `;

  card.innerHTML = `

    <div style="
      display:flex;
      justify-content:space-between;
      align-items:center;
      margin-bottom:14px;
    ">

      <strong>
        Variant
      </strong>

      <button
        type="button"
        class="btn btn-sm"
        onclick="this.closest('.variant-card').remove()">

        Remove

      </button>

    </div>

    <div style="
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:12px;
    ">

      <div>

        <label>
          Variant Name
        </label>

        <input
          type="text"
          class="variant-name"
          placeholder="e.g. Box of 6"
        />

      </div>

      <div>

        <label>
          Price
        </label>

        <input
          type="number"
          class="variant-price"
          placeholder="0.00"
          min="0"
          step="0.01"
        />

      </div>

    </div>

  `;

  builder.appendChild(card);

};

window.exportSalesCSV = function() {

  const sales =
    APP_STATE.sales || [];

  let csv =
    'Date,Total\n';

  sales.forEach(sale => {

    csv +=
      `${sale.createdAt},${sale.total}\n`;

  });

  downloadFile(
    'sales.csv',
    csv,
    'text/csv'
  );

  showNotification(
    'Sales exported',
    'success'
  );

};

window.saveSettings = function() {

  const settings = {

    brandName:
      document.getElementById(
        'setBrandName'
      )?.value || '',

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

window.renderBranding = function() {

  const brand =
    safeGetById(
      'brandName'
    );

  if (!brand) return;

  brand.textContent =

    APP_STATE.settings
      ?.brandName ||

    'Caflat.Co POS';

};

window.loadDemoData = function() {

  const demoProducts = [

    new Product({

      sku: 'CK-001',

      name: 'Classic Cookie',

      category: 'Cookies',

      cost: 45,

      price: 85,

      stock: 24,

      lowStockThreshold: 5

    }),

    new Product({

      sku: 'CK-002',

      name: 'Red Velvet Cookie',

      category: 'Cookies',

      cost: 55,

      price: 95,

      stock: 12,

      lowStockThreshold: 5

    })

  ];

  APP_STATE.products =
    demoProducts;

  renderProductsTable();

  renderPOSProducts();

  showNotification(
    'Demo data loaded',
    'success'
  );

};

window.resetData = function() {

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