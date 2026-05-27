function getProducts() {

  return APP_STATE.products || [];

}

function setProducts(products) {

  updateState(
    'products',
    () => products
  );

  renderProductsTable();

  renderPOSProducts();

  if (
    typeof renderCategoryOptions
    ===
    'function'
  ) {

    renderCategoryOptions();

  }

}

function resetProductForm() {

  const fields = [

    'productId',
    'productSKU',
    'productNameInput',
    'productCategory',
    'productCost',
    'productPrice',
    'productStock',
    'productReorder',
    'productDescription',
    'productType',
    'batchYield'

  ];

  fields.forEach(id => {

    const el =
      document.getElementById(id);

    if (!el) return;

    if (
      el.tagName === 'SELECT'
    ) {

      el.selectedIndex = 0;

    } else {

      el.value = '';

    }

  });

  const recipeBuilder =
    document.getElementById(
      'recipeBuilder'
    );

  if (recipeBuilder) {

    recipeBuilder.innerHTML = '';

  }

  const variantBuilder =
    document.getElementById(
      'variantBuilder'
    );

  if (variantBuilder) {

    variantBuilder.innerHTML = '';

  }

  const batchYieldWrap =
    document.getElementById(
      'batchYieldWrap'
    );

  if (batchYieldWrap) {

    batchYieldWrap.style.display =
      'none';

  }

  const recipeMode =
    document.getElementById(
      'recipeMode'
    );

  if (recipeMode) {

    recipeMode.value = 'unit';

  }

  const batchYield =
    document.getElementById(
      'batchYield'
    );

  if (batchYield) {

    batchYield.value = 1;

  }

}

function ensureCategory(category) {

  const name =
    String(category || '')
      .trim();

  if (!name) return;

  const categories =

    Array.isArray(
      APP_STATE.categories
    )

      ? [...APP_STATE.categories]

      : [];

  if (!categories.includes(name)) {

    categories.push(name);

    updateState(
      'categories',
      () => categories
    );

  }

}

function getVisibleProducts() {

  const products =
    getProducts();

  const search =

    (
      document.getElementById(
        'productSearch'
      )?.value || ''
    )

      .trim()
      .toLowerCase();

  const categoryFilter =

    document.getElementById(
      'productCategoryFilter'
    )?.value || '';

  return products.filter(product => {

    const matchesSearch =

      !search ||

      [
        product.sku,
        product.name,
        product.category,
        product.description
      ].some(value =>

        String(value || '')
          .toLowerCase()
          .includes(search)

      );

    const matchesCategory =

      !categoryFilter ||

      String(product.category || '')
      ===
      String(categoryFilter);

    return (
      matchesSearch &&
      matchesCategory
    );

  });

}

