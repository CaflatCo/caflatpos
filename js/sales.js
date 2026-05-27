function getProducts() {

  return APP_STATE.products || [];

}

function setProducts(products) {

  updateState(
    'products',
    () => products
  );

}

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

    const row = document.createElement('tr');

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

function openProductModal() {

  openModal('productModal');

}

function closeProductModal() {

  closeModal('productModal');

}

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

async function saveProduct() {

  const name =
    safeGetById(
      'productName'
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
      'productSku'
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

  const product = {

    sku,

    name,

    category,

    cost,

    price,

    stock,

    margin,

    recipe:
      collectRecipeItems()

  };

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

function editProduct(productId) {

  console.log(
    'Edit product:',
    productId
  );

}

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

document.addEventListener(
  'DOMContentLoaded',
  renderProductsTable
);

function initializeProductEventListeners() {

  const addVariantBtn =
    safeGetById('addVariantBtn');

  if (addVariantBtn) {

    addVariantBtn.addEventListener(
      'click',
      addVariantRow
    );

  }

  const recipeMode =
    safeGetById('recipeMode');

  if (recipeMode) {

    recipeMode.addEventListener(
      'change',
      toggleRecipeMode
    );

  }

  const addRecipeBtn =
    safeGetById('addRecipeBtn');

  if (addRecipeBtn) {

    addRecipeBtn.addEventListener(
      'click',
      addRecipeRow
    );

  }

  const closeBtn =
    safeGetById(
      'closeProductModalBtn'
    );

  if (closeBtn) {

    closeBtn.addEventListener(
      'click',
      () => closeModal('productModal')
    );

  }

  const saveBtn =
    safeGetById(
      'saveProductBtn'
    );

  if (saveBtn) {

    saveBtn.addEventListener(
      'click',
      saveProduct
    );

  }

}

document.addEventListener(
  'DOMContentLoaded',
  initializeProductEventListeners
);

registerCommand(
  'createProduct',

  async payload => {

    return await runTransaction(
      'create-product',

      async () => {

        const product =
          payload.product;

        const valid =
          validateProductData(
            product
          );

        if (!valid) {

          return false;

        }

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

              {

                ...product,

                id:
                  Date.now()

              }

            ];

          }
        );

        showNotification(
          'Product created successfully',
          'info'
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