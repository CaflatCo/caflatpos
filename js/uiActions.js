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

  updateState(
    'products',
    () => demoProducts
  );

  renderProductsTable();

  renderPOSProducts();

  showNotification(
    'Demo data loaded',
    'success'
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

  builder.appendChild(card);

};