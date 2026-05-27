class Product {

  constructor(data = {}) {

    this.id =
      data.id || generateId();

    this.sku =
      data.sku || '';

    this.name =
      data.name || '';

    this.description =
      data.description || '';

    this.category =
      data.category || '';

    this.image =
      data.image || '';

    this.type =
      data.type || 'standard';

    this.cost =
      Number(data.cost || 0);

    this.price =
      Number(data.price || 0);

    this.stock =
      Number(data.stock || 0);

    this.lowStockThreshold =
      Number(data.lowStockThreshold || 5);

    this.margin =
      Number(data.margin || 0);

    this.batchYield =
      Number(data.batchYield || 1);

    this.recipeMode =
      data.recipeMode || 'per-item';

    this.recipe =
      Array.isArray(data.recipe)
        ? data.recipe
        : [];

    this.variants =
      Array.isArray(data.variants)
        ? data.variants
        : [];

    this.createdAt =
      data.createdAt ||
      new Date().toISOString();

    this.updatedAt =
      data.updatedAt ||
      new Date().toISOString();

  }

}

window.Product = Product;

window.editingProductId = null;

function getProducts() {

  return APP_STATE.products || [];

}

function setProducts(products) {

  updateState(
    'products',
    () => products
  );

}

function normalizeProduct(data = {}) {

  return new Product(data);

}

function calculateMargin(cost, price) {

  if (price <= 0) {

    return 0;

  }

  return Number(

    (
      (
        (price - cost) /
        price
      ) * 100
    ).toFixed(2)

  );

}

function collectRecipeItems() {

  const rows =
    document.querySelectorAll(
      '#recipeBuilder .recipe-row'
    );

  return [...rows]

    .map(row => {

      return {

        ingredientId:
          row.querySelector(
            '.recipe-ingredient'
          )?.value || '',

        quantity:
          Number(
            row.querySelector(
              '.recipe-qty'
            )?.value || 0
          )

      };

    })

    .filter(item =>
      item.ingredientId
    );

}

function collectVariants() {

  const rows =
    document.querySelectorAll(
      '.variant-card'
    );

  return [...rows]

    .map(row => {

      return {

        name:
          row.querySelector(
            '.variant-name'
          )?.value || '',

        price:
          Number(
            row.querySelector(
              '.variant-price'
            )?.value || 0
          )

      };

    })

    .filter(variant =>
      variant.name
    );

}

function saveProduct() {

  const cost =
    Number(
      safeGetById(
        'productCost'
      )?.value || 0
    );

  const price =
    Number(
      safeGetById(
        'productPrice'
      )?.value || 0
    );

  const product =

    normalizeProduct({

      id:
        editingProductId ||
        generateId(),

      sku:
        safeGetById(
          'productSKU'
        )?.value,

      name:
        safeGetById(
          'productNameInput'
        )?.value,

      description:
        safeGetById(
          'productDescription'
        )?.value,

      category:
        safeGetById(
          'productCategory'
        )?.value,

      type:
        safeGetById(
          'productType'
        )?.value ||
        'standard',

      cost,

      price,

      stock:
        Number(
          safeGetById(
            'productStock'
          )?.value || 0
        ),

      lowStockThreshold:
        Number(
          safeGetById(
            'productReorder'
          )?.value || 5
        ),

      margin:
        calculateMargin(
          cost,
          price
        ),

      batchYield:
        Number(
          safeGetById(
            'batchYield'
          )?.value || 1
        ),

      recipeMode:
        safeGetById(
          'recipeMode'
        )?.value ||
        'per-item',

      recipe:
        collectRecipeItems(),

      variants:
        collectVariants(),

      updatedAt:
        new Date().toISOString()

    });

  let products =
    getProducts();

  if (editingProductId) {

    products =
      products.map(item =>

        String(item.id) ===
        String(editingProductId)

          ? product

          : item

      );

  }

  else {

    products.push(product);

  }

  setProducts(products);

  editingProductId =
    null;

  renderProductsTable();

  renderPOSProducts();

  renderCategoryTabs();

  closeModal(
    'productModal'
  );

  resetProductForm();

  showNotification(
    'Product saved',
    'success'
  );

}

function resetProductForm() {

  const fields = [

    'productSKU',
    'productNameInput',
    'productDescription',
    'productCost',
    'productPrice',
    'productStock',
    'productReorder',
    'batchYield'

  ];

  fields.forEach(id => {

    const field =
      safeGetById(id);

    if (field) {

      field.value = '';

    }

  });

  const recipeBuilder =
    safeGetById(
      'recipeBuilder'
    );

  if (recipeBuilder) {

    recipeBuilder.innerHTML = '';

  }

  const variants =
    safeGetById(
      'variantBuilder'
    );

  if (variants) {

    variants.innerHTML = '';

  }

}

