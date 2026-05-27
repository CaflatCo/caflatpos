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
    safeGetById(
      'productsTableBody'
    );

  if (!tableBody) return;

  tableBody.innerHTML = '';

  const products =
    getProducts();

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

  const products =
    getProducts();

  products.forEach(product => {

    const card =
      document.createElement(
        'div'
      );

    card.className =
      `pos-product-card ${
        Number(product.stock || 0) <= 0
          ? 'out-of-stock'
          : ''
      }`;

    card.onclick = () => {

      if (
        Number(product.stock || 0) <= 0
      ) return;

      addToCart(product.id);

    };

    card.innerHTML = `

      <div class="pos-card-top">

        <div class="pos-category-badge">

          ${product.category}

        </div>

        ${
          Number(product.stock || 0) <=
          Number(product.lowStockLevel || 5)

            ? `
              <div class="pos-low-stock-pill">

                LOW STOCK

              </div>
            `

            : ''
        }

      </div>

      <div
        class="pos-product-body"
        style="
          text-align:center;
          align-items:center;
        ">

        <div class="pos-product-name">

          ${product.name}

        </div>

        ${
          product.description

            ? `
              <div class="pos-product-description">

                ${product.description}

              </div>
            `

            : ''
        }

      </div>

      <div class="pos-product-footer">

        <div class="pos-product-price">

          ${formatCurrency(product.price)}

        </div>

        <div class="pos-product-stock">

          ${product.stock} LEFT

        </div>

      </div>

    `;

    container.appendChild(card);

  });

}

function saveProduct(data) {

  const products =
    getProducts();

  if (data.id) {

    const index =
      products.findIndex(

        item =>

          String(item.id) ===
          String(data.id)
      );

    if (index !== -1) {

      products[index] = data;

    }

  }

  else {

    products.push({

      ...data,

      id:
        generateId()

    });

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

        String(item.id) ===
        String(id)
    );

  if (!product) return;

  safeGetById(
    'productId'
  ).value = product.id;

  safeGetById(
    'productName'
  ).value = product.name;

  safeGetById(
    'productSKU'
  ).value = product.sku;

  safeGetById(
    'productCategory'
  ).value = product.category;

  safeGetById(
    'productPrice'
  ).value = product.price;

  safeGetById(
    'productCost'
  ).value = product.cost;

  safeGetById(
    'productStock'
  ).value = product.stock;

  safeGetById(
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

        String(item.id) !==
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