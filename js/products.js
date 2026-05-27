/* =========================
   GLOBAL PRODUCT MODEL
========================= */

class Product {

  constructor(data = {}) {

    this.id =
      data.id || Date.now();

    this.sku =
      data.sku || '';

    this.name =
      data.name || '';

    this.category =
      data.category || '';

    this.cost =
      Number(data.cost || 0);

    this.price =
      Number(data.price || 0);

    this.stock =
      Number(data.stock || 0);

    this.margin =
      Number(data.margin || 0);

    this.recipe =
      data.recipe || [];

  }

}

window.Product = Product;

/* =========================
   PRODUCT STORAGE
========================= */

function getProducts() {

  return APP_STATE.products || [];

}

function setProducts(products) {

  updateState(
    'products',
    () => products
  );

}

/* =========================
   PRODUCTS TABLE
========================= */

function renderProductsTable() {

  const tableBody = safeQuery(
    '#productsTable tbody'
  );

  if (!tableBody) return;

  const products = getProducts();

  tableBody.innerHTML = '';

  if (!products.length) {

    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          No products found
        </td>
      </tr>
    `;

    return;

  }

  products.forEach(product => {

    const row =
      document.createElement('tr');

    row.innerHTML = `

      <td>${product.sku || '-'}</td>

      <td>${product.name || '-'}</td>

      <td>${product.category || '-'}</td>

      <td>${product.cost || 0}</td>

      <td>${product.price || 0}</td>

      <td>${product.margin || 0}%</td>

      <td>${product.stock || 0}</td>

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

/* =========================
   PRODUCT MODAL
========================= */

function openProductModal() {

  openModal('productModal');

}

function closeProductModal() {

  closeModal('productModal');

}

/* =========================
   RECIPE BUILDER
========================= */

function collectRecipeItems() {

  const rows =
    document.querySelectorAll(
      '#recipeBuilder .recipe-row'
    );

  return [...rows].map(row => {

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

  });

}

/* =========================
   SAVE PRODUCT
========================= */

async function saveProduct() {

  try {

    const name =
      safeGetById(
        'productNameInput'
      )?.value?.trim();

    const category =
      safeGetById(
        'productCategory'
      )?.value?.trim();

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

    const stock =
      Number(
        safeGetById(
          'productStock'
        )?.value || 0
      );

    const sku =
      safeGetById(
        'productSKU'
      )?.value?.trim();

    const margin =

      price > 0

        ? (

            (
              (price - cost) /
              price
            ) * 100

          ).toFixed(2)

        : 0;

    const product =

      new Product({

        sku,

        name,

        category,

        cost,

        price,

        stock,

        margin,

        recipe:
          collectRecipeItems()

      });

    const result =

      await executeCommand(

        'createProduct',

        {

          product

        }

      );

    if (!result) {

      logError(
        'Product creation failed'
      );

      return;

    }

    safeRender(

      'products-table',

      () => {

        renderProductsTable();

      }

    );

    closeProductModal();

  }

  catch (error) {

    console.error(error);

    alert(
      'Save product failed: ' +
      error.message
    );

  }

}

/* =========================
   EDIT PRODUCT
========================= */

function editProduct(productId) {

  console.log(
    'Edit product:',
    productId
  );

}

/* =========================
   DELETE PRODUCT
========================= */

function deleteProduct(productId) {

  const confirmed = confirm(
    'Delete this product?'
  );

  if (!confirmed) return;

  createAuditEntry(
    'product_deleted',
    {

      productId

    }
  );

  updateState(
    'products',

    currentProducts => {

      return currentProducts.filter(
        product =>
          product.id !== productId
      );

    }
  );

  showNotification(
    'Product deleted',
    'info'
  );

  safeRender(
    'products-table',

    () => {

      renderProductsTable();

    }
  );

}

/* =========================
   EVENT LISTENERS
========================= */

function initializeProductEventListeners() {

  const recipeMode =
    safeGetById('recipeMode');

  if (recipeMode) {

    recipeMode.addEventListener(
      'change',
      toggleRecipeMode
    );

  }

}

/* =========================
   COMMANDS
========================= */

registerCommand(

  'createProduct',

  async payload => {

    return await runTransaction(

      'create-product',

      async () => {

        const product =
          payload.product;

        createAuditEntry(

          'product_created',

          {

            productName:
              product.name

          }

        );

        updateState(

          'products',

          currentProducts => {

            return [

              ...currentProducts,

              product

            ];

          }

        );

        showNotification(

          'Product created successfully',

          'success'

        );

        emitEvent(

          'productCreated',

          product

        );

        return true;

      }

    );

  }

);

/* =========================
   INIT
========================= */

document.addEventListener(

  'DOMContentLoaded',

  () => {

    renderProductsTable();

    initializeProductEventListeners();

  }

);