function renderProductsTable() {

  const tableBody =
    document.querySelector(
      '#productsTable tbody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const products =
    getVisibleProducts();

  if (!products.length) {

    tableBody.innerHTML = `

      <tr>

        <td
          colspan="8"
          class="empty-state centered-empty-state">

          No products found

        </td>

      </tr>

    `;

    return;

  }

  products.forEach(product => {

    const cost =
      Number(product.cost || 0);

    const price =
      Number(product.price || 0);

    const margin =

      price > 0

        ? Math.round(
            (
              (
                price - cost
              )
              /
              price
            ) * 100
          )

        : 0;

    const stock =
      Number(product.stock || 0);

    const reorderLevel =
      Number(
        product.reorderLevel || 0
      );

    const row =
      document.createElement(
        'tr'
      );

    if (
      stock <= reorderLevel
    ) {

      row.classList.add(
        'low-stock-row'
      );

    }

    row.innerHTML = `

      <td>
        ${product.sku || '-'}
      </td>

      <td>
        ${product.name || '-'}
      </td>

      <td>
        ${product.category || '-'}
      </td>

      <td>
        ${formatCurrency(cost)}
      </td>

      <td>
        ${formatCurrency(price)}
      </td>

      <td>
        ${margin}%
      </td>

      <td>
        ${stock}
      </td>

      <td>

        <div class="table-actions">

          <button
            class="btn btn-sm"
            type="button"
            onclick="editProduct('${product.id}')">

            Edit

          </button>

          <button
            class="btn btn-sm"
            type="button"
            onclick="deleteProduct('${product.id}')">

            Delete

          </button>

        </div>

      </td>

    `;

    tableBody.appendChild(row);

  });

}

function collectRecipeItems() {

  const rows =
    document.querySelectorAll(
      '#recipeBuilder .recipe-row'
    );

  const recipe = [];

  rows.forEach(row => {

    const ingredientId =
      row.querySelector(
        '.recipe-ingredient'
      )?.value || '';

    const quantity =
      Number(
        row.querySelector(
          '.recipe-qty'
        )?.value || 0
      );

    if (
      ingredientId &&
      quantity > 0
    ) {

      recipe.push({

        ingredientId,
        quantity

      });

    }

  });

  return recipe;

}

function collectVariants() {

  const rows =
    document.querySelectorAll(
      '#variantBuilder .variant-card'
    );

  const variants = [];

  rows.forEach(row => {

    const name =
      row.querySelector(
        '.variant-name'
      )?.value || '';

    const price =
      Number(
        row.querySelector(
          '.variant-price'
        )?.value || 0
      );

    if (name.trim()) {

      variants.push({

        id:
          generateId(),

        name:
          name.trim(),

        price

      });

    }

  });

  return variants;

}

function openVariantSelector(
  product
) {

  const modal =
    document.getElementById(
      'variantModal'
    );

  const options =
    document.getElementById(
      'variantOptions'
    );

  if (!modal || !options)
    return;

  options.innerHTML = '';

  if (
    !Array.isArray(
      product.variants
    ) ||
    !product.variants.length
  ) {

    return;

  }

  product.variants.forEach(
    variant => {

      const button =
        document.createElement(
          'button'
        );

      button.type = 'button';

      button.className =
        'variant-option';

      button.innerHTML = `

        <div class="variant-option-name">

          ${variant.name}

        </div>

        <div class="variant-option-price">

          ${formatCurrency(
            Number(
              variant.price || 0
            )
          )}

        </div>

      `;

      button.addEventListener(
        'click',
        () => {

          addToCart(
            product.id,
            variant
          );

          closeModal(
            'variantModal'
          );

        }
      );

      options.appendChild(button);

    }
  );

  openModal(
    'variantModal'
  );

}

function renderPOSProducts() {

  const grid =
    document.getElementById(
      'productGrid'
    );

  if (!grid) return;

  const products =
    getVisibleProducts();

  grid.innerHTML = '';

  if (!products.length) {

    grid.innerHTML = `

      <div class="empty-state centered-empty-state">

        No products available

      </div>

    `;

    return;

  }

  products.forEach(product => {

    const stock =
      Number(product.stock || 0);

    const reorderLevel =
      Number(
        product.reorderLevel || 0
      );

    const hasVariants =

      Array.isArray(
        product.variants
      )

      &&

      product.variants.length > 0;

    const card =
      document.createElement(
        'button'
      );

    card.type = 'button';

    card.className =
      'pos-product-card';

    if (
      stock <= reorderLevel
    ) {

      card.classList.add(
        'low-stock'
      );

    }

    if (stock <= 0) {

      card.classList.add(
        'out-of-stock'
      );

    }

    card.addEventListener(
      'click',
      () => {

        if (stock <= 0)
          return;

        addToCart(
          product.id
        );

      }
    );

    card.innerHTML = `

      <div class="pos-card-top">

        <div class="pos-category-badge">

          ${product.category || 'General'}

        </div>

      </div>

      <div class="pos-product-body">

        <div class="pos-product-name">

          ${product.name || '-'}

        </div>

      </div>

      <div class="pos-product-footer">

        <div class="pos-product-price">

          ${formatCurrency(
            Number(
              product.price || 0
            )
          )}

        </div>

        <div class="pos-product-stock">

          ${stock} LEFT

        </div>

      </div>

      ${
        hasVariants

          ? `

            <div class="product-card-actions">

              <button
                type="button"
                class="btn btn-secondary btn-sm product-options-btn">

                Options

              </button>

            </div>

          `

          : ''
      }

    `;

    const optionsBtn =
      card.querySelector(
        '.product-options-btn'
      );

    if (optionsBtn) {

      optionsBtn.addEventListener(
        'click',
        e => {

          e.stopPropagation();

          openVariantSelector(
            product
          );

        }
      );

    }

    grid.appendChild(card);

  });

}

function saveProduct() {

  const name =
    document.getElementById(
      'productNameInput'
    )?.value?.trim() || '';

  if (!name) {

    showNotification(
      'Product name is required',
      'error'
    );

    return;

  }

  const category =
    document.getElementById(
      'productCategory'
    )?.value?.trim() || '';

  const productId =
    document.getElementById(
      'productId'
    )?.value || '';

  const products =
    getProducts();

  const product = {

    id:
      productId ||
      generateId(),

    sku:
      document.getElementById(
        'productSKU'
      )?.value?.trim() || '',

    name,

    category,

    cost:
      Number(
        document.getElementById(
          'productCost'
        )?.value || 0
      ),

    price:
      Number(
        document.getElementById(
          'productPrice'
        )?.value || 0
      ),

    stock:
      Number(
        document.getElementById(
          'productStock'
        )?.value || 0
      ),

    reorderLevel:
      Number(
        document.getElementById(
          'productReorder'
        )?.value || 0
      ),

    description:
      document.getElementById(
        'productDescription'
      )?.value || '',

    productType:
      document.getElementById(
        'productType'
      )?.value || 'standard',

    recipeMode:
      document.getElementById(
        'recipeMode'
      )?.value || 'unit',

    batchYield:
      Number(
        document.getElementById(
          'batchYield'
        )?.value || 1
      ),

    recipe:
      collectRecipeItems(),

    variants:
      collectVariants(),

    updatedAt:
      new Date().toISOString()

  };

  ensureCategory(category);

  const existingIndex =
    products.findIndex(

      item =>

        String(item.id)
        ===
        String(product.id)

    );

  if (existingIndex !== -1) {

    products[existingIndex] =
      product;

  } else {

    products.push(product);

  }

  setProducts(products);

  closeModal(
    'productModal'
  );

  resetProductForm();

  showNotification(
    'Product saved',
    'success'
  );

}

function editProduct(id) {

  const product =
    getProducts().find(

      item =>

        String(item.id)
        ===
        String(id)

    );

  if (!product) return;

  document.getElementById(
    'productId'
  ).value =
    product.id || '';

  document.getElementById(
    'productSKU'
  ).value =
    product.sku || '';

  document.getElementById(
    'productNameInput'
  ).value =
    product.name || '';

  document.getElementById(
    'productCategory'
  ).value =
    product.category || '';

  document.getElementById(
    'productCost'
  ).value =
    product.cost || 0;

  document.getElementById(
    'productPrice'
  ).value =
    product.price || 0;

  document.getElementById(
    'productStock'
  ).value =
    product.stock || 0;

  document.getElementById(
    'productReorder'
  ).value =
    product.reorderLevel || 0;

  document.getElementById(
    'productDescription'
  ).value =
    product.description || '';

  document.getElementById(
    'productType'
  ).value =
    product.productType || 'standard';

  document.getElementById(
    'recipeMode'
  ).value =
    product.recipeMode || 'unit';

  document.getElementById(
    'batchYield'
  ).value =
    product.batchYield || 1;

  const variantBuilder =
    document.getElementById(
      'variantBuilder'
    );

  if (variantBuilder) {

    variantBuilder.innerHTML = '';

    (
      product.variants || []
    ).forEach(variant => {

      addVariantRow({

        label:
          variant.name,

        price:
          variant.price

      });

    });

  }

  const recipeBuilder =
    document.getElementById(
      'recipeBuilder'
    );

  if (recipeBuilder) {

    recipeBuilder.innerHTML = '';

    (
      product.recipe || []
    ).forEach(item => {

      addRecipeRow(item);

    });

  }

  if (
    typeof toggleRecipeMode
    ===
    'function'
  ) {

    toggleRecipeMode();

  }

  openModal(
    'productModal'
  );

}

function deleteProduct(id) {

  const confirmed =
    confirm(
      'Delete product?'
    );

  if (!confirmed) return;

  const updated =
    getProducts().filter(

      item =>

        String(item.id)
        !==
        String(id)

    );

  setProducts(updated);

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

window.getProducts =
  getProducts;

window.setProducts =
  setProducts;

window.renderProductsTable =
  renderProductsTable;

window.renderPOSProducts =
  renderPOSProducts;

window.saveProduct =
  saveProduct;

window.editProduct =
  editProduct;

window.deleteProduct =
  deleteProduct;

window.openVariantSelector =
  openVariantSelector;

window.resetProductForm =
  resetProductForm;