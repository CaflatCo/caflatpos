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

}

function renderProductsTable() {

  const tableBody =
    document.querySelector(
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

    const margin =
      product.price > 0

        ? Math.round(
            (
              (
                product.price -
                product.cost
              )

              /

              product.price
            ) * 100
          )

        : 0;

    const row =
      document.createElement(
        'tr'
      );

    row.innerHTML = `

      <td>${product.sku || '-'}</td>

      <td>${product.name}</td>

      <td>${product.category || '-'}</td>

      <td>
        ${formatCurrency(product.cost || 0)}
      </td>

      <td>
        ${formatCurrency(product.price || 0)}
      </td>

      <td>
        ${margin}%
      </td>

      <td>
        ${product.stock || 0}
      </td>

      <td>

        <div class="table-actions">

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

        </div>

      </td>

    `;

    tableBody.appendChild(
      row
    );

  });

}

function renderPOSProducts() {

  const grid =
    document.getElementById(
      'productGrid'
    );

  if (!grid) return;

  grid.innerHTML = '';

  const products =
    getProducts();

  if (!products.length) {

    grid.innerHTML = `

      <div class="empty-state">

        No products available

      </div>

    `;

    return;

  }

  products.forEach(product => {

    const card =
      document.createElement(
        'div'
      );

    card.className =
      'pos-product-card';

    if (
      Number(product.stock || 0)
      <= 0
    ) {

      card.classList.add(
        'out-of-stock'
      );

    }

    if (
      Number(product.stock || 0)
      <=
      Number(
        product.reorderLevel || 5
      )
    ) {

      card.classList.add(
        'low-stock'
      );

    }

    card.onclick = () => {

      if (
        Number(product.stock || 0)
        <= 0
      ) return;

      addToCart(
        product.id
      );

    };

    card.innerHTML = `

      <div class="pos-card-top">

        <div class="pos-category-badge">

          ${product.category || 'General'}

        </div>

      </div>

      <div class="pos-product-body">

        <div class="pos-product-name">

          ${product.name}

        </div>

      </div>

      <div class="pos-product-footer">

        <div class="pos-product-price">

          ${formatCurrency(product.price || 0)}

        </div>

        <div class="pos-product-stock">

          ${product.stock || 0} LEFT

        </div>

      </div>

    `;

    grid.appendChild(card);

  });

}

function saveProduct() {

  const products =
    getProducts();

  const productId =
    document.getElementById(
      'productId'
    )?.value;

  const product = {

    id:
      productId ||
      generateId(),

    sku:
      document.getElementById(
        'productSKU'
      )?.value || '',

    name:
      document.getElementById(
        'productNameInput'
      )?.value || '',

    category:
      document.getElementById(
        'productCategory'
      )?.value || '',

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
      )?.value || ''

  };

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

  }

  else {

    products.push(
      product
    );

  }

  setProducts(products);

  closeModal(
    'productModal'
  );

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
    product.id;

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