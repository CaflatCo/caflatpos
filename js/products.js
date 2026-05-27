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

window.Product =
  Product;

window.editingProductId =
  null;

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
      '.variant-row'
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
            'productLowStock'
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
    'productLowStock',
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

        <td colspan="8">

          No products found

        </td>

      </tr>

    `;

    return;

  }

  products.forEach(product => {

    const row =
      document.createElement(
        'tr'
      );

    row.innerHTML = `

      <td>${product.sku}</td>

      <td>${product.name}</td>

      <td>${product.category}</td>

      <td>${formatCurrency(product.cost)}</td>

      <td>${formatCurrency(product.price)}</td>

      <td>${product.margin}%</td>

      <td>${product.stock}</td>

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

function renderPOSProducts() {

  const container =
    safeGetById(
      'posProducts'
    );

  if (!container) return;

  container.innerHTML = '';

  getProducts().forEach(product => {

    const card =
      document.createElement(
        'button'
      );

    card.className =
      'pos-product-card';

    card.innerHTML = `

      <div class="pos-product-name">

        ${product.name}

      </div>

      <div class="pos-product-price">

        ${formatCurrency(product.price)}

      </div>

    `;

    card.onclick = () => {

      addToCart(product.id);

    };

    container.appendChild(card);

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
    'productLowStock'
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

  }

);