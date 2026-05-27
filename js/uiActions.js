window.openIngredientModal = function() {

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

  document.getElementById(
    'productId'
  ).value = '';

  document.getElementById(
    'productSKU'
  ).value = '';

  document.getElementById(
    'productNameInput'
  ).value = '';

  document.getElementById(
    'productCategory'
  ).value = '';

  document.getElementById(
    'productCost'
  ).value = '';

  document.getElementById(
    'productPrice'
  ).value = '';

  document.getElementById(
    'productStock'
  ).value = '';

  document.getElementById(
    'productReorder'
  ).value = '';

  document.getElementById(
    'productDescription'
  ).value = '';

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

  card.innerHTML = `

    <div class="form-row">

      <div class="form-group">

        <label>
          Variant Name
        </label>

        <input
          type="text"
          class="variant-name"
          placeholder="e.g Box of 6"
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
        />

      </div>

    </div>

  `;

  builder.appendChild(
    card
  );

};

window.renderBranding = function() {

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

window.loadDemoData = function() {

  const demoProducts = [

    {

      id:
        generateId(),

      sku: 'CK-001',

      name: 'Classic Cookie',

      category: 'Cookies',

      cost: 45,

      price: 85,

      stock: 24,

      reorderLevel: 5

    },

    {

      id:
        generateId(),

      sku: 'CK-002',

      name: 'Red Velvet Cookie',

      category: 'Cookies',

      cost: 55,

      price: 95,

      stock: 12,

      reorderLevel: 5

    }

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