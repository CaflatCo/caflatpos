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

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'form-row';

  row.innerHTML = `

    <input
      type="text"
      placeholder="Variant Name"
      class="variant-name"
    />

    <input
      type="number"
      placeholder="Price"
      class="variant-price"
    />

  `;

  builder.appendChild(row);

};

window.addRecipeRow = function() {

  const builder =
    document.getElementById(
      'recipeBuilder'
    );

  if (!builder) return;

  const row =
    document.createElement(
      'div'
    );

  row.className =
    'recipe-row form-row';

  row.innerHTML = `

    <input
      type="text"
      placeholder="Ingredient ID"
      class="recipe-ingredient"
    />

    <input
      type="number"
      placeholder="Quantity"
      class="recipe-qty"
    />

  `;

  builder.appendChild(row);

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
      document.getElementById(
        'setTaxRate'
      )?.value || 0,

    receiptFooter:
      document.getElementById(
        'setReceiptFooter'
      )?.value || ''

  };

  APP_STATE.settings =
    settings;

  localStorage.setItem(

    'caflat_settings',

    JSON.stringify(settings)

  );

  alert(
    'Settings saved'
  );

};

window.loadDemoData = function() {

  APP_STATE.products = [

    {

      id: 1,

      name: 'Demo Cookie',

      price: 100,

      stock: 20

    }

  ];

  renderProductsTable();

  alert(
    'Demo data loaded'
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