function renderProductsTable() {

  const tableBody =
    safeQuery(
      '#productsTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const products =
    getProducts();

  if (!products.length) {

    tableBody.innerHTML = `

      <tr>
        <td colspan="9">
          No products found
        </td>
      </tr>

    `;

    return;

  }

  products.forEach(product => {

    const isLowStock =

      Number(product.stock || 0)

      <=

      Number(
        product.lowStockThreshold || 0
      );

    const row =
      document.createElement(
        'tr'
      );

    row.className =
      isLowStock
        ? 'low-stock-row'
        : '';

    row.innerHTML = `

      <td>${product.sku}</td>

      <td>${product.name}</td>

      <td>${product.category}</td>

      <td>${formatCurrency(product.cost)}</td>

      <td>${formatCurrency(product.price)}</td>

      <td>${product.margin}%</td>

      <td>${product.stock}</td>

      <td>

        ${
          isLowStock

            ? `
              <span class="badge-low-stock">
                LOW STOCK
              </span>
            `

            : `
              <span class="badge-ok">
                OK
              </span>
            `
        }

      </td>

      <td>

        <button
          class="btn btn-sm"
          onclick="editProduct('${product.id}')">

          Edit

        </button>

        <button
          class="btn btn-sm"
          onclick="deleteProduct('${product.id}')">

          Delete

        </button>

      </td>

    `;

    tableBody.appendChild(row);

  });

}

function renderPOSProducts(
  category = 'All'
) {

  const container =
    safeGetById(
      'productGrid'
    );

  if (!container) return;

  container.innerHTML = '';

  let products =
    getProducts();

  if (
    category &&
    category !== 'All'
  ) {

    products =
      products.filter(

        product =>

          product.category ===
          category
      );

  }

  if (!products.length) {

    container.innerHTML = `

      <div class="empty-state">

        No products available

      </div>

    `;

    return;

  }

  products.forEach(product => {

    const isLowStock =

      Number(product.stock || 0)

      <=

      Number(
        product.lowStockThreshold || 0
      );

    const isOutOfStock =

      Number(product.stock || 0)
      <= 0;

    const card =
      document.createElement(
        'button'
      );

    card.className =
      `
        pos-product-card
        ${isLowStock ? 'low-stock' : ''}
        ${isOutOfStock ? 'out-of-stock' : ''}
      `;

    card.innerHTML = `

      <div class="pos-card-top">

        <div class="pos-category-badge">

          ${product.category || 'General'}

        </div>

        ${
          isLowStock

            ? `
              <div class="pos-low-stock-pill">
                Low Stock
              </div>
            `

            : ''
        }

      </div>

      <div class="pos-product-body">

        <div class="pos-product-name">

          ${product.name}

        </div>

        <div class="pos-product-description">

          ${
            product.description ||
            'Freshly prepared'
          }

        </div>

      </div>

      <div class="pos-product-footer">

        <div class="pos-product-price">

          ${formatCurrency(product.price)}

        </div>

        <div class="pos-product-stock">

          ${product.stock} left

        </div>

      </div>

    `;

    if (!isOutOfStock) {

      card.onclick = () => {

        addToCart(
          product.id
        );

      };

    }

    container.appendChild(card);

  });

}

function renderCategoryTabs() {

  const container =
    safeGetById(
      'categoryTabs'
    );

  if (!container) return;

  const categories = [

    'All',

    ...new Set(

      getProducts().map(
        product =>
          product.category
      )
    )

  ];

  container.innerHTML = '';

  categories.forEach(category => {

    const button =
      document.createElement(
        'button'
      );

    button.textContent =
      category;

    button.className =
      category === 'All'
        ? 'active'
        : '';

    button.onclick = () => {

      container
        .querySelectorAll(
          'button'
        )
        .forEach(btn =>

          btn.classList.remove(
            'active'
          )
        );

      button.classList.add(
        'active'
      );

      renderPOSProducts(
        category
      );

    };

    container.appendChild(
      button
    );

  });

}

function editProduct(id) {

  const product =
    getProducts().find(
      item =>
        String(item.id) ===
        String(id)
    );

  if (!product) return;

  editingProductId =
    product.id;

  safeGetById(
    'productSKU'
  ).value =
    product.sku;

  safeGetById(
    'productNameInput'
  ).value =
    product.name;

  safeGetById(
    'productDescription'
  ).value =
    product.description;

  safeGetById(
    'productCategory'
  ).value =
    product.category;

  safeGetById(
    'productCost'
  ).value =
    product.cost;

  safeGetById(
    'productPrice'
  ).value =
    product.price;

  safeGetById(
    'productStock'
  ).value =
    product.stock;

  safeGetById(
    'productReorder'
  ).value =
    product.lowStockThreshold;

  safeGetById(
    'batchYield'
  ).value =
    product.batchYield;

  openModal(
    'productModal'
  );

}

function deleteProduct(id) {

  const updated =

    getProducts().filter(
      product =>

        String(product.id) !==
        String(id)
    );

  setProducts(updated);

  renderProductsTable();

  renderPOSProducts();

  renderCategoryTabs();

  showNotification(
    'Product deleted',
    'success'
  );

}

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderProductsTable();

    renderPOSProducts();

    renderCategoryTabs();

  }

);